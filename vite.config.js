import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pathToFileURL } from 'url'

function apiDevPlugin() {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost')
        const match = url.pathname.match(/^\/api\/([a-z.]+)$/)
        if (!match) return next()

        const handlerPath = new URL(`./api/${match[1]}.js`, import.meta.url).pathname
        try {
          const mod = await import(pathToFileURL(handlerPath).href + '?t=' + Date.now())
          const query = Object.fromEntries(url.searchParams)
          const mockReq = { query, method: req.method }
          const mockRes = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this },
            json(data) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = this.statusCode
              res.end(JSON.stringify(data))
            },
          }
          await mod.default(mockReq, mockRes)
        } catch (e) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: e.message }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
})
