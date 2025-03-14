export enum StepType {
    CreateFile,
    CreateFolder,
    EditFile,
    DeleteFile,
    RunScript,
    File = "file",
    Shell = "shell"
  }
  
  export type Step= {
    id?: number;
    title: string;
    description: string;
    type: StepType;
    status: 'pending' | 'in-progress' | 'completed' | "active";
    code?: string;
    path?: string;
    command?:string
  }
  
  export type Project ={
    prompt: string;
    steps: Step[];
  }
  
  export type FileItem ={
    name: string;
    type: 'file' | 'folder';
    children?: FileItem[];
    content?: string;
    path: string;
    code?:string
  }
  
  export type FileViewerProps ={
    file: FileItem | null;
    onClose: () => void;
  }

