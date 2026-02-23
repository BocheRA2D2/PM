// ============================================
// Game Round Screen
// ============================================

export function renderGame(app, roundData, roomData) {
    const { letter, categories, categoryNames, roundNum, totalRounds, timePerRound } = roundData;
    const cats = categoryNames || categories || [];

    return `
        <div class="screen game-screen">
            <div class="game-topbar animate-fadeIn">
                <div class="game-round-info">
                    Runda <span>${roundNum}</span> / <span>${totalRounds}</span>
                </div>
                <div class="game-scores-mini" id="scores-mini"></div>
            </div>

            <div class="game-timer animate-scaleIn">
                <div class="timer-display" id="timer-display">${timePerRound}</div>
            </div>

            <div class="game-letter-container">
                <div class="game-letter" id="game-letter">${letter}</div>
                <div class="game-letter-label">Litera na tę rundę</div>
            </div>

            <div class="answer-form" id="answer-form">
                ${cats.map((catName, i) => {
        const catId = categories?.[i] || catName;
        return `
                    <div class="answer-row" style="animation-delay:${i * 0.05}s">
                        <div class="answer-category">${catName}</div>
                        <input type="text"
                               class="answer-input"
                               id="answer-${catId}"
                               data-category="${catId}"
                               placeholder="${letter}..."
                               autocomplete="off"
                               autocapitalize="words"
                               spellcheck="false" />
                    </div>
                    `;
    }).join('')}
            </div>

            <div class="game-submit-bar">
                <button class="btn btn-primary btn-lg" id="submit-answers-btn" data-action="submit-answers">
                    ✅ Wyślij odpowiedzi
                </button>
            </div>
        </div>
    `;
}

export function renderWaitingForResults() {
    return `
        <div class="screen">
            <div class="game-waiting animate-fadeIn">
                <div class="spinner"></div>
                <h3>Odpowiedzi wysłane!</h3>
                <p class="submitted-count" id="submitted-count">Czekam na innych graczy...</p>
            </div>
        </div>
    `;
}

export function renderCountdown(number) {
    return `
        <div class="countdown-overlay">
            <div class="countdown-number">${number}</div>
        </div>
    `;
}

export function initGameEvents(app) {
    // Submit answers
    document.querySelector('[data-action="submit-answers"]')?.addEventListener('click', () => {
        app.submitCurrentAnswers();
    });

    // Auto-focus first input
    const firstInput = document.querySelector('.answer-input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
    }

    // Enter key moves to next input
    document.querySelectorAll('.answer-input').forEach((input, index, inputs) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    app.submitCurrentAnswers();
                }
            }
        });
    });
}

/**
 * Update the timer display
 */
export function updateTimerDisplay(remaining, total) {
    const display = document.getElementById('timer-display');
    if (!display) return;

    display.textContent = remaining;

    // Remove previous state classes
    display.classList.remove('warning', 'danger');

    if (remaining <= total * 0.1) {
        display.classList.add('danger');
    } else if (remaining <= total * 0.25) {
        display.classList.add('warning');
    }
}

/**
 * Collect answers from input fields
 */
export function collectAnswers() {
    const answers = {};
    document.querySelectorAll('.answer-input').forEach(input => {
        const category = input.dataset.category;
        answers[category] = input.value.trim();
    });
    return answers;
}

/**
 * Disable input fields after submission
 */
export function disableInputs() {
    document.querySelectorAll('.answer-input').forEach(input => {
        input.disabled = true;
    });
    const submitBtn = document.getElementById('submit-answers-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '✓ Wysłano';
    }
}

/**
 * Show anti-cheat violation warning
 */
export function showCheatingWarning() {
    const el = document.createElement('div');
    el.className = 'anticheat-warning';
    el.innerHTML = `
        <h3>⚠️ Opuszczenie Aplikacji!</h3>
        <p>Twoja tura została zakończona. Otrzymujesz 0 punktów za tę rundę.</p>
        <button class="btn btn-secondary btn-sm mt-md" onclick="this.parentElement.remove()">OK</button>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
}
