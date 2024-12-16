const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample player data
let players = [
    { id: 1, name: 'Hero', strength: 80, agility: 60, wisdom: 70, experience: 200, resources: { gold: 500, potions: 3 }, questStatus: 'pending' },
    { id: 2, name: 'Rogue', strength: 60, agility: 90, wisdom: 50, experience: 150, resources: { gold: 300, potions: 1 }, questStatus: 'pending' },
    { id: 3, name: 'Mage', strength: 50, agility: 40, wisdom: 100, experience: 250, resources: { gold: 700, potions: 5 }, questStatus: 'pending' },
];

// Quest difficulty configurations
const questConfigs = {
    easy: {
        minSkillLevel: 40,
        expReward: 50,
        goldReward: 100,
        potionCost: 1,
        goldCost: 100
    },
    moderate: {
        minSkillLevel: 60,
        expReward: 100,
        goldReward: 200,
        potionCost: 2,
        goldCost: 200
    },
    hard: {
        minSkillLevel: 80,
        expReward: 200,
        goldReward: 400,
        potionCost: 3,
        goldCost: 400
    }
};

// Validation middleware
function validateQuestRequest(req, res, next) {
    const { playerId, questDifficulty } = req.body;

    if (!playerId || !questDifficulty) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    if (!['easy', 'moderate', 'hard'].includes(questDifficulty)) {
        return res.status(400).json({
            message: 'Invalid quest difficulty'
        });
    }

    const player = players.find(p => p.id === playerId);
    if (!player) {
        return res.status(404).json({
            message: 'Player not found'
        });
    }

    req.player = player;
    req.questConfig = questConfigs[questDifficulty];
    next();
}

// Error handler middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        message: 'An error occurred',
        error: err.message
    });
}

// Skill Level Check Middleware
function skillLevelCheck(req, res, next) {
    const { player, questConfig } = req;

    // Calculate average skill level
    const skillLevel = (player.strength + player.agility + player.wisdom) / 3;

    // Calculate bonus based on highest skill
    const highestSkill = Math.max(player.strength, player.agility, player.wisdom);
    const skillBonus = highestSkill > questConfig.minSkillLevel ? 0.2 : 0;

    req.questOutcome = {
        skillLevel,
        skillBonus,
        isSkillSufficient: skillLevel >= questConfig.minSkillLevel
    };

    next();
}

// Experience Level Check Middleware
function experienceLevelCheck(req, res, next) {
    const { player, questConfig } = req;

    // Calculate experience bonus
    const expLevel = Math.floor(player.experience / 100);
    const expBonus = expLevel * 0.1; // 10% bonus per 100 exp

    req.questOutcome = {
        ...req.questOutcome,
        expLevel,
        expBonus,
        totalBonus: req.questOutcome.skillBonus + expBonus
    };

    next();
}

// Resource Availability Check Middleware
function resourceAvailabilityCheck(req, res, next) {
    const { player, questConfig } = req;

    const hasEnoughPotions = player.resources.potions >= questConfig.potionCost;
    const hasEnoughGold = player.resources.gold >= questConfig.goldCost;

    if (!hasEnoughPotions || !hasEnoughGold) {
        return res.status(400).json({
            message: 'Quest failed',
            outcome: 'failure',
            reason: 'Insufficient resources',
            required: {
                potions: questConfig.potionCost,
                gold: questConfig.goldCost
            },
            current: player.resources
        });
    }

    req.questOutcome = {
        ...req.questOutcome,
        resourcesAvailable: true
    };

    next();
}

// Final Quest Outcome Middleware
function finalQuestOutcome(req, res, next) {
    const { player, questConfig, questOutcome } = req;

    // Calculate success chance
    const baseChance = questOutcome.isSkillSufficient ? 0.7 : 0.3;
    const finalChance = baseChance + questOutcome.totalBonus;
    const success = Math.random() <= finalChance;

    if (success) {
        // Calculate rewards with bonuses
        const expReward = Math.round(questConfig.expReward * (1 + questOutcome.totalBonus));
        const goldReward = Math.round(questConfig.goldReward * (1 + questOutcome.totalBonus));

        // Update player resources
        const playerIndex = players.findIndex(p => p.id === player.id);
        players[playerIndex] = {
            ...player,
            experience: player.experience + expReward,
            resources: {
                gold: player.resources.gold + goldReward - questConfig.goldCost,
                potions: player.resources.potions - questConfig.potionCost
            },
            questStatus: 'completed'
        };

        req.questOutcome = {
            ...questOutcome,
            success: true,
            rewards: {
                experience: expReward,
                gold: goldReward
            }
        };
    } else {
        // Deduct resources on failure
        const playerIndex = players.findIndex(p => p.id === player.id);
        players[playerIndex] = {
            ...player,
            resources: {
                gold: player.resources.gold - Math.floor(questConfig.goldCost / 2),
                potions: player.resources.potions - Math.floor(questConfig.potionCost / 2)
            },
            questStatus: 'failed'
        };

        req.questOutcome = {
            ...questOutcome,
            success: false
        };
    }

    next();
}

// Routes
app.post('/complete-quest',
    validateQuestRequest,
    skillLevelCheck,
    experienceLevelCheck,
    resourceAvailabilityCheck,
    finalQuestOutcome,
    (req, res) => {
        const { success, rewards } = req.questOutcome;

        res.status(200).json({
            message: 'Quest completion processed',
            outcome: success ? 'success' : 'failure',
            ...(success && { rewards })
        });
    }
);

app.put('/players/upgrade-stats', (req, res) => {
    const { id, strength, agility, wisdom } = req.body;

    const playerIndex = players.findIndex(p => p.id === id);
    if (playerIndex === -1) {
        return res.status(404).json({ message: 'Player not found' });
    }

    // Validate stat upgrades
    if (strength < 0 || agility < 0 || wisdom < 0) {
        return res.status(400).json({ message: 'Stat upgrades cannot be negative' });
    }

    const player = players[playerIndex];
    players[playerIndex] = {
        ...player,
        strength: player.strength + (strength || 0),
        agility: player.agility + (agility || 0),
        wisdom: player.wisdom + (wisdom || 0)
    };

    res.status(200).json({
        message: 'Player stats upgraded',
        player: players[playerIndex]
    });
});

app.get('/players', (req, res) => {
    res.status(200).json(players);
});

// Apply the error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});