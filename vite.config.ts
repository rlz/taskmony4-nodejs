import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    root: './client-web',
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Taskmony',
                short_name: 'Taskmony',
                description: 'Personal task tracker',
                icons: [
                    {
                        src: '/favicon.svg',
                        sizes: 'any'
                    },
                    {
                        src: '/web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: '/web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ],
                background_color: '#181818',
                theme_color: '#9CC8F5',
                scope: '/'
            }
        })
    ]
})
