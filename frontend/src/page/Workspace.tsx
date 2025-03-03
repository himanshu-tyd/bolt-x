import EditorPage from "@/components/Editor";
import { api } from "@/lib/axiosInstance";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const CreatePage: React.FC = () => {
  const { state: data } = useLocation();

  console.log("workspace page", data);

  async function init() {
    api.post("/chat", {
      message: [...data.prompt, data.prompt].map((c) => ({
        role: "user",
        content: c,
      })),
    });
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
