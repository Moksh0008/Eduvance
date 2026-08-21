import { app } from '../client/server/app.js'

export default function handler(req, res) {
  // Ensure Express sees the full /api/... path
  if (!req.url.startsWith('/api/')) {
    req.url = '/api' + req.url
  }
  return app(req, res)
}
