import app from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

async function start() {
  try {
    await connectDb();

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

start();