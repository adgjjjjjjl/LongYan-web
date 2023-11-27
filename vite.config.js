import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ refTransform: true })],
  publicDir: "public",
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/sass/_reset.scss"; @import "@/sass/_variables.scss"; @import "@/sass/common.scss";`,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 10 * 1024,
    target: "modules",
    assetsDir: "assets",
    minify: "esbuild", // 混淆器，terser构建后文件体积更小
    chunkSizeWarningLimit: 50 * 1024,
  },
  server: {
    host: "0.0.0.0",
    port: "8088",
    proxy: {
      "^/api/v1/*": {
        target: "http://10.182.175.113:31281",
        changeOrigin: true,
      },
      // "^/api/user/*": {
      //   target: "http://localhost:8088",
      //   changeOrigin: true,
      // },
    },
    origin: "http://127.0.0.1:8088",
  },
  optimizeDeps: {
    include: ["axios"],
  },
});
