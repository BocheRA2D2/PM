// ============================================
// Real-time Game Sync
// ============================================

import { dbSet, dbUpdate, dbGet, dbListen, getCurrentUserId } from '../firebase-config.js';

/**
 * Submit round data (letter, categories) - host only
 */
export async function submitRoundData(roomId, roundNum, letter, categories) {
    await dbSet(`rooms/${roomId}/rounds/${roundNum}`, {
        letter,
        categories: categories.map(c => c.id),
        categoryNames: categories.map(c => c.name),
        startTime: Date.now(),
        state: 'playing'
    });
    await dbUpdate(`rooms/${roomId}`, { currentRound: roundNum });
}

/**
 * Submit player answers
 */
export async function submitAnswers(roomId, roundNum, answers) {
    const userId = getCurrentUserId();
    await dbSet(`rooms/${roomId}/rounds/${roundNum}/answers/${userId}`, {
        ...answers,
        submitted: true,
        submittedAt: Date.now()
    });
}

/**
 * Submit round scores
 */
export async function submitRoundScores(roomId, roundNum, scores) {
    await dbSet(`rooms/${roomId}/rounds/${roundNum}/scores`, scores);
    await dbUpdate(`rooms/${roomId}/rounds/${roundNum}`, { state: 'results' });
}

/**
 * Update total scores
 */
export async function updateTotalScores(roomId, totalScores) {
    await dbUpdate(`rooms/${roomId}`, { totalScores });
}

/**
 * Report an anti-cheat violation
 */
export async function reportViolation(roomId, roundNum) {
    const userId = getCurrentUserId();

    // Zero out this round's answers
    await dbUpdate(`rooms/${roomId}/rounds/${roundNum}/answers/${userId}`, {
        cheated: true,
        submitted: true
    });

    // Increment violation counter
    const snapshot = await dbGet(`rooms/${roomId}/players/${userId}/violations`);
    const violations = (snapshot?.val ? snapshot.val() : 0) + 1;
    await dbUpdate(`rooms/${roomId}/players/${userId}`, { violations });

    return violations;
}

/**
 * Listen for round updates
 */
export function listenToRound(roomId, roundNum, callback) {
    return dbListen(`rooms/${roomId}/rounds/${roundNum}`, callback);
}

/**
 * Listen for all answers submitted
 */
export function listenToAnswers(roomId, roundNum, callback) {
    return dbListen(`rooms/${roomId}/rounds/${roundNum}/answers`, callback);
}

/**
 * Listen for game state changes
 */
export function listenToGameState(roomId, callback) {
    return dbListen(`rooms/${roomId}`, callback);
}

/**
 * Set next round or end game
 */
export async function advanceRound(roomId, nextRound, totalRounds) {
    if (nextRound > totalRounds) {
        await dbUpdate(`rooms/${roomId}`, { state: 'finished' });
    } else {
        await dbUpdate(`rooms/${roomId}`, {
            currentRound: nextRound,
            state: 'playing'
        });
    }
}

/**
 * Check if all players have submitted
 */
export function allPlayersSubmitted(answers, players) {
    if (!answers || !players) return false;
    const playerIds = Object.keys(players);
    return playerIds.every(pid =>
        answers[pid]?.submitted === true || answers[pid]?.cheated === true
    );
}
