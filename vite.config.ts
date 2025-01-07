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
                description: 'Personal task tracker',
                icons: [
                    {
                        src: '/favicon.svg',
                        sizes: 'any'
                    }
                ],
                background_color: '#181818',
                theme_color: '#9CC8F5',
                scope: '/'
            }
        })
    ]
})
