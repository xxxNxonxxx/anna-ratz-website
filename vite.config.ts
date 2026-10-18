import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// cloudflare(): führt worker/index.ts (Kundengalerien unter /api) im Dev-Server mit
// aus und simuliert R2 lokal in .wrangler/state.
//
// GITHUB_PAGES=1: statischer Test-Build für https://xxxnxonxxx.github.io/anna-ratz-website/
// (Unterordner als base, ohne Worker; die Kundengalerie läuft dort im Demo-Modus).
const pages = process.env.GITHUB_PAGES === '1'

export default defineConfig({
  base: pages ? '/anna-ratz-website/' : '/',
  plugins: [react(), tailwindcss(), ...(pages ? [] : [cloudflare()])],
})
