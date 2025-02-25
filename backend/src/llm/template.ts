import { openai } from "./model";


export async function getTemplateThink(prompt: string) {


  const response = await openai.chat.completions.create({
    model: "deepseek/deepseek-chat:free",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "return either node or react or next based on what do you think this project should be. Only return a single word either node or react or next in lowercase nothing extra. Do not return anything extra.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.log(response.choices[0].message?.content)


  return response.choices[0].message?.content
}


