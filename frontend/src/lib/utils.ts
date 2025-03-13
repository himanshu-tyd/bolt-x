import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FileItem } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const files: FileItem[] = [
  {
    name: "src",
    type: "folder",
    path: "/src",
    children: [
      {
        name: "components",
        type: "folder",
        path: "/src/components",
        children: [
          {
            name: "Button.tsx",
            type: "file",
            path: "/src/components/Button.tsx",
            content: "MOCK FILE CONTENT",
          },
          {
            name: "Navbar.tsx",
            type: "file",
            path: "/src/components/Navbar.tsx",
            content: `console.log("hello")`,
          },
          {
            name: "Footer.tsx",
            type: "file",
            path: "/src/components/Footer.tsx",
            content: "MOCK FILE CONTENT",
          },
        ],
      },
      {
        name: "pages",
        type: "folder",
        path: "/src/pages",
        children: [
          {
            name: "Home.tsx",
            type: "file",
            path: "/src/pages/Home.tsx",
            content: "MOCK FILE CONTENT",
          },
          {
            name: "About.tsx",
            type: "file",
            path: "/src/pages/About.tsx",
            content: "MOCK FILE CONTENT",
          },
          {
            name: "Contact.tsx",
            type: "file",
            path: "/src/pages/Contact.tsx",
            content: "MOCK FILE CONTENT",
          },
        ],
      },
      {
        name: "hooks",
        type: "folder",
        path: "/src/hooks",
        children: [
          {
            name: "useTheme.ts",
            type: "file",
            path: "/src/hooks/useTheme.ts",
            content: "MOCK FILE CONTENT",
          },
          {
            name: "useAuth.ts",
            type: "file",
            path: "/src/hooks/useAuth.ts",
            content: "MOCK FILE CONTENT",
          },
        ],
      },
      {
        name: "context",
        type: "folder",
        path: "/src/context",
        children: [
          {
            name: "ThemeContext.tsx",
            type: "file",
            path: "/src/context/ThemeContext.tsx",
            content: "MOCK FILE CONTENT",
          },
        ],
      },
      {
        name: "styles",
        type: "folder",
        path: "/src/styles",
        children: [
          {
            name: "global.css",
            type: "file",
            path: "/src/styles/global.css",
            content: "MOCK FILE CONTENT",
          },
          {
            name: "theme.css",
            type: "file",
            path: "/src/styles/theme.css",
            content: "MOCK FILE CONTENT",
          },
        ],
      },
      {
        name: "App.tsx",
        type: "file",
        path: "/src/App.tsx",
        content: "MOCK FILE CONTENT",
      },
      {
        name: "main.tsx",
        type: "file",
        path: "/src/main.tsx",
        content: "MOCK FILE CONTENT",
      },
    ],
  },
];