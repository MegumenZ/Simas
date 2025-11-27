import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { logger } from "../application/logging";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => { // <--- Explicitly say this returns NOTHING
  const err = error instanceof Error ? error : new Error(String(error));

  if (err instanceof ZodError) {
    res.status(400).json({
      errors: err.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return; // <--- Just stop execution, don't return the value
  } else if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      err.message = "File size exceeds 10MB limit";
    } else if (
      err.code === "LIMIT_UNEXPECTED_FILE" &&
      err.message.includes("Only PDF and DOCX")
    ) {
      err.message = "Only PDF and DOCX files are allowed";
    }

    res.status(400).json({
      errors: err.message,
    });
    return;
  } else if (err instanceof ResponseError) {
    res.status(err.status).json({
      errors: err.message,
    });
    return;
  } else {
    logger.error(err);
    res.status(500).json({
      errors: "Internal Server Error",
    });
    return;
  }
};
