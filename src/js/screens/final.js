// ============================================
// Final Results Screen
// ============================================

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#14b8a6'];

export function renderFinal(app, totalScores, players) {
    const ranking = Object.entries(totalScores || {})
        .map(([playerId, score]) => ({
            playerId,
            score,
            name: players?.[playerId]?.name || 'Gracz'
        }))
        .sort((a, b) => b.score - a.score);

    const top3 = ranking.slice(0, 3);
    const rest = ranking.slice(3);

    // Reorder for podium: 2nd, 1st, 3rd
    const podiumOrder = top3.length >= 3
        ? [top3[1], top3[0], top3[2]]
        : top3.length === 2
            ? [top3[1], top3[0]]
            : [top3[0]];

    return `
        <div class="screen final-screen">
            <div class="confetti-container" id="confetti-container"></div>

            <div class="final-header animate-fadeInDown">
                <h1>🏆 Koniec Gry!</h1>
                <p>Gratulacje dla zwycięzcy!</p>
            </div>

            <div class="podium">
                ${podiumOrder.map((player, i) => {
        if (!player) return '';
        const actualPos = ranking.findIndex(r => r.playerId === player.playerId);
        const posClass = `podium-${actualPos === 0 ? '1st' : actualPos === 1 ? '2nd' : '3rd'}`;
        const medal = actualPos === 0 ? '🥇' : actualPos === 1 ? '🥈' : '🥉';
        const colorIndex = ranking.indexOf(player);

        return `
                        <div class="podium-place ${posClass} animate-fadeInUp" style="animation-delay:${(i + 1) * 0.3}s">
                            <span class="podium-medal">${medal}</span>
                            <div class="avatar podium-avatar" style="background:${AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]}">
                                ${player.name[0].toUpperCase()}
                            </div>
                            <span class="podium-name">${player.name}</span>
                            <div class="podium-block">
                                ${player.score}
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>

            ${rest.length > 0 ? `
                <div class="final-ranking animate-fadeInUp delay-4">
                    ${rest.map((player, i) => {
        const pos = i + 4;
        const colorIndex = ranking.indexOf(player);
        return `
                            <div class="final-rank-item" style="animation-delay:${0.5 + i * 0.1}s">
                                <div class="final-rank-pos">${pos}</div>
                                <div class="avatar" style="background:${AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]}; width:32px; height:32px; font-size:0.75rem;">
                                    ${player.name[0].toUpperCase()}
                                </div>
                                <span class="final-rank-name">${player.name}</span>
                                <span class="final-rank-score">${player.score}</span>
                            </div>
                        `;
    }).join('')}
                </div>
            ` : ''}

            <div class="final-actions animate-fadeInUp delay-5">
                <button class="btn btn-primary btn-lg btn-block" data-action="play-again">
                    🔄 Zagraj Ponownie
                </button>
                <button class="btn btn-secondary btn-block" data-action="back-to-menu">
                    🏠 Menu Główne
                </button>
            </div>
        </div>
    `;
}

export function initFinalEvents(app) {
    document.querySelector('[data-action="play-again"]')?.addEventListener('click', () => {
        app.playAgain();
    });

    document.querySelector('[data-action="back-to-menu"]')?.addEventListener('click', () => {
        app.navigateTo('menu');
    });

    // Launch confetti
    launchConfetti();
}

function launchConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#fbbf24'];

    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (2 + Math.random() * 3) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (6 + Math.random() * 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(piece);
    }

    // Clean up after animation
    setTimeout(() => container.innerHTML = '', 7000);
}
