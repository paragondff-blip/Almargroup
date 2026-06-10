// server.js
// This file acts as a robust entry point fallback on Render.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundledServer = path.join(__dirname, "dist", "server.cjs");

if (fs.existsSync(bundledServer)) {
  console.log("🚀 Starting compiled production server (dist/server.cjs)...");
  try {
    await import("./dist/server.cjs");
  } catch (err) {
    console.error("❌ CRITICAL: Error starting compiled production server:", err);
    process.exit(1);
  }
} else {
  console.log("🎮 Compiled server not found. Falling back to running server.ts directly with tsx...");
  try {
    const { spawn } = await import("child_process");
    const child = spawn("npx", ["tsx", "server.ts"], {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, NODE_ENV: process.env.NODE_ENV || "production" }
    });
    
    child.on("error", (err) => {
      console.error("❌ Failed to start server directly via tsx: ", err);
    });
  } catch (fallbackErr) {
    console.error("❌ Failed to start fallback server launcher:", fallbackErr);
    process.exit(1);
  }
}
