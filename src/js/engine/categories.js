// ============================================
// Category Management Engine
// ============================================

import { CATEGORIES, CLASSIC_CATEGORIES, getRandomCategories, getCategoriesByIds } from '../data/categories-pool.js';

export const GAME_MODES = {
    CLASSIC: 'classic',
    CUSTOM: 'custom',
    PLAYER_CREATED: 'player_created',
    SINGLE_CATEGORY: 'single_category',
    FULL_RANDOM: 'full_random'
};

export const GAME_MODE_INFO = {
    [GAME_MODES.CLASSIC]: {
        name: 'Klasyczny',
        description: '7 stałych kategorii',
        icon: '📋',
        categoryCount: 7
    },
    [GAME_MODES.CUSTOM]: {
        name: 'Własny Zestaw',
        description: 'Wybierz 7 z 30+ kategorii',
        icon: '🎯',
        categoryCount: 7
    },
    [GAME_MODES.PLAYER_CREATED]: {
        name: 'Kategorie Graczy',
        description: 'Każdy gracz podaje 2 kategorie',
        icon: '✏️',
        categoryCount: null // dynamic
    },
    [GAME_MODES.SINGLE_CATEGORY]: {
        name: 'Jedna Kategoria',
        description: '1 losowa kategoria na rundę',
        icon: '🎲',
        categoryCount: 1
    },
    [GAME_MODES.FULL_RANDOM]: {
        name: 'Pełny Los',
        description: 'Losowe kategorie i litera',
        icon: '🎰',
        categoryCount: null // 5-9 random
    }
};

export class CategoryEngine {
    constructor(mode = GAME_MODES.CLASSIC) {
        this.mode = mode;
        this.selectedCategories = [];
        this.playerCategories = {};
        this.presets = this.loadPresets();
    }

    /**
     * Get categories for a round based on game mode
     */
    getCategoriesForRound(roundNumber = 1) {
        switch (this.mode) {
            case GAME_MODES.CLASSIC:
                return getCategoriesByIds(CLASSIC_CATEGORIES);

            case GAME_MODES.CUSTOM:
                return getCategoriesByIds(this.selectedCategories);

            case GAME_MODES.PLAYER_CREATED:
                // Collect all player categories, pick 7
                const allPlayerCats = Object.values(this.playerCategories).flat();
                if (allPlayerCats.length <= 7) {
                    return getCategoriesByIds(allPlayerCats);
                }
                // Random 7 from player pool
                const shuffled = [...allPlayerCats].sort(() => Math.random() - 0.5);
                return getCategoriesByIds(shuffled.slice(0, 7));

            case GAME_MODES.SINGLE_CATEGORY:
                const randomCats = getRandomCategories(1);
                return randomCats;

            case GAME_MODES.FULL_RANDOM:
                const count = Math.floor(Math.random() * 5) + 5; // 5-9
                return getRandomCategories(count);

            default:
                return getCategoriesByIds(CLASSIC_CATEGORIES);
        }
    }

    /**
     * Set custom categories (for CUSTOM mode)
     */
    setCustomCategories(categoryIds) {
        this.selectedCategories = categoryIds.slice(0, 7);
    }

    /**
     * Add player categories (for PLAYER_CREATED mode)
     */
    setPlayerCategories(playerId, categoryIds) {
        this.playerCategories[playerId] = categoryIds.slice(0, 2);
    }

    /**
     * Save a preset
     */
    savePreset(name, categoryIds) {
        this.presets[name] = categoryIds;
        localStorage.setItem('pm_category_presets', JSON.stringify(this.presets));
    }

    /**
     * Load presets from localStorage
     */
    loadPresets() {
        try {
            return JSON.parse(localStorage.getItem('pm_category_presets') || '{}');
        } catch {
            return {};
        }
    }

    /**
     * Delete a preset
     */
    deletePreset(name) {
        delete this.presets[name];
        localStorage.setItem('pm_category_presets', JSON.stringify(this.presets));
    }

    /**
     * Get all available categories
     */
    static getAllCategories() {
        return CATEGORIES;
    }
}
