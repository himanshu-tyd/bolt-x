import { Request, Response } from "express";
import { getTemplateThink } from "../llm/template";
import { catchError } from "../utils/catchError";
import StatusCode from "../utils/type";
import { reactjs } from "../utils/defaults/template.reactjs";
import { nextjs } from "../utils/defaults/template.nextjs";
import { nodejs } from "../utils/defaults/template.nodejs";
import { BASE_PROMPT, parsePrompt } from "../llm/pompt";

export const getTemplate = async (req: Request, res: Response) => {
  const prompt = req.body.prompt;

  try {
    const ans = await getTemplateThink(prompt);

    switch (ans) {
      case "react":

      const reactBase=parsePrompt(reactjs)

        res.status(StatusCode.OK).json({
          success: true,
          message: "template get it",
          prompts: [BASE_PROMPT, reactBase],
          uiPrompt :  [reactjs]
        });
        break;

      case "next":

      const nextBase=parsePrompt(nextjs)

        res.status(StatusCode.OK).json({
          success: true,
          message: "template get it",
          prompts: [BASE_PROMPT, nextBase],
          uiPrompt: [nextjs]
        });

        break;

      case "node":

      const nodeBase=parsePrompt(nodejs)

        res.status(StatusCode.OK).json({
          success: true,
          message: "template get it",
          prompts: [nodeBase],
        });
        break;
      default:
        break;
    }


  } catch (e) {
    catchError(e, res);
  }
};
