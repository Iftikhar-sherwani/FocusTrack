const express = require('express')
const db = require('../db')
const authenticate = require('../middleware/authenticate')

const router = express.Router()
router.use(authenticate)

// GET /api/data/sync — pull all saved data for the authenticated user
router.get('/sync', (req, res) => {
  const userId = req.userId

  const workLogRows = db.prepare('SELECT data FROM work_logs WHERE user_id = ?').all(userId)
  const todoRows = db.prepare('SELECT data FROM todos WHERE user_id = ?').all(userId)
  const settingsRow = db.prepare('SELECT data FROM user_settings WHERE user_id = ?').get(userId)

  res.json({
    workLogs: workLogRows.map((r) => JSON.parse(r.data)),
    todos: todoRows.map((r) => JSON.parse(r.data)),
    settings: settingsRow ? JSON.parse(settingsRow.data) : null,
  })
})

// POST /api/data/sync — push (upsert) all data for the authenticated user
router.post('/sync', (req, res) => {
  const userId = req.userId
  const { workLogs, todos, settings } = req.body

  if (!Array.isArray(workLogs) || !Array.isArray(todos)) {
    return res.status(400).json({ error: 'Invalid data format' })
  }

  const upsertLog = db.prepare(`
    INSERT INTO work_logs (date, user_id, data)
    VALUES (?, ?, ?)
    ON CONFLICT(date, user_id) DO UPDATE SET data = excluded.data
  `)

  const upsertTodo = db.prepare(`
    INSERT INTO todos (id, user_id, data)
    VALUES (?, ?, ?)
    ON CONFLICT(id, user_id) DO UPDATE SET data = excluded.data
  `)

  const upsertSettings = db.prepare(`
    INSERT INTO user_settings (user_id, data)
    VALUES (?, ?)
    ON CONFLICT(user_id) DO UPDATE SET data = excluded.data
  `)

  const syncAll = db.transaction(() => {
    for (const log of workLogs) {
      if (log && typeof log.date === 'string') {
        upsertLog.run(log.date, userId, JSON.stringify(log))
      }
    }
    for (const todo of todos) {
      if (todo && typeof todo.id === 'string') {
        upsertTodo.run(todo.id, userId, JSON.stringify(todo))
      }
    }
    if (settings && typeof settings === 'object') {
      upsertSettings.run(userId, JSON.stringify(settings))
    }
  })

  syncAll()
  res.json({ ok: true })
})

module.exports = router
