// ============================================
// Menu Screen
// ============================================

import { GAME_MODES, GAME_MODE_INFO } from '../engine/categories.js';

export function renderMenu(app) {
    const playerName = localStorage.getItem('pm_player_name') || '';

    return `
        <div class="screen menu-screen">
            <div class="menu-logo animate-fadeInDown">
                <span class="menu-logo-icon">🌍</span>
                <h1>Państwa<br>Miasta</h1>
                <p>Gra słowna online</p>
            </div>

            <div class="online-count animate-fadeIn delay-1">
                <span class="online-dot"></span>
                <span id="online-players">Tryb Offline</span>
            </div>

            <div class="menu-name-section animate-fadeInUp delay-2">
                <label class="input-label">Twoja nazwa</label>
                <div class="name-input-wrapper">
                    <input
                        type="text"
                        id="player-name-input"
                        class="input-field"
                        placeholder="Wpisz swoją nazwę..."
                        value="${playerName}"
                        maxlength="15"
                        autocomplete="off"
                    />
                </div>
            </div>

            <div class="menu-buttons">
                <button class="btn menu-btn menu-btn-primary animate-fadeInUp delay-3" data-action="quick-play">
                    <span class="btn-emoji">⚡</span>
                    <span class="btn-text">
                        Szybka Gra
                        <span class="btn-subtitle">Dołącz do losowego pokoju</span>
                    </span>
                </button>

                <button class="btn menu-btn menu-btn-secondary animate-fadeInUp delay-4" data-action="create-room">
                    <span class="btn-emoji">➕</span>
                    <span class="btn-text">
                        Stwórz Pokój
                        <span class="btn-subtitle">Zaproś znajomych</span>
                    </span>
                </button>

                <button class="btn menu-btn menu-btn-secondary animate-fadeInUp delay-5" data-action="join-room">
                    <span class="btn-emoji">🔗</span>
                    <span class="btn-text">
                        Dołącz po Kodzie
                        <span class="btn-subtitle">Wpisz kod pokoju</span>
                    </span>
                </button>

                <button class="btn menu-btn menu-btn-secondary animate-fadeInUp delay-6" data-action="offline-play">
                    <span class="btn-emoji">📱</span>
                    <span class="btn-text">
                        Gra Offline
                        <span class="btn-subtitle">Hot-seat na jednym urządzeniu</span>
                    </span>
                </button>
            </div>

            <div class="menu-footer animate-fadeIn delay-6">
                <p>v1.0.0 • Państwa-Miasta</p>
            </div>
        </div>
    `;
}

export function initMenuEvents(app) {
    const nameInput = document.getElementById('player-name-input');

    // Save name on change
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            localStorage.setItem('pm_player_name', e.target.value.trim());
        });
    }

    // Button actions
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = nameInput?.value?.trim();
            if (!name) {
                app.showToast('Wpisz swoją nazwę!', 'warning');
                nameInput?.focus();
                return;
            }

            const action = btn.dataset.action;
            switch (action) {
                case 'quick-play':
                    app.navigateTo('lobby', { tab: 'browse' });
                    break;
                case 'create-room':
                    app.navigateTo('lobby', { tab: 'create' });
                    break;
                case 'join-room':
                    app.navigateTo('lobby', { tab: 'join' });
                    break;
                case 'offline-play':
                    app.navigateTo('offline-setup');
                    break;
            }
        });
    });
}
