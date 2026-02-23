// ============================================
// Lobby Screen (Create / Browse / Join)
// ============================================

import { GAME_MODES, GAME_MODE_INFO, CategoryEngine } from '../engine/categories.js';
import { SCORING_MODES, SCORING_INFO } from '../engine/scoring.js';
import { CATEGORIES } from '../data/categories-pool.js';

export function renderLobby(app, params = {}) {
    const activeTab = params.tab || 'create';

    return `
        <div class="screen lobby-screen">
            <div class="lobby-header animate-fadeIn">
                <button class="lobby-back-btn" data-action="back">←</button>
                <h2>Lobby</h2>
                <div style="width:40px"></div>
            </div>

            <div class="lobby-tabs animate-fadeInDown">
                <button class="lobby-tab ${activeTab === 'create' ? 'active' : ''}" data-tab="create">Stwórz</button>
                <button class="lobby-tab ${activeTab === 'browse' ? 'active' : ''}" data-tab="browse">Przeglądaj</button>
                <button class="lobby-tab ${activeTab === 'join' ? 'active' : ''}" data-tab="join">Kod</button>
            </div>

            <div id="lobby-content" class="animate-fadeInUp">
                ${activeTab === 'create' ? renderCreateTab() :
            activeTab === 'browse' ? renderBrowseTab() :
                renderJoinTab()}
            </div>
        </div>
    `;
}

function renderCreateTab() {
    const modes = Object.entries(GAME_MODE_INFO);
    const scoringModes = Object.entries(SCORING_INFO);

    return `
        <div class="create-room-form">
            <div class="form-group">
                <label>🎮 Tryb gry</label>
                <select id="game-mode" class="select-field">
                    ${modes.map(([key, mode]) => `
                        <option value="${key}" ${key === GAME_MODES.CLASSIC ? 'selected' : ''}>
                            ${mode.icon} ${mode.name} — ${mode.description}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div id="custom-categories-section" class="form-group hidden">
                <label>📂 Wybierz 7 kategorii</label>
                <div class="category-grid" id="category-grid">
                    ${CATEGORIES.map(cat => `
                        <button class="category-chip" data-cat-id="${cat.id}">
                            ${cat.icon} ${cat.name}
                        </button>
                    `).join('')}
                </div>
                <div class="selected-count" id="selected-count">Wybrano: 0/7</div>
            </div>

            <div class="form-group">
                <label>🔄 Liczba rund</label>
                <select id="rounds-count" class="select-field">
                    <option value="5">5 rund</option>
                    <option value="10" selected>10 rund</option>
                    <option value="15">15 rund</option>
                    <option value="20">20 rund</option>
                </select>
            </div>

            <div class="form-group">
                <label>⏱️ Czas na rundę</label>
                <select id="round-time" class="select-field">
                    <option value="15">15 sekund</option>
                    <option value="20">20 sekund</option>
                    <option value="30" selected>30 sekund</option>
                    <option value="40">40 sekund</option>
                    <option value="60">60 sekund</option>
                </select>
            </div>

            <div class="form-group">
                <label>👥 Max graczy</label>
                <select id="max-players" class="select-field">
                    <option value="2">2 graczy</option>
                    <option value="3">3 graczy</option>
                    <option value="4">4 graczy</option>
                    <option value="6" selected>6 graczy</option>
                    <option value="8">8 graczy</option>
                </select>
            </div>

            <div class="form-group">
                <label>⚔️ Punktacja</label>
                <select id="scoring-mode" class="select-field">
                    ${scoringModes.map(([key, mode]) => `
                        <option value="${key}" ${key === SCORING_MODES.STANDARD ? 'selected' : ''}>
                            ${mode.name} — ${mode.description}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div class="form-group">
                <div class="toggle-wrapper">
                    <label>🔒 Pokój prywatny</label>
                    <button id="private-toggle" class="toggle" data-active="false"></button>
                </div>
            </div>

            <button class="btn btn-primary btn-lg btn-block" data-action="create-game">
                🚀 Stwórz Pokój
            </button>
        </div>
    `;
}

function renderBrowseTab() {
    return `
        <div id="room-list" class="room-list">
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <p>Szukam dostępnych pokojów...</p>
                <div class="spinner" style="margin: 16px auto;"></div>
            </div>
        </div>
    `;
}

function renderJoinTab() {
    return `
        <div class="join-code-section">
            <h3>Wpisz kod pokoju</h3>
            <p class="text-muted" style="margin-bottom:16px">Poproś hosta o 6-znakowy kod</p>
            <div class="code-input">
                ${[0, 1, 2, 3, 4, 5].map(i => `
                    <input type="text"
                           class="code-digit"
                           id="code-${i}"
                           maxlength="1"
                           autocomplete="off"
                           inputmode="text" />
                `).join('')}
            </div>
            <button class="btn btn-primary btn-lg" data-action="join-game" style="margin-top: 24px;">
                🔗 Dołącz
            </button>
        </div>
    `;
}

export function initLobbyEvents(app, params = {}) {
    let selectedCategories = [];

    // Tab switching
    document.querySelectorAll('.lobby-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            app.navigateTo('lobby', { tab: tabName });
        });
    });

    // Back button
    document.querySelector('[data-action="back"]')?.addEventListener('click', () => {
        app.navigateTo('menu');
    });

    // Game mode change
    const modeSelect = document.getElementById('game-mode');
    const customSection = document.getElementById('custom-categories-section');
    if (modeSelect) {
        modeSelect.addEventListener('change', () => {
            if (modeSelect.value === GAME_MODES.CUSTOM) {
                customSection?.classList.remove('hidden');
            } else {
                customSection?.classList.add('hidden');
            }
        });
    }

    // Category selection
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const catId = chip.dataset.catId;
            if (chip.classList.contains('selected')) {
                chip.classList.remove('selected');
                selectedCategories = selectedCategories.filter(id => id !== catId);
            } else if (selectedCategories.length < 7) {
                chip.classList.add('selected');
                selectedCategories.push(catId);
            } else {
                app.showToast('Możesz wybrać max 7 kategorii', 'warning');
            }
            const countEl = document.getElementById('selected-count');
            if (countEl) countEl.textContent = `Wybrano: ${selectedCategories.length}/7`;
        });
    });

    // Toggle
    const privateToggle = document.getElementById('private-toggle');
    if (privateToggle) {
        privateToggle.addEventListener('click', () => {
            const isActive = privateToggle.dataset.active === 'true';
            privateToggle.dataset.active = (!isActive).toString();
            privateToggle.classList.toggle('active');
        });
    }

    // Create game
    document.querySelector('[data-action="create-game"]')?.addEventListener('click', async () => {
        const mode = document.getElementById('game-mode')?.value || GAME_MODES.CLASSIC;
        const rounds = parseInt(document.getElementById('rounds-count')?.value || '10');
        const timePerRound = parseInt(document.getElementById('round-time')?.value || '30');
        const maxPlayers = parseInt(document.getElementById('max-players')?.value || '6');
        const scoring = document.getElementById('scoring-mode')?.value || SCORING_MODES.STANDARD;
        const isPrivate = privateToggle?.dataset.active === 'true';

        if (mode === GAME_MODES.CUSTOM && selectedCategories.length < 7) {
            app.showToast('Wybierz 7 kategorii!', 'warning');
            return;
        }

        const settings = {
            mode,
            rounds,
            timePerRound,
            maxPlayers,
            scoring,
            private: isPrivate,
            customCategories: mode === GAME_MODES.CUSTOM ? selectedCategories : null
        };

        app.showToast('Tworzę pokój...', 'info');
        await app.createGameRoom(settings);
    });

    // Join by code
    const codeDigits = document.querySelectorAll('.code-digit');
    codeDigits.forEach((digit, index) => {
        digit.addEventListener('input', (e) => {
            const val = e.target.value.toUpperCase();
            e.target.value = val;
            if (val && index < 5) {
                codeDigits[index + 1]?.focus();
            }
        });
        digit.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeDigits[index - 1]?.focus();
            }
        });
    });

    document.querySelector('[data-action="join-game"]')?.addEventListener('click', async () => {
        let code = '';
        codeDigits.forEach(d => code += d.value);
        if (code.length !== 6) {
            app.showToast('Wpisz 6-znakowy kod!', 'warning');
            return;
        }
        app.showToast('Dołączam...', 'info');
        await app.joinGameRoom(code);
    });

    // Load public rooms if on browse tab
    if (params.tab === 'browse') {
        app.loadPublicRooms();
    }
}

export function renderRoomList(rooms) {
    if (!rooms || rooms.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">😴</div>
                <p>Brak dostępnych pokojów</p>
                <p class="text-muted" style="font-size:0.875rem; margin-top:8px;">Stwórz własny pokój!</p>
            </div>
        `;
    }

    const modeInfo = GAME_MODE_INFO;

    return rooms.map(room => `
        <div class="room-card" data-room-id="${room.id}">
            <div class="room-card-info">
                <div class="room-card-name">${modeInfo[room.mode]?.icon || '🎮'} ${room.hostName}</div>
                <div class="room-card-meta">
                    <span>${modeInfo[room.mode]?.name || 'Klasyczny'}</span>
                    <span>${room.rounds} rund</span>
                    <span>${room.timePerRound}s</span>
                </div>
            </div>
            <div class="room-card-players">${room.players}/${room.maxPlayers}</div>
        </div>
    `).join('');
}
