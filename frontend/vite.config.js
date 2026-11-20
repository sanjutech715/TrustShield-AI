import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

function findChromeExecutable() {
  const candidates = [
    process.env.CHROME_BIN,
    process.env.PROGRAMFILES
      ? `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`
      : null,
    process.env["PROGRAMFILES(X86)"]
      ? `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`
      : null,
    process.env.LOCALAPPDATA
      ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
      : null,
  ].filter(Boolean);

  return candidates.find((candidate) => existsSync(candidate)) || null;
}

function openInChrome() {
  return {
    name: "open-in-chrome",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const url = "http://127.0.0.1:5173/";

        const chrome = findChromeExecutable();
        if (chrome) {
          spawn(chrome, [url], {
            detached: true,
            stdio: "ignore",
          }).unref();
          return;
        }

        spawn("chrome", [url], {
          detached: true,
          stdio: "ignore",
          shell: true,
        }).on("error", () => {}).unref();
      });
    },
  };
}

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  plugins: [react(), openInChrome()],
});
