import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
// El sitio real se sirve desde la raíz (base '/'). Para la demo en GitHub Pages
// el workflow define VITE_BASE=/<repo>/ así los assets cargan bajo el subpath.
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
