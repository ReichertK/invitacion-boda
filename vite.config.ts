import path from "path"
import fs from "fs"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// GitHub Pages no conoce las rutas del SPA y sirve 404.html para /panel. Con una
// copia del index como 404.html la app arranca igual y el router resuelve.
function spaFallback(): Plugin {
  return {
    name: "spa-404-fallback",
    apply: "build",
    closeBundle() {
      const out = path.resolve(__dirname, "dist")
      fs.copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"))
    },
  }
}

// https://vite.dev/config/
// El sitio real se sirve desde la raíz (base '/'). Para la demo en GitHub Pages
// el workflow define VITE_BASE=/<repo>/ así los assets cargan bajo el subpath.
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
