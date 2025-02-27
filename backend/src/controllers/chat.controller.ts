import { Request, Response } from "express";
import { catchError } from "../utils/catchError";
import { openai } from "../llm/model";
import { getSystemPrompt } from "../llm/pompt";
import { MessageType } from "../utils/type";

export const chat = async (req: Request, res: Response) => {
  try {
    const message: MessageType = req.body.message;

    if (!message || !Array.isArray(message)) {
      res.status(400).json({ error: "Invalid message format try again " });
      return
    }

    const promptMessages = message.map(({ role, content }) => ({
      role,
      content,
    }));

    // console.log(promptMessages)

    const stream = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat:free",
      temperature: 0,
      stream: true,
      messages: [
        { role: "system", content: getSystemPrompt() },
        ...promptMessages,
      ],
    });

    console.log("Process start");
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0].delta?.content || "");
    }
    console.log("Process end");

    res.json({ success: true });
    
  } catch (e) {
    catchError(e, res);
  }
};
