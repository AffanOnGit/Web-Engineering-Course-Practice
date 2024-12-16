const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample wizard data
let wizards = [
    { id: 1, name: 'Gandalf', type: 'fire', attack: 50, defense: 30, health: 100, energy: 80 },
    { id: 2, name: 'Frosty', type: 'ice', attack: 30, defense: 60, health: 90, energy: 50 },
    { id: 3, name: 'Stormbringer', type: 'storm', attack: 40, defense: 40, health: 80, energy: 20 },
];

// Root route to handle requests to "/"
app.get('/', (req, res) => {
    res.send('Welcome to the Wizard Duel Arena API!');
});


// Error handler middleware
function errorHandler(err, req, res, next) {
    console.error(err.message);
    res.status(500).json({ error: 'OOPS...Something went wrong!' });
}

// Wizard Type Check Middleware
function wizardTypeCheck(req, res, next) {
    const { wizard1, wizard2 } = req.body;

    const applyTypeBoosts = (wizard) => {
        if (wizard.type === 'fire') {
            wizard.attackBoost = 20;
        } else if (wizard.type === 'ice') {
            wizard.defenseBoost = 20;
        } else if (wizard.type === 'storm') {
            wizard.speedBoost = 20;
        }
    };

    applyTypeBoosts(wizard1);
    applyTypeBoosts(wizard2);

    next();
}

// Health Check Middleware
function healthCheck(req, res, next) {
    const { wizard1, wizard2 } = req.body;

    const checkHealth = (wizard) => {
        if (wizard.health < 20) {
            wizard.abilityReduction = 0.7; // Reduces abilities if health is below 20%
        } else {
            wizard.abilityReduction = 1;
        }
    };

    checkHealth(wizard1);
    checkHealth(wizard2);

    next();
}

// Magic Energy Level Middleware
function magicEnergyLevel(req, res, next) {
    const { wizard1, wizard2 } = req.body;

    const checkEnergy = (wizard) => {
        if (wizard.energy < 50) {
            wizard.canUseHighLevelSpells = false;
            req.spellLevel = 'basic';
        } else {
            wizard.canUseHighLevelSpells = true;
            req.spellLevel = 'high';
        }
    };

    checkEnergy(wizard1);
    checkEnergy(wizard2);

    next();
}

// Duel Outcome Logic Middleware
function duelOutcome(req, res, next) {
    const { wizard1, wizard2 } = req.body;

    const calculatePower = (wizard) => {
        let power = wizard.attack * wizard.abilityReduction;
        if (wizard.attackBoost) power += wizard.attackBoost;
        if (wizard.defenseBoost) power += wizard.defenseBoost;
        if (wizard.speedBoost) power += wizard.speedBoost;
        if (wizard.canUseHighLevelSpells) power += 30; // High-level spells add extra power
        return power;
    };

    const wizard1Power = calculatePower(wizard1);
    const wizard2Power = calculatePower(wizard2);

    req.outcome = wizard1Power > wizard2Power ? `${wizard1.name} wins!` : `${wizard2.name} wins!`;
    req.attackerId = wizard1.id;
    req.defenderId = wizard2.id;


    next();
}

// Routes
app.post('/duel', wizardTypeCheck, healthCheck, magicEnergyLevel, duelOutcome, (req, res) => { //after the endpoint, we add the middleware functions
    const { attackerId, defenderId, outcome, spellLevel } = req;

    res.status(200).json({
        message: 'Duel completed',
        attackerId,
        defenderId,
        outcome,
        spellLevel
    });
});

app.put('/wizards/upgrade', (req, res) => {
    const { id, attack, defense, health, energy } = req.body;
    const wizard = wizards.find(w => w.id === id);

    if (!wizard) {
        return res.status(404).json({ message: 'Wizard not found' });
    }

    // Update wizard stats
    wizard.attack += attack || 0;
    wizard.defense += defense || 0;
    wizard.health += health || 0;
    wizard.energy += energy || 0;

    res.status(200).json({ message: 'Wizard upgraded:', wizard });
});

app.get('/wizards', (req, res) => {
    res.status(200).json(wizards);
});

// Apply the error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
