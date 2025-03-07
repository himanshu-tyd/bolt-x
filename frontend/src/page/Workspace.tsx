import EditorPage from "@/components/Editor";
import { api } from "@/lib/axiosInstance";
import { parseXml } from "@/lib/Steps";

import { useEffect, useState } from "react";
import { parsePath, useLocation } from "react-router-dom";
import { toast } from "sonner";

const CreatePage = () => {
  const [steps, setSteps] = useState<[]>([]);
  const { state: data } = useLocation();

  console.log("workspace page", data);

  async function init() {
    const res = await api.post("/chat", {
      message: [...data.prompts, data.prompt].map((c) => ({
        role: "user",
        content: c,
      })),
    });

    const contex = res.data;

    if (!contex) {
      toast.error("something get wrong");

      return;
    }

    console.log(contex);

    // setSteps(parseXml(contex))
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <EditorPage />
    </div>
  );
};

export default CreatePage;
