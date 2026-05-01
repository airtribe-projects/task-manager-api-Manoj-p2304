const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = require('./task.json').tasks;

const isValidTask = (body) =>
    typeof body?.title === 'string' &&
    typeof body?.description === 'string' &&
    typeof body?.completed === 'boolean';

app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
    if (!isValidTask(req.body)) {
        return res.status(400).json({ error: 'Invalid task payload' });
    }
    const newTask = {
        id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const idx = tasks.findIndex((t) => t.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    if (!isValidTask(req.body)) {
        return res.status(400).json({ error: 'Invalid task payload' });
    }
    tasks[idx] = { ...tasks[idx], ...req.body, id: tasks[idx].id };
    res.status(200).json(tasks[idx]);
});

app.delete('/tasks/:id', (req, res) => {
    const idx = tasks.findIndex((t) => t.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    const [removed] = tasks.splice(idx, 1);
    res.status(200).json(removed);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
