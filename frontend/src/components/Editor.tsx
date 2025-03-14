import * as React from "react";
import Editor from "@monaco-editor/react";
import { Bolt, ChevronRight, Terminal, Play, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import FileExplorer from "./FileExprorel";
import { api } from "@/lib/axiosInstance";
import { toast } from "sonner";
import { parseXml } from "@/lib/Steps";
import { Step, StepType } from "@/lib/types";
import { useWebContainer } from "@/contexts/WebContainerContext";
import { useRef } from "react";

interface EditorPageProps {
  prompts: {
    data: {
      prompts: string[];
      uiPrompt: string[];
    };
    userPrompt: string;
  };
}

export default function EditorPage({ prompts }: EditorPageProps) {
  const [selectedFile, setSelectedFile] = React.useState("/src/components/Button.tsx");
  const [steps, setSteps] = React.useState<Step[]>([]);
  const [view, setView] = React.useState<'code' | 'preview'>('code');
  const {
    webContainer, 
    isLoading, 
    mountFiles, 
    runCommand, 
    terminal, 
    setTerminalEl,
    fileContents,
    setFileContents
  } = useWebContainer();

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
  };

  async function init() {
    try {
      const { data, userPrompt } = prompts!;
      
      if (data?.uiPrompt && data.uiPrompt.length > 0) {
        try {
          const initialSteps = parseXml(data.uiPrompt[0]);
          
          if (initialSteps.length > 0) {
            setSteps(initialSteps.map((x: Step) => ({
              ...x,
              status: "pending"
            })));
            
            const newFileContents: Record<string, string> = {};
            initialSteps.forEach((step) => {
              if (step.type === StepType.File && step.path && step.code) {
                newFileContents[step.path] = step.code;
              }
            });
            
            setFileContents(prev => ({
              ...prev,
              ...newFileContents
            }));
            
            if (Object.keys(newFileContents).length > 0) {
              const firstFilePath = Object.keys(newFileContents)[0];
              setSelectedFile(firstFilePath);
              
              if (webContainer) {
                mountFiles(newFileContents).catch(console.error);
              }
            }
          }
        } catch (error) {
          console.error("Error parsing UI prompt:", error);
        }
      }
      
      const res = await api.post("api/chat", {
        message: [...data.prompts, userPrompt].map((c) => ({
          role: "user",
          content: c,
        })),
      });

      if (!res.data) {
        toast.error("Something went wrong");
        return;
      }

      if (res.data?.llmResponse) {
        try {
          console.log("LLM Response:", res.data.llmResponse);
          
          const llmSteps = parseXml(res.data.llmResponse);
          console.log("Parsed steps:", llmSteps.length);
          
          if (llmSteps.length > 0) {
            console.log("Parsed steps:", llmSteps.length);
            
            llmSteps.forEach(step => {
              console.log(`Step ${step.id}: ${step.title}, type: ${step.type}, path: ${step.path || 'N/A'}`);
              if (step.code) console.log(`Content length: ${step.code.length} bytes`);
            });
            
            const additionalFileContents: Record<string, string> = {};
            
            llmSteps.forEach((step) => {
              if (step.type === StepType.File && step.path && step.path !== "/") {
                console.log(`Processing file: ${step.path}`);
                console.log(`Content preview: ${step.code?.substring(0, 50)}...`);
                additionalFileContents[step.path] = step.code || '';
              }
            });
            
            if (Object.keys(additionalFileContents).length > 0) {
              console.log(`Adding ${Object.keys(additionalFileContents).length} files to contents`);
              setFileContents(prev => {
                const updated = {
                  ...prev,
                  ...additionalFileContents
                };
                console.log("Updated file contents:", Object.keys(updated));
                return updated;
              });
              
              const firstFilePath = Object.keys(additionalFileContents)[0];
              setSelectedFile(firstFilePath);
            }
            
            setSteps(prevSteps => {
              const newStepsToAdd: Step[] = [];
              const pathsMap = new Map<string, boolean>();
              
              prevSteps.forEach(step => {
                if (step.path) {
                  pathsMap.set(step.path, true);
                }
              });
              
              llmSteps.forEach(llmStep => {
                if (llmStep.path && pathsMap.has(llmStep.path)) {
                  console.log(`Skipping duplicate step: ${llmStep.path}`);
                  prevSteps = prevSteps.map(s => {
                    if (s.path === llmStep.path) {
                      return {
                        ...s, 
                        code: llmStep.code,
                        title: s.title + " (Updated)",
                        status: "pending"
                      };
                    }
                    return s;
                  });
                } else {
                  newStepsToAdd.push({
                    ...llmStep,
                    status: "pending" as const
                  });
                }
              });
              
              return [...prevSteps, ...newStepsToAdd];
            });
          }
        } catch (error) {
          console.error("Error parsing LLM response:", error);
        }
      }
    } catch (error) {
      toast.error("API request failed");
      console.error(error);
    }
  }

  React.useEffect(() => {
    init();
  }, []);

  const TerminalOutput = React.forwardRef<HTMLDivElement>((props, ref) => {
    return (
      <div className="bg-black text-green-500 font-mono text-sm p-4 rounded-md h-60 overflow-y-auto" ref={ref}>
        <div className="flex items-center gap-2 mb-2 text-white">
          <Terminal className="h-5 w-5" />
          <span>Terminal</span>
        </div>
        {props.children}
      </div>
    );
  });
  TerminalOutput.displayName = "TerminalOutput";

  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminalVisible, setTerminalVisible] = React.useState(false);
  const [terminalContent, setTerminalContent] = React.useState<string>("");

  React.useEffect(() => {
    if (terminalRef.current) {
      setTerminalEl(terminalRef.current);
      
      terminalRef.current.innerHTML = "💻 Terminal initialized. Ready for commands.\n";
      
      if (isLoading) {
        terminalRef.current.innerHTML += "⏳ Loading WebContainer environment...\n";
      }
    }
  }, [terminalRef, setTerminalEl, isLoading]);

  React.useEffect(() => {
    if (terminalRef.current) {
      if (webContainer) {
        terminalRef.current.innerHTML += "✅ WebContainer ready\n";
      }
    }
  }, [webContainer]);

  const runProject = async () => {
    if (!webContainer) {
      toast.error("WebContainer not initialized");
      return;
    }
    
    setTerminalVisible(true);
    
    if (terminalRef.current) {
      terminalRef.current.innerHTML += "🚀 Running project...\n";
    }
    
    try {
      if (terminalRef.current) {
        terminalRef.current.innerHTML += "📦 Installing dependencies...\n";
      }
      toast.info("Installing dependencies...");
      await runCommand("npm", ["install"]);
      
      if (terminalRef.current) {
        terminalRef.current.innerHTML += "🌐 Starting development server...\n";
      }
      toast.success("Starting development server...");
      const output = await runCommand("npm", ["run", "dev"]);
      console.log("Server output:", output);
      
      if (view !== 'preview') {
        setView('preview');
        toast.info("Switched to preview mode");
      }
    } catch (error) {
      if (terminalRef.current) {
        terminalRef.current.innerHTML += `❌ Error: ${error}\n`;
      }
      toast.error("Failed to run project");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <Bolt className="h-6 w-6" />
          <span className="font-semibold">
            Create Bolt.new Clone with Dark Theme
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
            Export
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Deploy
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-80 border-r bg-muted/50">
          <div className="flex h-10 items-center border-b px-4">
            <span className="text-sm font-medium">Steps</span>
          </div>
          <div className="p-4 overflow-y-auto flex flex-1 flex-col h-[90%] ">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "mb-2 rounded-lg p-3 transition-colors",
                  step.status === "active" && "bg-accent",
                  step.status === "completed" && "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border",
                      step.status === "completed" &&
                        "bg-green-500 border-green-500",
                      step.status === "active" && "border-primary"
                    )}
                  >
                    {step.status === "completed" && (
                      <ChevronRight className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {step?.type==="shell" && (
                  <div className="mt-2 rounded-md bg-background p-2 font-mono text-xs">
                    {step.command}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <FileExplorer
          steps={steps}
          setSteps={setSteps}
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          fileContents={fileContents}
          setFileContents={setFileContents}
        />
        <div className="flex flex-1 flex-col">
          <div className="flex h-10 items-center gap-4 border-b px-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {selectedFile.split("/").map((part, i, arr) => (
                <React.Fragment key={i}>
                  <span
                    className={cn(
                      i === arr.length - 1 && "text-foreground font-medium"
                    )}
                  >
                    {part}
                  </span>
                  {i < arr.length - 1 && <ChevronRight className="h-4 w-4" />}
                </React.Fragment>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button 
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-accent"
                onClick={() => setTerminalVisible(!terminalVisible)}
              >
                <Terminal className="h-4 w-4" />
                Terminal
                {isLoading && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-accent" onClick={runProject}>
                <Play className="h-4 w-4" />
                Run
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-accent">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="h-full w-full">
              <div className="flex border-b">
                <button 
                  className={cn(
                    "px-4 py-2 text-sm font-medium",
                    view === 'code' ? "border-b-2 border-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setView('code')}
                >
                  Code
                </button>
                <button
                  className={cn(
                    "px-4 py-2 text-sm font-medium", 
                    view === 'preview' ? "border-b-2 border-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setView('preview')}
                >
                  Preview
                </button>
              </div>

              <div className="h-[calc(100%-40px)]">
                {view === 'code' ? (
                  <Editor
                    key={selectedFile}
                    defaultLanguage={selectedFile.endsWith(".tsx") || selectedFile.endsWith(".ts") ? "typescript" : 
                                     selectedFile.endsWith(".js") ? "javascript" : 
                                     selectedFile.endsWith(".css") ? "css" : 
                                     selectedFile.endsWith(".json") ? "json" : "plaintext"}
                    value={fileContents[selectedFile] || "// File not found"}
                    theme="vs-dark"
                    onChange={(value) => {
                      if (selectedFile) {
                        setFileContents(prev => ({
                          ...prev,
                          [selectedFile]: value || ""
                        }));
                      }
                    }}
                    path={selectedFile}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: "on", 
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      automaticLayout: true,
                    }}
                    className="h-full w-full"
                  />
                ) : (
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>
                            body { margin: 0; }
                          </style>
                        </head>
                        <body>
                          ${fileContents[selectedFile] || ""}
                        </body>
                      </html>
                    `}
                    className="h-full w-full border-none"
                    sandbox="allow-scripts"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {terminalVisible && (
        <div className="border-t p-4 h-60 bg-gray-900">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium text-white">Terminal</h3>
            <button 
              onClick={() => setTerminalVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <TerminalOutput ref={terminalRef}>
            {isLoading && (
              <div className="flex items-center gap-2 text-yellow-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>WebContainer is initializing...</span>
              </div>
            )}
          </TerminalOutput>
        </div>
      )}
    </div>
  );
}
