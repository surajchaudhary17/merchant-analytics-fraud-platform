import express from "express";
import cors from "cors";
import helmet from "helmet";

import { requestLoggerMiddleware } from "@shared/middleware/request-logger.middleware";
import { errorMiddleware } from "@shared/middleware/error.middleware";
import { notFoundMiddleware } from "@shared/middleware/not-found.middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(requestLoggerMiddleware);

app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "API Gateway Healthy",
  });
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
