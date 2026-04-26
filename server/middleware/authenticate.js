const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'focustrack-dev-secret-CHANGE-IN-PROD'

module.exports = function authenticate(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
