import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
      manifest: {
        name: 'BRIE — Play, explore & discover',
        short_name: 'BRIE',
        description: 'A free, Montessori-inspired toddler play app for ages 2-4.',
        theme_color: '#FEF3E8',
        background_color: '#FEF3E8',
        display: 'standalone',
        start_url: '/brie/',
        scope: '/brie/',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  base: '/brie/',
})
