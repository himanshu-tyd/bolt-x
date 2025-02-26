import { getSystemPrompt } from "./pompt";
import firstPrompt from "../utils/prompts/firstPrompt.md";
import secondPrompt from "../utils/prompts/secondPrompt.md";
import { getFilePrompt } from "../utils/getFilePrompt";
import { lastPrompt } from "../utils/prompts/thirdPrompt";
import { openai } from "./model";



export async function main(prompt: string) {
  try {
    const stream = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat:free",
      stream: true,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        {
          role: "user",
          content: getFilePrompt(firstPrompt),
        },
        {
          role: "user",
          content: getFilePrompt(secondPrompt),
        },
        {
          role: "user",
          content: lastPrompt(prompt),
        },
      ],
    });

    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }

    console.log("procces end");
  } catch (error) {
    console.log(error);
  }
}

const prompt = "create course selling app ";

// main(prompt);
