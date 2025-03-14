import EditorPage from "@/components/Editor";


import { useLocation } from "react-router-dom";
const CreatePage = () => {

  const { state: prompts } = useLocation();


  return (
    <div className="min-h-screen bg-background">
      <EditorPage prompts={prompts}  />
    </div>
  );
};

export default CreatePage;
