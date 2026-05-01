const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = require('./task.json').tasks;

const validateTaskBody = (body) => {
    if (!body || typeof body !== 'object') return 'Request body is required';
    const { title, description, completed } = body;
    if (typeof title !== 'string' || title.trim() === '') {
        return 'title must be a non-empty string';
    }
    if (typeof description !== 'string' || description.trim() === '') {
        return 'description must be a non-empty string';
    }
    if (typeof completed !== 'boolean') {
        return 'completed must be a boolean';
    }
    return null;
};

const parseId = (raw) => {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
};

app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const task = tasks.find((t) => t.id === id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
    const error = validateTaskBody(req.body);
    if (error) return res.status(400).json({ error });

    const newTask = {
        id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        completed: req.body.completed,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });

    const error = validateTaskBody(req.body);
    if (error) return res.status(400).json({ error });

    tasks[idx] = {
        id: tasks[idx].id,
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        completed: req.body.completed,
    };
    res.status(200).json(tasks[idx]);
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    const [removed] = tasks.splice(idx, 1);
    res.status(200).json(removed);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
