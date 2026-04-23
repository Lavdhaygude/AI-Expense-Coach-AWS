import { app } from "./app";
import { env } from "./config/env";
import { initializeDatabase } from "./db/schema";

async function main() {
  await initializeDatabase();
  app.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT}`);
  });
}

main().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});

