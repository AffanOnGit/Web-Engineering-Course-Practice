const express = require('express');
const app = express();
app.use(cors());
app.use(express.json()); //json parser


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 5000;

let users = [

];

// Endpoint to register a new user 
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(u => u.username === username);
    if (existingUser) return res.status(400).send('User already exists');

    // Hash password before storing 
    const hashedPassword = await bcrypt.hash(password, 10); //hash is the promise function. 
    const newUser = { id: Date.now(), username, password: hashedPassword };
    users.push(newUser);
    res.send('User registered successfully');
});

// Endpoint to log in and get a token 
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    // Check if user exists and verify password with bcrypt 
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return res.json({ token });
    }
    return res.status(401).send('Invalid credentials');
});

// Middleware to verify token 
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected route 
app.get('/protected', verifyToken, (req, res) => {
    res.send('This is a protected route. Welcome, user ' + req.user.id);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});