import app from "./app";

import { env } from "@shared/config/env";
import { logger } from "@shared/logger/logger";
import { connectPostgres } from "@shared/database/postgres";

const startServer = async () => {
  try {
    await connectPostgres();

    app.listen(env.PORT, () => {
      logger.info(`API Gateway running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);

    process.exit(1);
  }
};

startServer();
