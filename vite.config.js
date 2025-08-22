import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        auxIconSprite: resolve(__dirname, "aux-icon-sprite.html"),
        auxStyling: resolve(__dirname, "aux-styling.html"),
        mockFontVar: resolve(__dirname, "mocks/fontvar/mock1.html"),
      },
    },
  },
  server: {
    port: 88,
  },
});
