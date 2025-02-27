import { api } from "@/lib/axiosInstance";

import { useState } from "react";

export const useGetResponse = (url: string) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<true | false>(false);
  const [data, setData] = useState();

  const sendPrompt = async <T>(prompt: T) => {
    try {
        setLoading(true)
      const res = await api.post(url, {
        prompt,
      });

      const context = res.data;

      setData(context);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, sendPrompt};
};
