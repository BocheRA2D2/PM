// ============================================
// Waiting Room Screen
// ============================================

import { GAME_MODE_INFO } from '../engine/categories.js';
import { SCORING_INFO } from '../engine/scoring.js';

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#14b8a6'];

export function renderRoom(app, roomData) {
    if (!roomData) {
        return `<div class="screen"><div class="empty-state"><div class="spinner"></div><p class="mt-md">Ładowanie pokoju...</p></div></div>`;
    }

    const { settings, players, host, code } = roomData;
    const playerList = players ? Object.entries(players) : [];
    const isHost = app.isHost(roomData);
    const allReady = playerList.length >= 2 && playerList.every(([, p]) => p.ready || playerList.find(([id]) => id === host)?.[1] === p);
    const modeInfo = GAME_MODE_INFO[settings?.mode] || GAME_MODE_INFO.classic;
    const scoringInfo = SCORING_INFO[settings?.scoring] || SCORING_INFO.standard;

    return `
        <div class="screen waiting-room">
            <div class="lobby-header animate-fadeIn">
                <button class="lobby-back-btn" data-action="leave-room">←</button>
                <h2>Pokój</h2>
                <div style="width:40px"></div>
            </div>

            <div class="waiting-room-header animate-fadeInDown">
                <p class="text-muted">Kod pokoju</p>
                <div class="waiting-room-code" id="room-code" title="Kliknij aby skopiować">
                    ${code || '------'}
                    <span style="font-size:0.875rem; opacity:0.6;">📋</span>
                </div>
            </div>

            <div class="settings-summary animate-fadeInUp delay-1">
                <div class="settings-row">
                    <span class="settings-row-label">Tryb</span>
                    <span class="settings-row-value">${modeInfo.icon} ${modeInfo.name}</span>
                </div>
                <div class="settings-row">
                    <span class="settings-row-label">Rundy</span>
                    <span class="settings-row-value">${settings?.rounds || 10}</span>
                </div>
                <div class="settings-row">
                    <span class="settings-row-label">Czas</span>
                    <span class="settings-row-value">${settings?.timePerRound || 30}s</span>
                </div>
                <div class="settings-row">
                    <span class="settings-row-label">Punktacja</span>
                    <span class="settings-row-value">${scoringInfo.name}</span>
                </div>
                <div class="settings-row">
                    <span class="settings-row-label">Graczy</span>
                    <span class="settings-row-value">${playerList.length}/${settings?.maxPlayers || 6}</span>
                </div>
            </div>

            <h3 class="mb-md animate-fadeInUp delay-2" style="font-size:1rem;">Gracze</h3>
            <div class="player-list" id="player-list">
                ${playerList.map(([playerId, player], index) => `
                    <div class="player-item" style="animation-delay:${0.1 * (index + 1)}s">
                        <div class="avatar" style="background:${AVATAR_COLORS[index % AVATAR_COLORS.length]}">
                            ${(player.name || '?')[0].toUpperCase()}
                        </div>
                        <span class="player-item-name">${player.name || 'Gracz'}</span>
                        ${playerId === host ? '<span class="player-item-host">👑 Host</span>' : ''}
                        <span class="player-item-ready ${player.ready || playerId === host ? 'ready' : 'not-ready'}">
                            ${player.ready || playerId === host ? '✓ Gotowy' : '⏳ Czeka'}
                        </span>
                    </div>
                `).join('')}
            </div>

            <div class="mt-lg" style="display:flex; flex-direction:column; gap:12px;">
                ${isHost ? `
                    <button class="btn btn-primary btn-lg btn-block" data-action="start-game"
                            ${playerList.length < 2 ? 'disabled' : ''}>
                        🚀 Rozpocznij Grę
                    </button>
                ` : `
                    <button class="btn btn-secondary btn-lg btn-block" data-action="toggle-ready">
                        ✋ Gotowy
                    </button>
                `}
            </div>
        </div>
    `;
}

export function initRoomEvents(app, roomId) {
    // Copy code
    document.getElementById('room-code')?.addEventListener('click', () => {
        const code = document.getElementById('room-code')?.textContent?.trim()?.replace('📋', '').trim();
        if (code && navigator.clipboard) {
            navigator.clipboard.writeText(code);
            app.showToast('Kod skopiowany! 📋', 'success');
        }
    });

    // Leave room
    document.querySelector('[data-action="leave-room"]')?.addEventListener('click', async () => {
        await app.leaveCurrentRoom();
    });

    // Start game (host only)
    document.querySelector('[data-action="start-game"]')?.addEventListener('click', async () => {
        await app.startCurrentGame();
    });

    // Toggle ready
    document.querySelector('[data-action="toggle-ready"]')?.addEventListener('click', async () => {
        await app.togglePlayerReady();
    });
}
