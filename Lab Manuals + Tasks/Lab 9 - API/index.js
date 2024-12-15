const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let items = [];

// Create
app.post('/items', (req, res) => {
    const newItem = req.body;
    items.push(newItem);
    res.status(201).send(newItem);
});

// Read
app.get('/items', (req, res) => {
    res.send(items);
});

// Update
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedItem = req.body;
    let item = items.find(item => item.id === id);
    if (item) {
        Object.assign(item, updatedItem);
        res.send(item);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
});

// Delete
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        const deletedItem = items.splice(index, 1);
        res.send(deletedItem);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});