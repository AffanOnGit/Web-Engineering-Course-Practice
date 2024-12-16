const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample data for the rescue organization
let resources = {
    teamMembers: 5,
    vehicles: 2,
    equipment: 10
};

let missions = [];

// Mission requirements configuration
const missionRequirements = {
    animal: {
        bird: {
            teamMembers: 2,
            vehicles: 1,
            equipment: 2,
            specializedSkills: ['height_rescue', 'handling']
        },
        mammal: {
            teamMembers: 3,
            vehicles: 1,
            equipment: 3,
            specializedSkills: ['tracking', 'containment']
        },
        reptile: {
            teamMembers: 4,
            vehicles: 1,
            equipment: 4,
            specializedSkills: ['handling', 'containment']
        }
    },
    severity: {
        mild: {
            resourceMultiplier: 1,
            timeEstimate: 2, // hours
            successRate: 0.9
        },
        moderate: {
            resourceMultiplier: 1.5,
            timeEstimate: 4,
            successRate: 0.7
        },
        severe: {
            resourceMultiplier: 2,
            timeEstimate: 6,
            successRate: 0.5
        }
    }
};

// Validation middleware
function validateMissionRequest(req, res, next) {
    const { animalType, severity } = req.body;

    if (!animalType || !severity) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    if (!['bird', 'mammal', 'reptile'].includes(animalType)) {
        return res.status(400).json({
            message: 'Invalid animal type. Must be bird, mammal, or reptile.'
        });
    }

    if (!['mild', 'moderate', 'severe'].includes(severity)) {
        return res.status(400).json({
            message: 'Invalid severity level. Must be mild, moderate, or severe.'
        });
    }

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

// Animal Type Check Middleware
function animalTypeCheck(req, res, next) {
    const { animalType } = req.body;
    const animalRequirements = missionRequirements.animal[animalType];

    req.missionDetails = {
        animalType,
        requiredResources: {
            teamMembers: animalRequirements.teamMembers,
            vehicles: animalRequirements.vehicles,
            equipment: animalRequirements.equipment
        },
        specializedSkills: animalRequirements.specializedSkills,
        riskLevel: animalType === 'reptile' ? 'high' :
            animalType === 'mammal' ? 'medium' : 'low'
    };

    next();
}

// Severity Level Check Middleware
function severityLevelCheck(req, res, next) {
    const { severity } = req.body;
    const severityConfig = missionRequirements.severity[severity];
    const { requiredResources } = req.missionDetails;

    // Adjust resource requirements based on severity
    for (const [resource, amount] of Object.entries(requiredResources)) {
        requiredResources[resource] = Math.ceil(amount * severityConfig.resourceMultiplier);
    }

    req.missionDetails = {
        ...req.missionDetails,
        severity,
        timeEstimate: severityConfig.timeEstimate,
        baseSuccessRate: severityConfig.successRate
    };

    next();
}

// Resource Availability Check Middleware
function resourceAvailabilityCheck(req, res, next) {
    const { requiredResources } = req.missionDetails;

    // Check if resources are sufficient
    const resourceCheck = {
        teamMembers: resources.teamMembers >= requiredResources.teamMembers,
        vehicles: resources.vehicles >= requiredResources.vehicles,
        equipment: resources.equipment >= requiredResources.equipment
    };

    const allResourcesAvailable = Object.values(resourceCheck).every(available => available);

    if (!allResourcesAvailable) {
        const missingResources = Object.entries(resourceCheck)
            .filter(([_, available]) => !available)
            .map(([resource]) => resource);

        return res.status(400).json({
            message: 'Insufficient resources',
            missingResources,
            required: requiredResources,
            available: resources
        });
    }

    // Reserve resources for the mission
    req.missionDetails.resourcesReserved = true;

    next();
}

// Mission Outcome Determination Middleware
function missionOutcomeDetermination(req, res, next) {
    const {
        baseSuccessRate,
        riskLevel,
        severity,
        requiredResources
    } = req.missionDetails;

    // Calculate success probability
    let successProbability = baseSuccessRate;

    // Adjust for risk level
    if (riskLevel === 'high') successProbability *= 0.8;
    else if (riskLevel === 'medium') successProbability *= 0.9;

    // Additional resources bonus
    const resourceSurplus = Object.entries(requiredResources).every(
        ([resource, required]) => resources[resource] >= required * 1.5
    );
    if (resourceSurplus) successProbability *= 1.2;

    // Determine outcome
    const success = Math.random() <= successProbability;

    if (success) {
        // Update resources
        Object.entries(requiredResources).forEach(([resource, amount]) => {
            resources[resource] -= amount;
        });

        const missionId = missions.length + 1;
        const mission = {
            id: missionId,
            ...req.missionDetails,
            outcome: 'success',
            completedAt: new Date()
        };
        missions.push(mission);

        req.missionOutcome = {
            success: true,
            missionId,
            timeSpent: req.missionDetails.timeEstimate
        };
    } else {
        req.missionOutcome = {
            success: false,
            reason: severity === 'severe' ? 'Conditions too dangerous' : 'Complications during rescue',
            recommendedDelay: 2 // hours
        };
    }

    next();
}

// Routes
app.post('/rescue-mission',
    validateMissionRequest,
    animalTypeCheck,
    severityLevelCheck,
    resourceAvailabilityCheck,
    missionOutcomeDetermination,
    (req, res) => {
        const { success, missionId, timeSpent, reason, recommendedDelay } = req.missionOutcome;

        res.status(200).json({
            message: 'Rescue mission processed',
            outcome: success ? 'success' : 'failure',
            ...(success && {
                missionId,
                timeSpent,
                resourcesUsed: req.missionDetails.requiredResources
            }),
            ...(!success && {
                reason,
                recommendedDelay
            })
        });
    }
);

// Apply the error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});