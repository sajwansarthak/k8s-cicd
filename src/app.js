const express = require('express');
const os = require('os');

const app = express();
app.use(express.json());

const tasks = [];

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from the CI/CD pipeline!',
    version: process.env.APP_VERSION || 'dev',
    pod: os.hostname()
  });
});

// Used by Kubernetes liveness/readiness probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = { id: tasks.length + 1, title };
  tasks.push(task);
  res.status(201).json(task);
});

module.exports = app;
