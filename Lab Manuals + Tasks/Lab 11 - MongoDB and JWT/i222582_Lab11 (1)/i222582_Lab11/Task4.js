const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define Customer schema and model
const CustomerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    customerType: { type: String, enum: ['regular', 'VIP', 'new'], default: 'regular' },
    createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', CustomerSchema);

// Create a new customer
app.post('/api/customers/create', async (req, res) => {
    try {
        const { username, email, password, customerType } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newCustomer = new Customer({
            username,
            email,
            password: hashedPassword,
            customerType
        });

        await newCustomer.save();
        res.status(201).json({ message: 'Customer created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single customer
app.get('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const { username, email, password, customerType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { username, email, password: hashedPassword, customerType },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a customer
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});