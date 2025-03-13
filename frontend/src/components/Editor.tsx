"use client";

import * as React from "react";
import Editor from "@monaco-editor/react";
import { Bolt, ChevronRight, Terminal, Play, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import FileExplorer from "./FileExprorel";
import { api } from "@/lib/axiosInstance";
import { toast } from "sonner";
import { parseXml } from "@/lib/Steps";

const steps = [
  {
    title: "Create initial files",
    status: "completed",
  },
  {
    title: "Install dependencies",
    status: "completed",
    command: "npm install",
  },
  {
    title: "Update src/App.tsx",
    status: "completed",
  },
  {
    title: "Create src/components/PromptPage.tsx",
    status: "completed",
  },
  {
    title: "Create src/components/EditorPage.tsx",
    status: "active",
  },
  {
    title: "Update src/index.css",
    status: "pending",
  },
];

const fileContents: Record<string, string> = {
  "src/App.tsx": `import React from 'react';
import { Button } from './components/ui/button';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <h1>App Page</h1>
    </div>
  );
}`,
  "src/components/EditorPage.tsx": `import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <h1>Editor Page</h1>
    </div>
  );
}`,
  "src/components/PromptPage.tsx": `import React from 'react';

export default function PromptPage() {
  return (
    <div className="min-h-screen bg-background">
      <h1>Prompt Page</h1>
    </div>
  );
}`,
};

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
  const [code, setCode] = React.useState(fileContents[selectedFile] || "// File not found");
  const [steps, setSteps]=React.useState<{title:string, status:"completed" | "pending" | "in-progress" | "active", command?:string} [] > ([])

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    setCode(fileContents[path] || "// File not found");
  };

 

  const { data, userPrompt } = prompts;


  async function init() {
    try {
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

      console.log("API Response:", res.data);
    } catch (error) {
      toast.error("API request failed");
      console.error(error);
    }
  }

  React.useEffect(() => {
    init();
  }, [prompt]);


  React.useEffect(() => {
    const parsedData = parseXml(`
     <boltArtifact id=\"project-import\" title=\"Project Files\"><boltAction type=\"file\" filePath=\"eslint.config.js\">import js from '@eslint/js'; import globals from 'globals'; import reactHooks from 'eslint-plugin-react-hooks'; import reactRefresh from 'eslint-plugin-react-refresh'; import tseslint from 'typescript-eslint'; export default tseslint.config( { ignores: ['.next'] }, { extends: [js.configs.recommended, ...tseslint.configs.recommended], files: ['**/*.{ts,tsx}'], languageOptions: { ecmaVersion: 2020, globals: globals.browser, }, plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh, }, rules: { ...reactHooks.configs.recommended.rules, 'react-refresh/only-export-components': [ 'warn', { allowConstantExport: true }, ], }, } ); </boltAction><boltAction type=\"file\" filePath=\"package.json\">{ \"name\": \"nextjs-typescript-starter\", \"private\": true, \"version\": \"0.0.0\", \"type\": \"module\", \"scripts\": { \"dev\": \"next dev\", \"build\": \"next build\", \"start\": \"next start\", \"lint\": \"eslint .\" }, \"dependencies\": { \"lucide-react\": \"^0.344.0\", \"next\": \"^14.0.0\", \"react\": \"^18.3.1\", \"react-dom\": \"^18.3.1\" }, \"devDependencies\": { \"@eslint/js\": \"^9.9.1\", \"@types/react\": \"^18.3.5\", \"@types/react-dom\": \"^18.3.0\", \"autoprefixer\": \"^10.4.18\", \"eslint\": \"^9.9.1\", \"eslint-plugin-react-hooks\": \"^5.1.0-rc.0\", \"eslint-plugin-react-refresh\": \"^0.4.11\", \"globals\": \"^15.9.0\", \"postcss\": \"^8.4.35\", \"tailwindcss\": \"^3.4.1\", \"typescript\": \"^5.5.3\" } } </boltAction><boltAction type=\"file\" filePath=\"postcss.config.js\">export default { plugins: { tailwindcss: {}, autoprefixer: {}, }, }; </boltAction><boltAction type=\"file\" filePath=\"tailwind.config.js\">/** @type {import('tailwindcss').Config} */ export default { content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'], theme: { extend: {}, }, plugins: [], }; </boltAction><boltAction type=\"file\" filePath=\"tsconfig.json\">{ \"compilerOptions\": { \"target\": \"ES2020\", \"useDefineForClassFields\": true, \"lib\": [\"ES2020\", \"DOM\", \"DOM.Iterable\"], \"module\": \"ESNext\", \"skipLibCheck\": true, \"moduleResolution\": \"node\", \"allowJs\": true, \"strict\": true, \"noUnusedLocals\": true, \"noUnusedParameters\": true, \"noFallthroughCasesInSwitch\": true, \"jsx\": \"preserve\" }, \"include\": [\"next-env.d.ts\", \"**/*.ts\", \"**/*.tsx\"], \"exclude\": [\"node_modules\"] } </boltAction><boltAction type=\"file\" filePath=\"next-env.d.ts\">/// <reference types=\"next\" /> /// <reference types=\"next/image-types/global\" /> /// <reference types=\"next/navigation-types/compat\" /> // NOTE: This file should not be edited </boltAction><boltAction type=\"file\" filePath=\"pages/_app.tsx\">import type { AppProps } from 'next/app'; import '../styles/globals.css'; export default function App({ Component, pageProps }: AppProps) { return <Component {...pageProps} />; } </boltAction><boltAction type=\"file\" filePath=\"pages/index.tsx\">export default function Home() { return ( <div className=\"min-h-screen bg-gray-100 flex items-center justify-center\"> <p>Welcome to Next.js + TypeScript!</p> </div> ); } </boltAction><boltAction type=\"file\" filePath=\"styles/globals.css\">@tailwind base; @tailwind components; @tailwind utilities; </boltAction></boltArtifact><boltAction type="shell">
    npm install && npm run dev
  </boltAction>`
    );

    console.log(parsedData);

    setSteps(parsedData.map((x) => {
      const stepsData = {
        title: x.title,
        status: x.status,
        
      };
      
      if (x.title.toLowerCase() === 'run command') {
        //@ts-ignore
        stepsData.command = x.code;
      }

      return stepsData;
    }));    
  }, []);

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation */}
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

      <div className="flex flex-1 overflow-hidden">
        {/* Steps Panel */}
        <div className="w-80 border-r bg-muted/50">
          <div className="flex h-10 items-center border-b px-4">
            <span className="text-sm font-medium">Steps</span>
          </div>
          <div className="p-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
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
                {step?.command && (
                  <div className="mt-2 rounded-md bg-background p-2 font-mono text-xs">
                    {step.command}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* File Explorer */}
        <FileExplorer
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />
        {/* Editor Panel */}
        <div className="flex flex-1 flex-col">
          <div className="flex h-10 items-center gap-4 border-b px-4">
            {/* File path breadcrumb */}
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

            {/* Existing toolbar buttons */}
            <div className="ml-auto flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-accent">
                <Terminal className="h-4 w-4" />
                Terminal
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-accent">
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
            <Editor
              defaultLanguage="typescript"
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || "")}
              path={selectedFile}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
