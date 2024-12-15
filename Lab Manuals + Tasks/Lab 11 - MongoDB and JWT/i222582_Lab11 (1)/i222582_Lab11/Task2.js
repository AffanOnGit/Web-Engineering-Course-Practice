const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

const app = express();
const PORT = 3000;

app.use(express.json());

const mongoClient = new MongoClient(MONGO_URL);
mongoClient.connect((err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
});

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }
        req.user = decoded;
        next();
    });
};

app.get('/api/users/profile', verifyToken, async (req, res) => {
    try {
        const db = mongoClient.db('your_db_name');
        const user = await db.collection('users').findOne({ _id: req.user.userId }, { projection: { password: 0 } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});