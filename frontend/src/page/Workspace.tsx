import EditorPage from "@/components/Editor";
import { api } from "@/lib/axiosInstance";
import { parseXml } from "@/lib/Steps";


import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const CreatePage = () => {

  const { state: prompts } = useLocation();


  return (
    <div className="min-h-screen bg-background">
      <EditorPage prompts={prompts}  />
    </div>
  );
};

export default CreatePage;
