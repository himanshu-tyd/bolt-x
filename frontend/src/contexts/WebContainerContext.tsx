import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { WebContainer } from "@webcontainer/api";
import type { FileSystemTree } from "@webcontainer/api";
import { toast } from "sonner";

// Single shared instance
let webContainerInstance: WebContainer | null = null;

// Create a storage for file contents
const storedFiles = localStorage.getItem('webcontainer_files');
const initialFiles: Record<string, string> = storedFiles ? JSON.parse(storedFiles) : {};

// Mock implementation for environments where WebContainer can't run
const createMockWebContainer = () => {
  console.warn("Using mock WebContainer implementation");
  
  const mockContainer = {
    mount: async () => {
      console.log("[Mock] Files mounted successfully");
      return Promise.resolve();
    },
    spawn: async (command: string, args: string[] = []) => {
      console.log(`[Mock] Running command: ${command} ${args.join(' ')}`);
      return {
        output: {
          pipeTo: (writable: WritableStream) => {
            const writer = writable.getWriter();
            writer.write(`[Mock] Simulating output for ${command} ${args.join(' ')}\n`);
            writer.close();
          }
        },
        exit: Promise.resolve(0)
      };
    }
  };
  
  return mockContainer as unknown as WebContainer;
};

interface WebContainerContextType {
  webContainer?: WebContainer;
  isLoading: boolean;
  mountFiles: (files: Record<string, string>) => Promise<void>;
  runCommand: (command: string, args?: string[]) => Promise<string>;
  terminal?: HTMLElement;
  setTerminalEl: (el: HTMLElement | null) => void;
  containerReady: boolean;
  fileContents: Record<string, string>;
  setFileContents: (files: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
}

const WebContainerContext = createContext<WebContainerContextType | undefined>(undefined);

export const WebContainerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [webContainer, setWebContainer] = useState<WebContainer>();
  const [isLoading, setIsLoading] = useState(true);
  const [terminal, setTerminal] = useState<HTMLElement>();
  const [containerReady, setContainerReady] = useState(false);
  const [fileContents, setFileContentsState] = useState<Record<string, string>>(initialFiles);
  const isMockMode = useRef(false);
  const initStarted = useRef(false);
  const firstMount = useRef(true);

  // Store files in localStorage whenever they change
  const setFileContents = useCallback((files: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => {
    setFileContentsState(prev => {
      const newFiles = typeof files === 'function' ? files(prev) : { ...prev, ...files };
      localStorage.setItem('webcontainer_files', JSON.stringify(newFiles));
      return newFiles;
    });
  }, []);

  // Initialize WebContainer
  useEffect(() => {
    async function bootWebContainer() {
      // Prevent multiple initialization attempts
      if (initStarted.current) return;
      initStarted.current = true;
      
      try {
        setIsLoading(true);
        
        // Check if CrossOriginIsolated is available
        if (!window.crossOriginIsolated) {
          console.warn(
            "CrossOriginIsolated is not available. WebContainer requires COOP/COEP headers."
          );
          toast.warning("Running in limited mode - WebContainer features disabled", {
            duration: 5000,
          });
          
          // Use mock implementation when isolation not available
          const mockContainer = createMockWebContainer();
          setWebContainer(mockContainer);
          isMockMode.current = true;
          setContainerReady(true);
          setIsLoading(false);
          return;
        }
        
        // Use existing instance or create a new one
        if (!webContainerInstance) {
          console.log("Creating new WebContainer instance");
          try {
            webContainerInstance = await WebContainer.boot();
            toast.success("WebContainer initialized successfully");
          } catch (error) {
            console.error("WebContainer boot failed, using mock:", error);
            webContainerInstance = createMockWebContainer() as any;
            isMockMode.current = true;
            toast.warning("Running in limited mode - WebContainer features disabled", {
              duration: 5000,
            });
          }
        }
        
        setWebContainer(webContainerInstance);
        setContainerReady(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize WebContainer:", error);
        setIsLoading(false);
        
        // Fallback to mock
        const mockContainer = createMockWebContainer();
        setWebContainer(mockContainer);
        isMockMode.current = true;
        setContainerReady(true);
      }
    }

    bootWebContainer();
  }, []);

  const setTerminalEl = useCallback((el: HTMLElement | null) => {
    if (el) setTerminal(el);
  }, []);

  // Mount files to the container
  const mountFiles = useCallback(
    async (filesToMount?: Record<string, string>) => {
      if (!webContainer) {
        console.error("WebContainer not initialized");
        return;
      }

      try {
        // Use provided files or current fileContents
        const filesToProcess = filesToMount || fileContents;
        if (Object.keys(filesToProcess).length === 0) {
          console.log("No files to mount");
          return;
        }

        // Convert flat file contents to WebContainer file structure
        const filesTree: FileSystemTree = {};
        
        for (const [path, content] of Object.entries(filesToProcess)) {
          // Skip empty or invalid paths
          if (!path || path === '/') continue;
          
          // Handle nested directories
          const parts = path.split('/').filter(Boolean);
          const fileName = parts.pop() || '';
          let currentLevel = filesTree;
          
          // Create nested structure
          for (const part of parts) {
            if (!currentLevel[part]) {
              currentLevel[part] = { directory: {} };
            }
            currentLevel = currentLevel[part].directory as Record<string, any>;
          }
          
          // Add the file
          currentLevel[fileName] = {
            file: { contents: content }
          };
        }
        
        console.log(`${isMockMode.current ? '[Mock] ' : ''}Mounting files...`, Object.keys(filesToProcess).length);
        await webContainer.mount(filesTree);
        console.log(`${isMockMode.current ? '[Mock] ' : ''}Files mounted successfully`);
      } catch (error) {
        console.error("Error mounting files:", error);
      }
    },
    [webContainer, fileContents]
  );

  // Check for stored files and mount them when WebContainer becomes ready
  useEffect(() => {
    if (webContainer && containerReady && firstMount.current) {
      firstMount.current = false;
      if (Object.keys(fileContents).length > 0) {
        console.log("Mounting stored files to WebContainer");
        mountFiles(fileContents).catch(console.error);
      }
    }
  }, [webContainer, containerReady, mountFiles, fileContents]);

  // Run a command in the container
  const runCommand = useCallback(
    async (command: string, args: string[] = []): Promise<string> => {
      if (!webContainer) {
        return Promise.reject("WebContainer not initialized");
      }

      try {
        console.log(`${isMockMode.current ? '[Mock] ' : ''}Running command: ${command} ${args.join(' ')}`);
        
        // Start the specified command
        const process = await webContainer.spawn(command, args);
        
        // Store output to return
        let outputData = '';
        
        // Connect process output to the terminal if available
        if (terminal) {
          process.output.pipeTo(
            new WritableStream({
              write(data) {
                terminal.innerHTML += data;
                outputData += data;
              }
            })
          );
        } else {
          // If no terminal, just collect output
          process.output.pipeTo(
            new WritableStream({
              write(data) {
                outputData += data;
                console.log(data);
              }
            })
          );
        }
        
        // Wait for process to exit
        const exitCode = await process.exit;
        
        if (exitCode !== 0 && !isMockMode.current) {
          throw new Error(`Command failed with exit code ${exitCode}`);
        }
        
        return outputData;
      } catch (error) {
        console.error(`Error running command '${command}':`, error);
        return Promise.reject(error);
      }
    },
    [webContainer, terminal]
  );

  const value = {
    webContainer,
    isLoading,
    mountFiles,
    runCommand,
    terminal,
    setTerminalEl,
    containerReady,
    fileContents,
    setFileContents
  };

  return (
    <WebContainerContext.Provider value={value}>
      {children}
    </WebContainerContext.Provider>
  );
};

export const useWebContainer = () => {
  const context = useContext(WebContainerContext);
  if (context === undefined) {
    throw new Error('useWebContainer must be used within a WebContainerProvider');
  }
  return context;
}; 