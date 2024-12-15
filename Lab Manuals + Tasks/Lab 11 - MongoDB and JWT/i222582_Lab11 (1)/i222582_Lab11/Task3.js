const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
const mongoClient = new MongoClient(MONGO_URL);
mongoClient.connect((err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
});

// Middleware to verify JWT and check user role
const verifyToken = (requiredRole) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        jwt.verify(token, 'your_secret_key', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Failed to authenticate token.' });
            }
            if (decoded.role !== requiredRole) {
                return res.status(403).json({ message: 'Access forbidden: Admins only' });
            }
            req.user = decoded;
            next();
        });
    };
};

// Register a new admin user
app.post('/api/auth/register', async (req, res) => {
    try {
        const db = mongoClient.db('your_db_name');
        const { username, email, password, role } = req.body;
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const newUser = { username, email, password, role };
        await db.collection('users').insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login and get JWT token
app.post('/api/auth/login', async (req, res) => {
    try {
        const db = mongoClient.db('your_db_name');
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin-only route
app.get('/api/users/admin', verifyToken('admin'), (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});