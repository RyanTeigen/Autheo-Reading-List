import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

const rootDir = import.meta.dirname

// Runs api/contribute.ts locally so `npm run dev` can exercise the real contribute
// flow without needing Shadw.cloud's function runtime. Not used in production —
// Shadw.cloud serves files under /api itself once deployed.
function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/contribute' || req.method !== 'POST') {
          next()
          return
        }
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const body = Buffer.concat(chunks).toString('utf-8')

          const mod = await server.ssrLoadModule('/api/contribute.ts')
          const request = new Request(`http://localhost${req.url}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
          })
          const response: Response = await mod.default(request)

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await response.text())
        } catch (err) {
          next(err as Error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (!process.env.GITHUB_TOKEN && env.GITHUB_TOKEN) process.env.GITHUB_TOKEN = env.GITHUB_TOKEN
  if (!process.env.GITHUB_REPO && env.GITHUB_REPO) process.env.GITHUB_REPO = env.GITHUB_REPO

  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
  }
})
