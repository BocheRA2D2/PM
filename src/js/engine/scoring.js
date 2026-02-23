// ============================================
// Scoring Engine
// ============================================

export const SCORING_MODES = {
    STANDARD: 'standard',
    HARDCORE: 'hardcore',
    EASY: 'easy'
};

export const SCORING_INFO = {
    [SCORING_MODES.STANDARD]: {
        name: 'Standardowa',
        description: '0/5/10/15 punktów',
        rules: {
            noAnswer: 0,
            duplicate: 5,
            unique: 10,
            soleAnswer: 15
        }
    },
    [SCORING_MODES.HARDCORE]: {
        name: 'Hardcore',
        description: '0/0/20 + bonus',
        rules: {
            noAnswer: 0,
            duplicate: 0,
            unique: 20,
            soleAnswer: 20,
            perfectRoundBonus: 5
        }
    },
    [SCORING_MODES.EASY]: {
        name: 'Łatwa',
        description: '1 pkt za poprawne, +5 za unikalne',
        rules: {
            noAnswer: 0,
            duplicate: 1,
            unique: 6,  // 1 + 5 bonus
            soleAnswer: 6
        }
    }
};

export class ScoringEngine {
    constructor(mode = SCORING_MODES.STANDARD) {
        this.mode = mode;
        this.rules = SCORING_INFO[mode].rules;
    }

    /**
     * Calculate scores for a single round
     * @param {Object} allAnswers - { playerId: { categoryId: "answer" } }
     * @param {Array} categories - array of category objects
     * @param {string} letter - the round's letter
     * @param {Object} validationResults - { playerId: { categoryId: true/false } }
     * @returns {Object} scores - { playerId: { categoryId: points, total: number } }
     */
    calculateRoundScores(allAnswers, categories, letter, validationResults) {
        const scores = {};
        const playerIds = Object.keys(allAnswers);

        // Initialize scores
        playerIds.forEach(pid => {
            scores[pid] = { total: 0 };
        });

        // Process each category
        categories.forEach(category => {
            // Collect valid answers for this category
            const validAnswers = {};
            playerIds.forEach(pid => {
                const answer = (allAnswers[pid]?.[category.id] || '').trim().toLowerCase();
                const isValid = validationResults?.[pid]?.[category.id] !== false;
                const startsCorrect = answer && answer.startsWith(letter.toLowerCase());

                if (answer && isValid && startsCorrect) {
                    validAnswers[pid] = answer;
                }
            });

            // Count unique answers
            const answerCounts = {};
            Object.values(validAnswers).forEach(answer => {
                answerCounts[answer] = (answerCounts[answer] || 0) + 1;
            });

            const validPlayerCount = Object.keys(validAnswers).length;

            // Assign points
            playerIds.forEach(pid => {
                const answer = validAnswers[pid];

                if (!answer) {
                    // No valid answer
                    scores[pid][category.id] = this.rules.noAnswer;
                } else if (validPlayerCount === 1) {
                    // Only person to answer this category
                    scores[pid][category.id] = this.rules.soleAnswer;
                } else if (answerCounts[answer] > 1) {
                    // Duplicate answer
                    scores[pid][category.id] = this.rules.duplicate;
                } else {
                    // Unique answer
                    scores[pid][category.id] = this.rules.unique;
                }

                scores[pid].total += scores[pid][category.id];
            });
        });

        // Hardcore: perfect round bonus
        if (this.mode === SCORING_MODES.HARDCORE && this.rules.perfectRoundBonus) {
            playerIds.forEach(pid => {
                const allScored = categories.every(cat => scores[pid][cat.id] > 0);
                if (allScored) {
                    scores[pid].total += this.rules.perfectRoundBonus;
                    scores[pid].perfectBonus = true;
                }
            });
        }

        return scores;
    }

    /**
     * Get the score class for CSS styling
     */
    static getScoreClass(points) {
        if (points === 0) return 'score-0';
        if (points <= 5) return 'score-5';
        if (points <= 10) return 'score-10';
        if (points <= 15) return 'score-15';
        return 'score-20';
    }

    /**
     * Determine winner from total scores
     */
    static determineWinner(totalScores) {
        const sorted = Object.entries(totalScores)
            .sort(([, a], [, b]) => b - a);

        return sorted.map(([playerId, score], index) => ({
            playerId,
            score,
            position: index + 1
        }));
    }
}
