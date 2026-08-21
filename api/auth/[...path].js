import { app } from '../../client/server/app.js'

export default function handler(req, res) {
  req.url = '/api/auth' + req.url
  return app(req, res)
}
