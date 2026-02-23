// ============================================
// Letter Randomization Engine
// ============================================

// Polish alphabet letters suitable for the game
// Excluded: Ą, Ć, Ę, Ń, Ó, Ś, Ź, Ż, Q, V, X (too difficult)
const AVAILABLE_LETTERS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'Ł', 'M', 'N', 'O', 'P', 'R', 'S', 'T',
    'U', 'W', 'Z'
];

export class LetterEngine {
    constructor() {
        this.usedLetters = [];
    }

    /**
     * Get a random letter that hasn't been used yet
     */
    getRandomLetter() {
        const available = AVAILABLE_LETTERS.filter(l => !this.usedLetters.includes(l));

        if (available.length === 0) {
            // All letters used, reset
            this.usedLetters = [];
            return this.getRandomLetter();
        }

        const letter = available[Math.floor(Math.random() * available.length)];
        this.usedLetters.push(letter);
        return letter;
    }

    /**
     * Reset used letters for a new game
     */
    reset() {
        this.usedLetters = [];
    }

    /**
     * Get all available letters
     */
    getAvailableLetters() {
        return AVAILABLE_LETTERS.filter(l => !this.usedLetters.includes(l));
    }

    /**
     * Get total available letter count
     */
    static getTotalLetters() {
        return AVAILABLE_LETTERS.length;
    }
}
