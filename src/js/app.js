// ============================================
// Main App Controller
// ============================================

import { initFirebase, signIn, getCurrentUserId } from './firebase-config.js';
import { createRoom, joinRoom, leaveRoom, toggleReady, listenToRoom, getPublicRooms, startGame } from './multiplayer/rooms.js';
import { submitRoundData, submitAnswers, submitRoundScores, updateTotalScores, listenToGameState, advanceRound, allPlayersSubmitted, reportViolation } from './multiplayer/sync.js';
import { LetterEngine } from './engine/letter.js';
import { CategoryEngine, GAME_MODES } from './engine/categories.js';
import { GameTimer } from './engine/timer.js';
import { ScoringEngine, SCORING_MODES } from './engine/scoring.js';
import { AntiCheat } from './engine/anticheat.js';
import { validateWord, startsWithLetter } from './data/words.js';
import { getCategoriesByIds, getCategoryById } from './data/categories-pool.js';

import { renderMenu, initMenuEvents } from './screens/menu.js';
import { renderLobby, initLobbyEvents, renderRoomList } from './screens/lobby.js';
import { renderRoom, initRoomEvents } from './screens/room.js';
import { renderGame, initGameEvents, updateTimerDisplay, collectAnswers, disableInputs, renderWaitingForResults, showCheatingWarning, renderCountdown } from './screens/game.js';
import { renderResults, initResultsEvents } from './screens/results.js';
import { renderFinal, initFinalEvents } from './screens/final.js';

class PanstwaMiastaApp {
    constructor() {
        this.container = document.getElementById('screen-container');
        this.currentScreen = 'menu';
        this.roomId = null;
        this.roomData = null;
        this.roomListener = null;

        // Engine instances
        this.letterEngine = new LetterEngine();
        this.categoryEngine = null;
        this.timer = new GameTimer();
        this.scoringEngine = null;
        this.antiCheat = new AntiCheat();

        // Game state
        this.currentRound = 0;
        this.totalRounds = 10;
        this.timePerRound = 30;
        this.currentLetter = '';
        this.currentCategories = [];
        this.totalScores = {};
        this.submitted = false;
        this.isOffline = false;
        this.offlinePlayers = [];
        this.currentOfflinePlayer = 0;
        this.offlineAnswers = {};

        this.init();
    }

    async init() {
        // Try Firebase init
        const firebaseOk = initFirebase();
        if (firebaseOk) {
            try {
                await signIn();
            } catch (e) {
                console.warn('Firebase auth failed, offline mode');
            }
        }

        this.navigateTo('menu');
    }

    // ============ Navigation ============
    navigateTo(screen, params = {}) {
        // Cleanup
        this.timer.stop();
        if (screen !== 'room' && screen !== 'game' && screen !== 'results' && screen !== 'final') {
            this.stopRoomListener();
        }

        this.currentScreen = screen;
        let html = '';

        switch (screen) {
            case 'menu':
                html = renderMenu(this);
                break;
            case 'lobby':
                html = renderLobby(this, params);
                break;
            case 'room':
                html = renderRoom(this, this.roomData);
                break;
            case 'game':
                html = renderGame(this, params.roundData, this.roomData);
                break;
            case 'waiting':
                html = renderWaitingForResults();
                break;
            case 'results':
                html = renderResults(this, params.roundData, params.players, params.scores, params.categories, params.roundNum, params.totalRounds);
                break;
            case 'final':
                html = renderFinal(this, this.totalScores, params.players);
                break;
            case 'offline-setup':
                html = this.renderOfflineSetup();
                break;
            case 'offline-game':
                html = this.renderOfflineGame(params);
                break;
            default:
                html = renderMenu(this);
        }

        this.container.innerHTML = html;
        this.container.scrollTop = 0;

        // Init events after render
        requestAnimationFrame(() => {
            switch (screen) {
                case 'menu': initMenuEvents(this); break;
                case 'lobby': initLobbyEvents(this, params); break;
                case 'room': initRoomEvents(this, this.roomId); break;
                case 'game': initGameEvents(this); break;
                case 'results': initResultsEvents(this); break;
                case 'final': initFinalEvents(this); break;
                case 'offline-setup': this.initOfflineSetupEvents(); break;
                case 'offline-game': this.initOfflineGameEvents(); break;
            }
        });
    }

    // ============ Toast ============
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${message}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ============ Room Management ============
    async createGameRoom(settings) {
        try {
            const playerName = localStorage.getItem('pm_player_name') || 'Gracz';
            const result = await createRoom(settings, playerName);
            this.roomId = result.roomId;
            this.startRoomListener();
            this.showToast('Pokój utworzony! Kod: ' + result.code, 'success');
        } catch (e) {
            this.showToast('Błąd: ' + e.message, 'error');
        }
    }

    async joinGameRoom(code) {
        try {
            const playerName = localStorage.getItem('pm_player_name') || 'Gracz';
            const result = await joinRoom(code, playerName);
            this.roomId = result.roomId;
            this.startRoomListener();
            this.showToast('Dołączono do pokoju!', 'success');
        } catch (e) {
            this.showToast('Błąd: ' + e.message, 'error');
        }
    }

    async leaveCurrentRoom() {
        if (this.roomId) {
            try {
                await leaveRoom(this.roomId);
            } catch (e) {
                console.warn('Leave room error:', e);
            }
            this.stopRoomListener();
            this.roomId = null;
            this.roomData = null;
        }
        this.navigateTo('menu');
    }

    async togglePlayerReady() {
        if (this.roomId) {
            try {
                const ready = await toggleReady(this.roomId);
                this.showToast(ready ? 'Gotowy! ✓' : 'Nie gotowy', ready ? 'success' : 'info');
            } catch (e) {
                this.showToast('Błąd: ' + e.message, 'error');
            }
        }
    }

    isHost(roomData) {
        return roomData?.host === getCurrentUserId();
    }

    startRoomListener() {
        if (this.roomListener) this.roomListener();

        this.roomListener = listenToRoom(this.roomId, (data) => {
            if (!data) {
                // Room deleted
                this.roomId = null;
                this.roomData = null;
                this.showToast('Pokój został zamknięty', 'warning');
                this.navigateTo('menu');
                return;
            }

            this.roomData = data;

            if (data.state === 'waiting' && this.currentScreen !== 'room') {
                this.navigateTo('room');
            } else if (data.state === 'waiting' && this.currentScreen === 'room') {
                // Update room view
                this.container.innerHTML = renderRoom(this, data);
                initRoomEvents(this, this.roomId);
            } else if (data.state === 'playing') {
                this.handleGameState(data);
            } else if (data.state === 'finished') {
                this.handleGameFinished(data);
            }
        });
    }

    stopRoomListener() {
        if (this.roomListener) {
            // Firebase unsubscribe
            this.roomListener();
            this.roomListener = null;
        }
    }

    async loadPublicRooms() {
        try {
            const rooms = await getPublicRooms();
            const listEl = document.getElementById('room-list');
            if (listEl) {
                listEl.innerHTML = renderRoomList(rooms);
                // Add click handlers
                listEl.querySelectorAll('.room-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const roomId = card.dataset.roomId;
                        this.joinGameRoom(roomId);
                    });
                });
            }
        } catch (e) {
            const listEl = document.getElementById('room-list');
            if (listEl) {
                listEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Nie można załadować pokojów</p></div>`;
            }
        }
    }

    // ============ Game Flow ============
    async startCurrentGame() {
        if (!this.roomId || !this.roomData) return;

        const settings = this.roomData.settings || {};
        this.totalRounds = settings.rounds || 10;
        this.timePerRound = settings.timePerRound || 30;
        this.currentRound = 0;
        this.totalScores = {};

        // Init scoring engine
        this.scoringEngine = new ScoringEngine(settings.scoring || SCORING_MODES.STANDARD);

        // Init category engine
        this.categoryEngine = new CategoryEngine(settings.mode || GAME_MODES.CLASSIC);
        if (settings.customCategories) {
            this.categoryEngine.setCustomCategories(settings.customCategories);
        }

        // Reset letter engine
        this.letterEngine.reset();

        // Init total scores
        Object.keys(this.roomData.players || {}).forEach(pid => {
            this.totalScores[pid] = 0;
        });

        try {
            await startGame(this.roomId);
        } catch (e) {
            this.showToast('Błąd rozpoczęcia gry: ' + e.message, 'error');
        }
    }

    handleGameState(data) {
        const roundNum = data.currentRound || 1;
        const round = data.rounds?.[roundNum];

        if (!round && this.isHost(data)) {
            // Host generates round data
            this.generateAndSubmitRound(roundNum);
            return;
        }

        if (!round) {
            // Wait for host to generate
            return;
        }

        // Check if we already submitted this round
        const userId = getCurrentUserId();
        const answers = round.answers?.[userId];

        if (round.state === 'results') {
            // Show results
            if (this.currentScreen !== 'results') {
                const categories = round.categoryNames?.map((name, i) => ({ id: round.categories[i], name })) || [];
                this.navigateTo('results', {
                    roundData: round,
                    players: data.players,
                    scores: round.scores,
                    categories,
                    roundNum,
                    totalRounds: data.settings?.rounds || 10
                });
            }
        } else if (answers?.submitted) {
            if (this.currentScreen !== 'waiting') {
                this.navigateTo('waiting');
            }
            // Check if all submitted and we're host
            if (this.isHost(data) && allPlayersSubmitted(round.answers, data.players)) {
                this.calculateAndSubmitScores(roundNum, round, data);
            }
        } else if (this.currentScreen !== 'game') {
            // Show game screen
            this.showCountdownThenGame(roundNum, round, data);
        }
    }

    async generateAndSubmitRound(roundNum) {
        const letter = this.letterEngine.getRandomLetter();
        const categories = this.categoryEngine.getCategoriesForRound(roundNum);

        this.currentLetter = letter;
        this.currentCategories = categories;

        try {
            await submitRoundData(this.roomId, roundNum, letter, categories);
        } catch (e) {
            this.showToast('Błąd generowania rundy: ' + e.message, 'error');
        }
    }

    showCountdownThenGame(roundNum, round, data) {
        const settings = data.settings || {};

        // Show countdown 3, 2, 1
        let count = 3;
        this.container.innerHTML = renderCountdown(count);

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                this.container.innerHTML = renderCountdown(count);
            } else {
                clearInterval(countdownInterval);
                this.startRound(roundNum, round, data);
            }
        }, 800);
    }

    startRound(roundNum, round, data) {
        this.submitted = false;
        this.currentLetter = round.letter;
        this.currentCategories = round.categories?.map((id, i) => ({
            id,
            name: round.categoryNames?.[i] || id
        })) || [];

        const settings = data.settings || {};
        this.timePerRound = settings.timePerRound || 30;
        this.currentRound = roundNum;
        this.totalRounds = settings.rounds || 10;

        // Init scoring engine if not done
        if (!this.scoringEngine) {
            this.scoringEngine = new ScoringEngine(settings.scoring || SCORING_MODES.STANDARD);
        }

        // Navigate to game screen
        this.navigateTo('game', {
            roundData: {
                letter: round.letter,
                categories: round.categories,
                categoryNames: round.categoryNames,
                roundNum,
                totalRounds: this.totalRounds,
                timePerRound: this.timePerRound
            }
        });

        // Start anti-cheat
        this.antiCheat.startMonitoring(async (violation) => {
            showCheatingWarning();
            this.submitted = true;
            disableInputs();

            try {
                await reportViolation(this.roomId, roundNum);
                // Auto-submit empty answers
                await submitAnswers(this.roomId, roundNum, { cheated: true });
            } catch (e) {
                console.warn('Anti-cheat report error:', e);
            }
        });

        // Start timer
        this.timer.start(this.timePerRound, updateTimerDisplay, () => {
            // Auto-submit on timeout
            if (!this.submitted) {
                this.submitCurrentAnswers();
            }
        });
    }

    async submitCurrentAnswers() {
        if (this.submitted) return;
        this.submitted = true;

        const answers = collectAnswers();
        disableInputs();
        this.timer.stop();
        this.antiCheat.stopMonitoring();

        try {
            await submitAnswers(this.roomId, this.currentRound, answers);
            this.navigateTo('waiting');
        } catch (e) {
            this.showToast('Błąd wysyłania: ' + e.message, 'error');
        }
    }

    async calculateAndSubmitScores(roundNum, round, data) {
        const players = data.players || {};
        const answers = round.answers || {};
        const categories = round.categories?.map((id, i) => ({
            id,
            name: round.categoryNames?.[i] || id,
            type: getCategoryById(id)?.type || 'general'
        })) || [];

        // Validate words
        const validationResults = {};
        Object.entries(answers).forEach(([playerId, playerAnswers]) => {
            if (playerAnswers.cheated) {
                validationResults[playerId] = {};
                categories.forEach(cat => validationResults[playerId][cat.id] = false);
                return;
            }

            validationResults[playerId] = {};
            categories.forEach(cat => {
                const answer = playerAnswers[cat.id];
                if (!answer) {
                    validationResults[playerId][cat.id] = false;
                } else {
                    const valid = startsWithLetter(answer, round.letter);
                    validationResults[playerId][cat.id] = valid;
                }
            });
        });

        // Calculate scores
        if (!this.scoringEngine) {
            this.scoringEngine = new ScoringEngine(data.settings?.scoring || SCORING_MODES.STANDARD);
        }

        const scores = this.scoringEngine.calculateRoundScores(answers, categories, round.letter, validationResults);

        // Update total scores
        Object.entries(scores).forEach(([pid, playerScores]) => {
            if (!this.totalScores[pid]) this.totalScores[pid] = 0;
            this.totalScores[pid] += playerScores.total;
        });

        try {
            await submitRoundScores(this.roomId, roundNum, scores);
            await updateTotalScores(this.roomId, this.totalScores);
        } catch (e) {
            console.warn('Score submission error:', e);
        }
    }

    async proceedToNextRound() {
        const nextRound = this.currentRound + 1;

        if (nextRound > this.totalRounds) {
            this.handleGameFinished(this.roomData);
            return;
        }

        if (this.isHost(this.roomData)) {
            try {
                await advanceRound(this.roomId, nextRound, this.totalRounds);
            } catch (e) {
                this.showToast('Błąd: ' + e.message, 'error');
            }
        }
    }

    handleGameFinished(data) {
        this.timer.stop();
        this.antiCheat.stopMonitoring();

        if (this.currentScreen !== 'final') {
            this.totalScores = data.totalScores || this.totalScores;
            this.navigateTo('final', { players: data.players });
        }
    }

    async playAgain() {
        // Reset and go back to room
        this.currentRound = 0;
        this.totalScores = {};
        this.letterEngine.reset();
        this.submitted = false;

        if (this.roomId) {
            this.navigateTo('room');
        } else {
            this.navigateTo('menu');
        }
    }

    // ============ Offline Mode ============
    renderOfflineSetup() {
        const savedPlayers = JSON.parse(localStorage.getItem('pm_offline_players') || '["Gracz 1", "Gracz 2"]');

        return `
            <div class="screen lobby-screen">
                <div class="lobby-header animate-fadeIn">
                    <button class="lobby-back-btn" data-action="back">←</button>
                    <h2>Gra Offline</h2>
                    <div style="width:40px"></div>
                </div>

                <div class="create-room-form animate-fadeInUp">
                    <div class="form-group">
                        <label>👥 Gracze (wpisz nazwy, oddziel enterem)</label>
                        <textarea id="offline-players" class="input-field" rows="4" style="resize:none"
                                  placeholder="Gracz 1&#10;Gracz 2&#10;Gracz 3">${savedPlayers.join('\n')}</textarea>
                    </div>

                    <div class="form-group">
                        <label>🔄 Liczba rund</label>
                        <select id="offline-rounds" class="select-field">
                            <option value="5">5 rund</option>
                            <option value="10" selected>10 rund</option>
                            <option value="15">15 rund</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>⏱️ Czas na rundę</label>
                        <select id="offline-time" class="select-field">
                            <option value="30" selected>30 sekund</option>
                            <option value="40">40 sekund</option>
                            <option value="60">60 sekund</option>
                        </select>
                    </div>

                    <button class="btn btn-primary btn-lg btn-block" data-action="start-offline">
                        🚀 Rozpocznij Grę
                    </button>
                </div>
            </div>
        `;
    }

    initOfflineSetupEvents() {
        document.querySelector('[data-action="back"]')?.addEventListener('click', () => {
            this.navigateTo('menu');
        });

        document.querySelector('[data-action="start-offline"]')?.addEventListener('click', () => {
            const textarea = document.getElementById('offline-players');
            const players = textarea.value.split('\n').map(n => n.trim()).filter(n => n.length > 0);

            if (players.length < 2) {
                this.showToast('Minimum 2 graczy!', 'warning');
                return;
            }

            if (players.length > 8) {
                this.showToast('Maximum 8 graczy!', 'warning');
                return;
            }

            localStorage.setItem('pm_offline_players', JSON.stringify(players));

            this.isOffline = true;
            this.offlinePlayers = players;
            this.totalRounds = parseInt(document.getElementById('offline-rounds')?.value || '10');
            this.timePerRound = parseInt(document.getElementById('offline-time')?.value || '30');
            this.currentRound = 1;
            this.totalScores = {};
            this.offlineAnswers = {};
            this.letterEngine.reset();
            this.categoryEngine = new CategoryEngine(GAME_MODES.CLASSIC);
            this.scoringEngine = new ScoringEngine(SCORING_MODES.STANDARD);

            players.forEach(name => {
                this.totalScores[name] = 0;
            });

            this.startOfflineRound();
        });
    }

    startOfflineRound() {
        this.currentLetter = this.letterEngine.getRandomLetter();
        this.currentCategories = this.categoryEngine.getCategoriesForRound(this.currentRound);
        this.currentOfflinePlayer = 0;
        this.offlineAnswers = {};

        this.showOfflinePlayerTurn();
    }

    showOfflinePlayerTurn() {
        const playerName = this.offlinePlayers[this.currentOfflinePlayer];

        this.container.innerHTML = `
            <div class="screen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:100%;">
                <h2 class="animate-fadeInDown">Tura gracza</h2>
                <h1 class="animate-scaleIn" style="font-size:2rem;margin:16px 0;background:var(--accent-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${playerName}</h1>
                <p class="text-muted animate-fadeIn delay-2">Podaj telefon graczowi <strong>${playerName}</strong></p>
                <p class="text-muted animate-fadeIn delay-3" style="margin-top:8px;">Runda ${this.currentRound}/${this.totalRounds}</p>
                <button class="btn btn-primary btn-lg mt-xl animate-fadeInUp delay-4" data-action="show-offline-inputs">
                    👁️ Pokaż planszę
                </button>
            </div>
        `;

        document.querySelector('[data-action="show-offline-inputs"]')?.addEventListener('click', () => {
            this.navigateTo('offline-game', {
                letter: this.currentLetter,
                categories: this.currentCategories,
                playerName,
                roundNum: this.currentRound
            });
        });
    }

    renderOfflineGame(params) {
        const { letter, categories, playerName, roundNum } = params;

        return `
            <div class="screen game-screen">
                <div class="game-topbar animate-fadeIn">
                    <div class="game-round-info">
                        <span style="color:var(--accent-primary)">${playerName}</span> • Runda <span>${roundNum}</span>/<span>${this.totalRounds}</span>
                    </div>
                </div>

                <div class="game-timer animate-scaleIn">
                    <div class="timer-display" id="timer-display">${this.timePerRound}</div>
                </div>

                <div class="game-letter-container">
                    <div class="game-letter" id="game-letter">${letter}</div>
                    <div class="game-letter-label">Litera na tę rundę</div>
                </div>

                <div class="answer-form" id="answer-form">
                    ${categories.map((cat, i) => `
                        <div class="answer-row" style="animation-delay:${i * 0.05}s">
                            <div class="answer-category">${cat.name}</div>
                            <input type="text"
                                   class="answer-input"
                                   id="answer-${cat.id}"
                                   data-category="${cat.id}"
                                   placeholder="${letter}..."
                                   autocomplete="off"
                                   autocapitalize="words"
                                   spellcheck="false" />
                        </div>
                    `).join('')}
                </div>

                <div class="game-submit-bar">
                    <button class="btn btn-primary btn-lg" id="submit-answers-btn" data-action="submit-offline">
                        ✅ Wyślij odpowiedzi
                    </button>
                </div>
            </div>
        `;
    }

    initOfflineGameEvents() {
        this.submitted = false;

        // Auto-focus
        const firstInput = document.querySelector('.answer-input');
        if (firstInput) setTimeout(() => firstInput.focus(), 300);

        // Enter navigation
        document.querySelectorAll('.answer-input').forEach((input, index, inputs) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (index < inputs.length - 1) inputs[index + 1].focus();
                    else this.submitOfflineAnswers();
                }
            });
        });

        // Submit
        document.querySelector('[data-action="submit-offline"]')?.addEventListener('click', () => {
            this.submitOfflineAnswers();
        });

        // Start timer
        this.timer.start(this.timePerRound, updateTimerDisplay, () => {
            if (!this.submitted) this.submitOfflineAnswers();
        });
    }

    submitOfflineAnswers() {
        if (this.submitted) return;
        this.submitted = true;

        const answers = collectAnswers();
        const playerName = this.offlinePlayers[this.currentOfflinePlayer];
        this.offlineAnswers[playerName] = answers;

        disableInputs();
        this.timer.stop();

        this.currentOfflinePlayer++;

        if (this.currentOfflinePlayer < this.offlinePlayers.length) {
            // Next player
            setTimeout(() => this.showOfflinePlayerTurn(), 500);
        } else {
            // All players done - calculate scores
            this.calculateOfflineScores();
        }
    }

    calculateOfflineScores() {
        const categories = this.currentCategories;
        const letter = this.currentLetter;

        // Build validation
        const validationResults = {};
        Object.entries(this.offlineAnswers).forEach(([playerName, answers]) => {
            validationResults[playerName] = {};
            categories.forEach(cat => {
                const answer = answers[cat.id];
                validationResults[playerName][cat.id] = answer ? startsWithLetter(answer, letter) : false;
            });
        });

        const scores = this.scoringEngine.calculateRoundScores(this.offlineAnswers, categories, letter, validationResults);

        // Update totals
        Object.entries(scores).forEach(([name, s]) => {
            this.totalScores[name] = (this.totalScores[name] || 0) + s.total;
        });

        // Build players object
        const players = {};
        this.offlinePlayers.forEach(name => {
            players[name] = { name };
        });

        // Show results
        const roundData = {
            letter,
            answers: this.offlineAnswers
        };

        const categoriesForResults = categories.map(c => ({ id: c.id, name: c.name }));

        this.navigateTo('results', {
            roundData,
            players,
            scores,
            categories: categoriesForResults,
            roundNum: this.currentRound,
            totalRounds: this.totalRounds
        });

        // Override next round behavior for offline
        setTimeout(() => {
            const nextBtn = document.querySelector('[data-action="next-round"]');
            if (nextBtn) {
                nextBtn.removeEventListener('click', () => { });
                nextBtn.addEventListener('click', () => {
                    this.currentRound++;
                    if (this.currentRound > this.totalRounds) {
                        const playersObj = {};
                        this.offlinePlayers.forEach(name => { playersObj[name] = { name }; });
                        this.navigateTo('final', { players: playersObj });
                    } else {
                        this.startOfflineRound();
                    }
                });
            }
        }, 100);
    }
}

// ============ App Init ============
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PanstwaMiastaApp();
});
