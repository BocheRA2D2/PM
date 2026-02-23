// ============================================
// Results Screen (Round & Final)
// ============================================

import { ScoringEngine } from '../engine/scoring.js';

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#14b8a6'];

export function renderResults(app, roundData, players, scores, categories, roundNum, totalRounds) {
    const playerEntries = Object.entries(players || {});

    return `
        <div class="screen results-screen animate-fadeIn">
            <div class="results-header">
                <h2>Wyniki Rundy ${roundNum}</h2>
                <p class="results-round-info">Litera: <strong>${roundData?.letter || '?'}</strong> • Runda ${roundNum}/${totalRounds}</p>
            </div>

            <div class="results-table-wrapper">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Gracz</th>
                            ${(categories || []).map(cat => `<th>${typeof cat === 'string' ? cat : cat.name}</th>`).join('')}
                            <th>Suma</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${playerEntries.map(([playerId, player], index) => {
        const playerScores = scores?.[playerId] || {};
        const answers = roundData?.answers?.[playerId] || {};

        return `
                                <tr>
                                    <td>
                                        <div class="result-player-name">
                                            <div class="avatar" style="background:${AVATAR_COLORS[index % AVATAR_COLORS.length]}; width:28px; height:28px; font-size:0.7rem;">
                                                ${(player.name || '?')[0].toUpperCase()}
                                            </div>
                                            ${player.name || 'Gracz'}
                                        </div>
                                    </td>
                                    ${(categories || []).map(cat => {
            const catId = typeof cat === 'string' ? cat : cat.id;
            const catName = typeof cat === 'string' ? cat : cat.name;
            const answer = answers[catId] || '';
            const pts = playerScores[catId] ?? 0;
            const scoreClass = ScoringEngine.getScoreClass(pts);

            return `
                                            <td>
                                                <div class="answer-cell">
                                                    <span class="answer-text" title="${answer}">${answer || '—'}</span>
                                                    <span class="answer-score ${scoreClass}">${pts}</span>
                                                </div>
                                            </td>
                                        `;
        }).join('')}
                                    <td>
                                        <span class="result-total">${playerScores.total || 0}</span>
                                    </td>
                                </tr>
                            `;
    }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="results-actions">
                <button class="btn btn-primary btn-lg btn-block" data-action="next-round">
                    ${roundNum >= totalRounds ? '🏆 Pokaż Wyniki Końcowe' : '➡️ Następna Runda'}
                </button>
            </div>
        </div>
    `;
}

export function initResultsEvents(app) {
    document.querySelector('[data-action="next-round"]')?.addEventListener('click', () => {
        app.proceedToNextRound();
    });
}
