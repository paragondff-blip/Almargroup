// server.js
// This file acts as a robust entry point fallback on Render if the start command is configured as "node server.js".
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundledServer = path.join(__dirname, "dist", "server.cjs");

if (fs.existsSync(bundledServer)) {
  console.log("🚀 Starting compiled production server...");
  import("./dist/server.cjs");
} else {
  console.log("🎮 Compiled server not found. Falling back to running server.ts directly...");
  import("./server.ts").catch((err) => {
    console.error("❌ Failed to start server directly: ", err);
  });
}
