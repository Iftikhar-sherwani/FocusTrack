const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userDataRoutes = require('./routes/userData')

const app = express()
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  })
)

app.use(express.json({ limit: '2mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/data', userDataRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true, timestamp: Date.now() }))

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(PORT, () => {
  console.log(`FocusTrack API running on http://localhost:${PORT}`)
})
