import { Response } from "express";
import StatusCode from "./type";

export const catchError = (e: any, res: Response) => {

    console.log(e)

  if (e instanceof Error) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message });
    return;
  }

  res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: e });
};
