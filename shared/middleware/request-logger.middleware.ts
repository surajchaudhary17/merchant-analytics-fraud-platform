import type { NextFunction, Request, Response } from "express";
import { logger } from "../logger/logger";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(`${req.method} ${req.url}`);

  next();
};
