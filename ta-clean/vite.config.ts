import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function apiDevPlugin(): Plugin {
  return {
    name: "api-dev-plugin",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();
        try {
          const mod = await server.ssrLoadModule("/src/server/entry.ts");
          if (mod?.handler) return mod.handler(req, res, next);
        } catch (e) {
          console.error("[api-dev-plugin]", e);
        }
        next();
      });
    },
  };
}

const isSSR = process.env.BUILD_TARGET === "server";

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: isSSR
    ? {
        ssr: true,
        target: "node22",
        outDir: "dist",
        rollupOptions: {
          input: "src/server/entry.ts",
          output: {
            format: "esm",
            entryFileNames: "server.bundle.mjs",
            chunkFileNames: "bin/[name]-[hash].js",
            banner: "import { createRequire } from 'module';\nconst require = createRequire(import.meta.url);",
          },
        },
      }
    : {
        outDir: "dist/client",
        emptyOutDir: true,
        copyPublicDir: true,
      },
});
