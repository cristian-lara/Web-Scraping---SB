import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import { DEFAULT_PORT } from "./common/env.constants.js";
import { createApp } from "./bootstrap.js";

loadEnv();

async function main(): Promise<void> {
  const app = await createApp();
  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`BFF listening on http://localhost:${port}`);
}

void main();
