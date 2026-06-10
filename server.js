// server.js
// This file acts as a robust entry point fallback on Render.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundledServer = path.join(__dirname, "dist", "server.cjs");

if (fs.existsSync(bundledServer)) {
  console.log("🚀 Starting compiled production server (dist/server.cjs)...");
  import("./dist/server.cjs");
} else {
  console.log("🎮 Compiled server not found. Falling back to running server.ts directly with tsx...");
  const child = spawn("npx", ["tsx", "server.ts"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, NODE_ENV: process.env.NODE_ENV || "production" }
  });
  
  child.on("error", (err) => {
    console.error("❌ Failed to start server directly via tsx: ", err);
  });
}
