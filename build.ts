import { build } from 'esbuild'
import esbuildPluginPino from 'esbuild-plugin-pino'

// esbuild server/main.ts --bundle --keep-names --minify --define:process.env.NODE_ENV=\\\"production\\\" --platform=node --format=cjs --outfile=taskmony.cjs
await build({
    entryPoints: ['server/main.ts'],
    bundle: true,
    keepNames: true,
    minify: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    platform: 'node',
    format: 'cjs',
    outdir: 'dist',
    plugins: [esbuildPluginPino({ transports: ['pino/file'] })]
})
