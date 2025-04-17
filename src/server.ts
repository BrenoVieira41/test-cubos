import { config } from "dotenv";
import { app } from "./app";
import prisma from "./prisma";

config();

const appPort = process.env.PORT || 3000;

const startServer = async () => {
  await prisma.$connect();

  app.listen(appPort, () => {
    console.log(`[server]: Server is running at http://localhost:${appPort}`);
  });
};

startServer();
