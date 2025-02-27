
import * as React from "react"
import { ChevronRight, ChevronDown, FileCode, Folder, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileItem {
  name: string
  type: "file" | "folder"
  children?: FileItem[]
  path: string
}

const initialFiles: FileItem[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        name: "components",
        type: "folder",
        path: "src/components",
        children: [
          {
            name: "EditorPage.tsx",
            type: "file",
            path: "src/components/EditorPage.tsx",
          },
          {
            name: "PromptPage.tsx",
            type: "file",
            path: "src/components/PromptPage.tsx",
          },
        ],
      },
      {
        name: "App.tsx",
        type: "file",
        path: "src/App.tsx",
      },
      {
        name: "index.css",
        type: "file",
        path: "src/index.css",
      },
      {
        name: "main.tsx",
        type: "file",
        path: "src/main.tsx",
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    path: "package.json",
  },
  {
    name: "tsconfig.json",
    type: "file",
    path: "tsconfig.json",
  },
  {
    name: "vite.config.ts",
    type: "file",
    path: "vite.config.ts",
  },
]

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
  selectedFile: string
}

export default function FileExplorer({ onFileSelect, selectedFile }: FileExplorerProps) {
  return (
    <div className="w-60 border-r bg-muted/50">
      <div className="flex h-10 items-center border-b px-4">
        <span className="text-sm font-medium">Files</span>
      </div>
      <div className="p-2">
        {initialFiles.map((file) => (
          <FileTreeItem key={file.path} item={file} onFileSelect={onFileSelect} selectedFile={selectedFile} />
        ))}
      </div>
    </div>
  )
}

