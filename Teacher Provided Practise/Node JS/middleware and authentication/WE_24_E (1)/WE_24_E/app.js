// app.js
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser'); // To parse JSON bodies

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Dummy users data for authentication (replace with your own user management logic)
const Users = [
    { id: 1, email: 'user@example.com', password: 'password123' }, // Example user
    // Add more users as needed
];

// Middleware to check for token
const auth = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // Authorization: 'Bearer TOKEN'
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Error! Token was not provided."
        });
    }
    
    // Decoding the token
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.token = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
};

// Handling login request
app.post("/login", (req, res, next) => {
    let { email, password } = req.body;
    let existingUser = Users.find(u => u.email === email && u.password === password);
    
    if (!existingUser) {
        const error = new Error("Wrong details, please check again.");
        return res.status(401).json({
            success: false,
            error: error.message
        });
    } else {
        let token;
        try {
            // Creating JWT token
            token = jwt.sign(
                { userId: existingUser.id, email: existingUser.email },
                process.env.SECRET,
                { expiresIn: "1h" }
            );
        } catch (err) {
            console.error(err);
            const error = new Error("Error! Something went wrong.");
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: {
                userId: existingUser.id,
                email: existingUser.email,
                token: token,
            },
        });
    }
});

// Route to access resource
app.get('/accessResource2', auth, (req, res) => {
    const decodedToken = req.token;

    res.status(200).json({
        success: true,
        data: {
            userId: decodedToken.userId,
            email: decodedToken.email
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//1. make folder 
//2. npm init -y 
//3. npm install express jsonwebtoken dotenv body-parser --save
//4. create .env file in the folder and paste your secret key in it like this -> SECRET=your_secret_key_here
//5. run the project
//6. send the curl command using terminal -> curl.exe -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{\"email\":\"user@example.com\",\"password\":\"password123\"}'
//7. send get request using the postman, paste you token there, url-> http://localhost:3000/accessResource2
