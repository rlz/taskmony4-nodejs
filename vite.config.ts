import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    root: './client-web',
    plugins: [react()]
})
