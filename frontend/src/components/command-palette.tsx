"use client";

import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetResponse } from "@/hooks/usePrompt";
import { s } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

interface CommandPaletteProps {
  // Define props here
}

export const CommandPalette: React.FC<CommandPaletteProps> = (
) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { error, loading, sendPrompt } = useGetResponse("/api/template");

  const navigate = useNavigate();

  const handleBuild = async () => {
    if (prompt === "") {
      toast.error("please write your prompt");
    }

    if (prompt.trim()) {
      const data = await sendPrompt(prompt);

      if (error) {
        toast.error("Error");
      }

      navigate("/workspace", { state: {data:data,userPrompt:prompt} });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  return (
    <div className="relative flex gap-4">
      <div className="relative flex h-14 w-full items-center rounded-lg border bg-muted/50 px-4 focus-within:bg-muted/80">
        <Sparkles className="mr-2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={prompt}
          onChange={handleInputChange}
          placeholder="How can we help you today?"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          aria-label="Search commands"
        />
      </div>
      <div className="relative group">
        <button
          onClick={handleBuild}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative h-14 px-8 rounded-lg text-white font-medium transition-all duration-300",
            "bg-gradient-to-r from-purple-600/80 via-purple-500/80 to-pink-500/80",
            "hover:from-purple-600 hover:via-purple-500 hover:to-pink-500",
            "before:absolute before:inset-[1px] before:rounded-[7px]",
            "after:absolute after:inset-0 after:rounded-lg after:p-[1px]",
            "after:bg-gradient-to-r after:from-purple-600 after:via-fuchsia-500 after:to-pink-500",
            "after:animate-border-rotate after:bg-[length:200%_200%]",
            isHovered ? "shadow-[0_0_20px_2px_rgba(168,85,247,0.4)]" : ""
          )}
        >
          <span className="relative z-10">
            {loading ? <Loader/>: "Build"}
          </span>
          <div className="absolute inset-0 -z-10 animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-fuchsia-500/30 to-pink-500/30 blur-xl" />
          </div>
        </button>
      </div>
    </div>
  );
};
