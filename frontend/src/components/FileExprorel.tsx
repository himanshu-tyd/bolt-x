import * as React from "react"
import { ChevronRight, ChevronDown, FileCode, Folder, File } from "lucide-react"
import { cn, files } from "@/lib/utils"
import { Step, StepType } from "@/lib/types"

interface FileItem {
  name: string
  type: "file" | "folder"
  children?: FileItem[]
  path: string
  content?: string
}

// const initialFiles: FileItem[] = files

interface FileTreeItemProps {
  item: FileItem
  level?: number
  onFileSelect: (path: string) => void
  selectedFile: string
}

function FileTreeItem({ item, level = 0, onFileSelect, selectedFile }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const isSelected = selectedFile === item.path

  const handleClick = () => {
    if (item.type === "folder") {
      setIsOpen(!isOpen)
    } else {
      onFileSelect(item.path)
    }
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".tsx") || fileName.endsWith(".ts")) return <FileCode className="h-4 w-4 text-blue-400" />
    if (fileName.endsWith(".css")) return <FileCode className="h-4 w-4 text-purple-400" />
    if (fileName.endsWith(".json")) return <FileCode className="h-4 w-4 text-yellow-400" />
    return <File className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1 cursor-pointer hover:bg-muted/50",
          isSelected && "bg-accent",
          level > 0 && "ml-4",
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {item.type === "folder" ? (
          <>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <Folder className="h-4 w-4 text-muted-foreground" />
          </>
        ) : (
          <span className="ml-4">{getFileIcon(item.name)}</span>
        )}
        <span className="text-sm">{item.name}</span>
      </div>
      {item.type === "folder" && isOpen && item.children && (
        <div className="mt-1">
          {item.children.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface FileExplorerProps {
  onFileSelect: (path: string) => void
  selectedFile: string,
  steps: {
    title: string;
    status: "completed" | "pending" | "in-progress" | "active";
    command?: string;
    type: StepType
    path?: string
    code?: string
  }[],
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>,
  fileContents: Record<string, string>,
  setFileContents: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

export default function FileExplorer({
  steps, 
  setSteps, 
  onFileSelect, 
  selectedFile,
  fileContents,
  setFileContents
}: FileExplorerProps) {
  const [fileItems, setFiles] = React.useState<FileItem[]>([]);

  // Create and organize files based on steps
  React.useEffect(() => {
    // Check if we've already processed this set of steps
    const pendingSteps = steps.filter(x => x.status === 'pending');
    if (pendingSteps.length === 0) return;
    
    console.log("Processing pending steps:", pendingSteps);
    const newFiles = [...fileItems];
    
    pendingSteps.forEach(step => {
      // Only process file steps with a path
      if (step.type === StepType.File && step.path && step.path !== "/") {
        // Add file to fileContents if it has code
        if (step.code) {
          setFileContents(prev => ({
            ...prev,
            [step.path as string]: step.code || ''
          }));
        }
        
        // Split path to get folders and filename
        const pathParts = step.path.split('/').filter(Boolean);
        const fileName = pathParts.pop() || '';
        
        // Skip if fileName is empty
        if (!fileName) return;
        
        let currentPath = '';
        let currentLevel = newFiles;
        
        // Create folder structure
        for (const folder of pathParts) {
          currentPath += '/' + folder;
          
          let folderItem = currentLevel.find(item => 
            item.type === 'folder' && item.path === currentPath
          );
          
          if (!folderItem) {
            folderItem = {
              name: folder,
              type: 'folder',
              path: currentPath,
              children: []
            };
            currentLevel.push(folderItem);
          }
          
          currentLevel = folderItem.children || [];
        }
        
        // Add file to deepest folder
        const filePath = currentPath + '/' + fileName;
        const existingFile = currentLevel.find(item => 
          item.type === 'file' && item.path === filePath
        );
        
        if (existingFile) {
          existingFile.content = step.code;
        } else {
          currentLevel.push({
            name: fileName,
            type: 'file',
            path: filePath,
            content: step.code
          });
        }
      }
    });
    
    setFiles(newFiles);
    
    // Mark steps as completed
    setSteps(prevSteps => prevSteps.map(s => {
      if (s.status === 'pending') {
        return {
          ...s,
          status: 'completed'
        };
      }
      return s;
    }));
  }, [steps, fileItems, setFileContents, setSteps]);

  return (
    <div className="w-60 border-r bg-muted/50 flex flex-col h-full">
      <div className="flex h-10 items-center border-b px-4">
        <span className="text-sm font-medium">Files</span>
      </div>
      <div className="p-2 overflow-y-auto flex-1">
        {fileItems.map((file) => (
          <FileTreeItem 
            key={file.path} 
            item={file} 
            onFileSelect={onFileSelect} 
            selectedFile={selectedFile} 
          />
        ))}
      </div>
    </div>
  )
}
