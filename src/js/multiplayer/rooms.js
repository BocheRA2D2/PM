// ============================================
// Room Management
// ============================================

import { dbSet, dbUpdate, dbGet, dbRemove, dbListen, dbPush, dbOnDisconnect, getCurrentUserId, getServerTimestamp } from '../firebase-config.js';

/**
 * Generate a 6-character room code
 */
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

/**
 * Create a new room
 */
export async function createRoom(settings, playerName) {
    const userId = getCurrentUserId();
    const code = generateRoomCode();
    const roomId = code;

    const roomData = {
        host: userId,
        code: code,
        createdAt: Date.now(),
        settings: {
            mode: settings.mode || 'classic',
            rounds: settings.rounds || 10,
            timePerRound: settings.timePerRound || 30,
            scoring: settings.scoring || 'standard',
            private: settings.private || false,
            maxPlayers: settings.maxPlayers || 6,
            customCategories: settings.customCategories || null
        },
        players: {
            [userId]: {
                name: playerName,
                ready: false,
                online: true,
                violations: 0,
                joinedAt: Date.now()
            }
        },
        state: 'waiting',
        currentRound: 0
    };

    await dbSet(`rooms/${roomId}`, roomData);

    // Set up disconnect handler
    try {
        const disconnectRef = dbOnDisconnect(`rooms/${roomId}/players/${userId}/online`);
        disconnectRef.set(false);
    } catch (e) {
        // Offline mode
    }

    return { roomId, code };
}

/**
 * Join an existing room
 */
export async function joinRoom(roomCode, playerName) {
    const userId = getCurrentUserId();
    const roomId = roomCode.toUpperCase();

    // Check if room exists
    const snapshot = await dbGet(`rooms/${roomId}`);
    const room = snapshot?.val ? snapshot.val() : null;

    if (!room) {
        throw new Error('Pokój nie istnieje');
    }

    if (room.state !== 'waiting') {
        throw new Error('Gra już trwa');
    }

    const playerCount = room.players ? Object.keys(room.players).length : 0;
    if (playerCount >= room.settings.maxPlayers) {
        throw new Error('Pokój jest pełny');
    }

    // Add player
    await dbUpdate(`rooms/${roomId}/players/${userId}`, {
        name: playerName,
        ready: false,
        online: true,
        violations: 0,
        joinedAt: Date.now()
    });

    // Set up disconnect handler
    try {
        const disconnectRef = dbOnDisconnect(`rooms/${roomId}/players/${userId}/online`);
        disconnectRef.set(false);
    } catch (e) {
        // Offline mode
    }

    return { roomId, room };
}

/**
 * Leave a room
 */
export async function leaveRoom(roomId) {
    const userId = getCurrentUserId();

    // Check if we're the host
    const snapshot = await dbGet(`rooms/${roomId}`);
    const room = snapshot?.val ? snapshot.val() : null;

    if (!room) return;

    if (room.host === userId) {
        // Host leaves - delete room
        await dbRemove(`rooms/${roomId}`);
    } else {
        // Player leaves
        await dbRemove(`rooms/${roomId}/players/${userId}`);
    }
}

/**
 * Toggle ready status
 */
export async function toggleReady(roomId) {
    const userId = getCurrentUserId();
    const snapshot = await dbGet(`rooms/${roomId}/players/${userId}/ready`);
    const currentReady = snapshot?.val ? snapshot.val() : false;
    await dbUpdate(`rooms/${roomId}/players/${userId}`, { ready: !currentReady });
    return !currentReady;
}

/**
 * Listen for room updates
 */
export function listenToRoom(roomId, callback) {
    return dbListen(`rooms/${roomId}`, callback);
}

/**
 * Get all public rooms
 */
export async function getPublicRooms() {
    const snapshot = await dbGet('rooms');
    const rooms = snapshot?.val ? snapshot.val() : {};

    return Object.entries(rooms)
        .filter(([, room]) => !room.settings?.private && room.state === 'waiting')
        .map(([id, room]) => ({
            id,
            code: room.code,
            host: room.host,
            hostName: Object.values(room.players || {})[0]?.name || 'Unknown',
            mode: room.settings?.mode || 'classic',
            players: room.players ? Object.keys(room.players).length : 0,
            maxPlayers: room.settings?.maxPlayers || 6,
            rounds: room.settings?.rounds || 10,
            timePerRound: room.settings?.timePerRound || 30
        }));
}

/**
 * Update room state
 */
export async function updateRoomState(roomId, state) {
    await dbUpdate(`rooms/${roomId}`, { state });
}

/**
 * Start the game
 */
export async function startGame(roomId) {
    await dbUpdate(`rooms/${roomId}`, {
        state: 'playing',
        currentRound: 1,
        startedAt: Date.now()
    });
}
