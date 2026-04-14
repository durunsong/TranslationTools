import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    host: true,
    open: false,
    cors: true,
    strictPort: false,
    hmr: true,
    proxy: {
      "/api": {
        target: "http://api.fanyi.baidu.com",
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2048,
    reportCompressedSize: false,
    assetsDir: "static",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }

          if (id.includes("antd") || id.includes("@ant-design/icons")) {
            return "antd-vendor";
          }

          if (
            id.includes("zustand") ||
            id.includes("axios") ||
            id.includes("md5") ||
            id.includes("classnames")
          ) {
            return "utils-vendor";
          }
        },
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "antd",
      "@ant-design/icons",
      "zustand",
      "axios",
      "md5",
      "classnames",
    ],
  },
});
