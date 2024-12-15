// index.js
const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use user routes
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


//curl.exe -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{\"name\": \"Jack\", \"email\": \"jack123@example.com\", \"age\": 30 }'
//curl.exe -X GET http://localhost:3000/users
//curl.exe -X GET http://localhost:3000/users/userid
//curl.exe -X PUT http://localhost:3000/users/userid -H "Content-Type: application/json" -d '{ \"name\": \"John\",  \"age\": 25}'
//curl.exe -X DELETE http://localhost:3000/users/userid

