import { api } from "@/lib/axiosInstance";

import { useState } from "react";
import { toast } from "sonner";

export const useGetResponse = (url: string) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<true | false>(false);

  const sendPrompt = async <T>(prompt: T) => {
    try {
      setLoading(true);
      const res = await api.post(url, {
        prompt,
      });

      const context = res.data;
      

      if (!context) {
        toast.error("opps something get wrong");
        return;
      }


      return context

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, sendPrompt };
};
