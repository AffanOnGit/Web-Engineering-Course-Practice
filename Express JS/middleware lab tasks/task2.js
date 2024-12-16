const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample customer data
let customers = [
    { id: 1, name: 'Alice', creditScore: 650, debt: 300, income: 1000, balance: 1200, loanStatus: 'pending' },
    { id: 2, name: 'Bob', creditScore: 550, debt: 800, income: 1500, balance: 900, loanStatus: 'pending' },
    { id: 3, name: 'Charlie', creditScore: 700, debt: 500, income: 2000, balance: 1500, loanStatus: 'pending' },
];

// Error handler middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        message: 'An error occurred',
        error: err.message
    });
}

// Validation middleware
function validateLoanApplication(req, res, next) {
    const { customerId, creditScore, currentDebt, accountBalance } = req.body;

    if (!customerId || !creditScore || currentDebt === undefined || accountBalance === undefined) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    if (typeof creditScore !== 'number' || typeof currentDebt !== 'number' || typeof accountBalance !== 'number') {
        return res.status(400).json({
            message: 'Invalid data types for financial information'
        });
    }

    next();
}

// Credit Score Check Middleware
function creditScoreCheck(req, res, next) {
    const { creditScore } = req.body;

    if (creditScore < 600) {
        return res.status(400).json({
            message: 'Loan application denied',
            reason: 'Credit score below minimum requirement',
            status: 'denied'
        });
    }

    // Add risk level based on credit score
    req.riskAssessment = {
        creditScoreRisk: creditScore < 650 ? 'high' : creditScore < 700 ? 'medium' : 'low'
    };

    next();
}

// Debt-to-Income Ratio Check Middleware
function debtToIncomeRatioCheck(req, res, next) {
    const customer = customers.find(c => c.id === req.body.customerId);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    const debtToIncomeRatio = (req.body.currentDebt / customer.income) * 100;

    req.riskAssessment = {
        ...req.riskAssessment,
        debtToIncomeRatio,
        dtiRisk: debtToIncomeRatio > 40 ? 'high' : debtToIncomeRatio > 30 ? 'medium' : 'low'
    };

    next();
}

// Account Balance Check Middleware
function accountBalanceCheck(req, res, next) {
    const { accountBalance } = req.body;
    const MINIMUM_BALANCE = 1000;

    req.riskAssessment = {
        ...req.riskAssessment,
        balanceRisk: accountBalance < MINIMUM_BALANCE ? 'high' : 'low'
    };

    next();
}

// Final Loan Approval Logic Middleware
function finalLoanApproval(req, res, next) {
    const { creditScoreRisk, dtiRisk, balanceRisk, debtToIncomeRatio } = req.riskAssessment;
    const BASE_LOAN_AMOUNT = 10000;

    let loanAmount = BASE_LOAN_AMOUNT;
    let status = 'approved';

    // Reduce loan amount based on risk factors
    if (creditScoreRisk === 'high') loanAmount *= 0.6;
    else if (creditScoreRisk === 'medium') loanAmount *= 0.8;

    if (dtiRisk === 'high') loanAmount *= 0.5;
    else if (dtiRisk === 'medium') loanAmount *= 0.7;

    if (balanceRisk === 'high') loanAmount *= 0.8;

    // Deny loan if too many high risks
    const highRiskCount = [creditScoreRisk, dtiRisk, balanceRisk].filter(risk => risk === 'high').length;

    if (highRiskCount >= 2 || debtToIncomeRatio > 50) {
        status = 'denied';
        loanAmount = 0;
    }

    req.loanDecision = {
        status,
        loanAmount: Math.round(loanAmount)
    };

    next();
}

// Routes
app.post('/apply-loan',
    validateLoanApplication,
    creditScoreCheck,
    debtToIncomeRatioCheck,
    accountBalanceCheck,
    finalLoanApproval,
    (req, res) => {
        const { status, loanAmount } = req.loanDecision;

        // Update customer loan status
        const customerIndex = customers.findIndex(c => c.id === req.body.customerId);
        if (customerIndex !== -1) {
            customers[customerIndex] = {
                ...customers[customerIndex],
                loanStatus: status,
                loanAmount
            };
        }

        res.status(200).json({
            message: 'Loan application processed',
            status,
            loanAmount
        });
    }
);

app.get('/customers/loan-status', (req, res) => {
    const { customerId } = req.body;

    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
        customerId: customer.id,
        loanStatus: customer.loanStatus,
        loanAmount: customer.loanAmount || 0
    });
});

app.put('/customers/update-info', (req, res) => {
    const { customerId, balance, debt, income } = req.body;

    if (!customerId || !balance || !debt || !income) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    customers[customerIndex] = {
        ...customers[customerIndex],
        balance,
        debt,
        income
    };

    res.status(200).json({
        message: 'Customer financial information updated',
        customer: customers[customerIndex]
    });
});

// Apply the error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});