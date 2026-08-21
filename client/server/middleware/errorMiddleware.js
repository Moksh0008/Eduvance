export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message })
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Email already registered' })
  }

  const status = err.statusCode || err.status || 500
  const message =
    status === 500 ? 'Server error' : err.message || 'Request failed'
  if (status === 500) console.error(err)
  return res.status(status).json({ success: false, message })
}
