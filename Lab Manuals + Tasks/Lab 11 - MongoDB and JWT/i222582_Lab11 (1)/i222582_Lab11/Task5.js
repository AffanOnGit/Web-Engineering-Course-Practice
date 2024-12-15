const express = require('express');
const mongoose = require('mongoose');
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

// Define Department schema and model
const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true }
});

const Department = mongoose.model('Department', DepartmentSchema);

// Define Employee schema and model
const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// Create a Department
app.post('/api/departments', async (req, res) => {
    try {
        const { name, location } = req.body;
        const newDepartment = new Department({ name, location });
        await newDepartment.save();
        res.status(201).json(newDepartment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create an Employee
app.post('/api/employees', async (req, res) => {
    try {
        const { name, email, position, departmentId } = req.body;
        const newEmployee = new Employee({ name, email, position, departmentId });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Employees with Department info
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find().populate('departmentId', 'name location');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an Employee
app.put('/api/employees/:id', async (req, res) => {
    try {
        const { name, email, position } = req.body;
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, position },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a Department (and its associated Employees)
app.delete('/api/departments/:id', async (req, res) => {
    try {
        // Delete all employees in the department
        await Employee.deleteMany({ departmentId: req.params.id });

        // Delete the department
        const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
        if (!deletedDepartment) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.json({ message: 'Department and associated employees deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});