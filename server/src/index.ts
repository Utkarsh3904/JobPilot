import app from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

const startServer = async () => {
  try {
    // Pehle Database connect karo
    await connectDb();

    // Fir Server start karo
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`🌍 Environment: Development`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();