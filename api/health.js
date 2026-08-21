import { app } from '../client/server/app.js'

export default function handler(req, res) {
  req.url = '/api' + req.url
  return app(req, res)
}
