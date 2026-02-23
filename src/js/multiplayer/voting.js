// ============================================
// Dispute Voting System
// ============================================

import { dbSet, dbGet, dbListen, getCurrentUserId, dbUpdate } from '../firebase-config.js';

/**
 * Start a dispute for a specific answer
 */
export async function startDispute(roomId, roundNum, targetPlayerId, categoryId, word) {
    const disputeId = `${targetPlayerId}_${categoryId}`;
    const userId = getCurrentUserId();

    await dbSet(`rooms/${roomId}/rounds/${roundNum}/disputes/${disputeId}`, {
        targetPlayer: targetPlayerId,
        category: categoryId,
        word,
        startedBy: userId,
        startedAt: Date.now(),
        votes: {
            [userId]: 'reject' // The person who started the dispute votes reject
        },
        status: 'voting'
    });

    return disputeId;
}

/**
 * Vote on a dispute
 */
export async function voteOnDispute(roomId, roundNum, disputeId, vote) {
    const userId = getCurrentUserId();
    await dbUpdate(`rooms/${roomId}/rounds/${roundNum}/disputes/${disputeId}/votes`, {
        [userId]: vote // 'accept' or 'reject'
    });
}

/**
 * Resolve a dispute based on votes
 */
export async function resolveDispute(roomId, roundNum, disputeId, players) {
    const snapshot = await dbGet(`rooms/${roomId}/rounds/${roundNum}/disputes/${disputeId}`);
    const dispute = snapshot?.val ? snapshot.val() : null;

    if (!dispute || !dispute.votes) return null;

    const votes = dispute.votes;
    const acceptCount = Object.values(votes).filter(v => v === 'accept').length;
    const rejectCount = Object.values(votes).filter(v => v === 'reject').length;
    const totalPlayers = Object.keys(players).length;

    // Majority decides, or timeout = accept
    let result;
    if (acceptCount > rejectCount) {
        result = 'accepted';
    } else if (rejectCount > acceptCount) {
        result = 'rejected';
    } else {
        result = 'accepted'; // Tie goes to player (benefit of doubt)
    }

    await dbUpdate(`rooms/${roomId}/rounds/${roundNum}/disputes/${disputeId}`, {
        status: result,
        resolvedAt: Date.now()
    });

    return result;
}

/**
 * Listen for disputes in a round
 */
export function listenToDisputes(roomId, roundNum, callback) {
    return dbListen(`rooms/${roomId}/rounds/${roundNum}/disputes`, callback);
}

/**
 * Check if there are unresolved disputes
 */
export async function hasUnresolvedDisputes(roomId, roundNum) {
    const snapshot = await dbGet(`rooms/${roomId}/rounds/${roundNum}/disputes`);
    const disputes = snapshot?.val ? snapshot.val() : {};

    return Object.values(disputes).some(d => d.status === 'voting');
}
