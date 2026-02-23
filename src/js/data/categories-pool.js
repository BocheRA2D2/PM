// ============================================
// Category Pool — 30+ categories with metadata
// ============================================

export const CATEGORIES = [
    { id: 'panstwo', name: 'Państwo', icon: '🌍', type: 'countries' },
    { id: 'miasto', name: 'Miasto', icon: '🏙️', type: 'cities' },
    { id: 'imie', name: 'Imię', icon: '👤', type: 'names' },
    { id: 'zwierze', name: 'Zwierzę', icon: '🐾', type: 'animals' },
    { id: 'roslina', name: 'Roślina', icon: '🌿', type: 'plants' },
    { id: 'rzecz', name: 'Rzecz', icon: '📦', type: 'general' },
    { id: 'zawod', name: 'Zawód', icon: '👷', type: 'professions' },
    { id: 'jedzenie', name: 'Jedzenie', icon: '🍕', type: 'food' },
    { id: 'kolor', name: 'Kolor', icon: '🎨', type: 'colors' },
    { id: 'sport', name: 'Sport', icon: '⚽', type: 'sports' },
    { id: 'film', name: 'Film/Serial', icon: '🎬', type: 'general' },
    { id: 'piosenka', name: 'Piosenka', icon: '🎵', type: 'general' },
    { id: 'marka', name: 'Marka/Firma', icon: '🏷️', type: 'general' },
    { id: 'rzeka', name: 'Rzeka', icon: '🏞️', type: 'rivers' },
    { id: 'gora', name: 'Góra/Pasmo', icon: '⛰️', type: 'general' },
    { id: 'instrument', name: 'Instrument', icon: '🎸', type: 'general' },
    { id: 'ubior', name: 'Ubranie', icon: '👗', type: 'general' },
    { id: 'napoj', name: 'Napój', icon: '🥤', type: 'general' },
    { id: 'owoc', name: 'Owoc', icon: '🍎', type: 'fruits' },
    { id: 'warzywo', name: 'Warzywo', icon: '🥕', type: 'general' },
    { id: 'pojazd', name: 'Pojazd', icon: '🚗', type: 'general' },
    { id: 'kraj_eu', name: 'Kraj Europejski', icon: '🇪🇺', type: 'countries_eu' },
    { id: 'slawna_osoba', name: 'Sławna Osoba', icon: '⭐', type: 'general' },
    { id: 'przedmiot_szkolny', name: 'Przedmiot Szkolny', icon: '📚', type: 'general' },
    { id: 'czesc_ciala', name: 'Część Ciała', icon: '🦵', type: 'general' },
    { id: 'material', name: 'Materiał', icon: '🧱', type: 'general' },
    { id: 'narzedzie', name: 'Narzędzie', icon: '🔧', type: 'general' },
    { id: 'taniec', name: 'Taniec', icon: '💃', type: 'general' },
    { id: 'gra', name: 'Gra', icon: '🎮', type: 'general' },
    { id: 'choroba', name: 'Choroba', icon: '🏥', type: 'general' },
    { id: 'ksiazka', name: 'Książka', icon: '📖', type: 'general' },
    { id: 'kwiat', name: 'Kwiat', icon: '🌸', type: 'flowers' },
    { id: 'uczucie', name: 'Uczucie', icon: '💖', type: 'general' },
    { id: 'superbohater', name: 'Superbohater', icon: '🦸', type: 'general' },
];

export const CLASSIC_CATEGORIES = [
    'panstwo', 'miasto', 'imie', 'zwierze', 'roslina', 'rzecz', 'zawod'
];

export function getCategoryById(id) {
    return CATEGORIES.find(c => c.id === id);
}

export function getCategoriesByIds(ids) {
    return ids.map(id => getCategoryById(id)).filter(Boolean);
}

export function getRandomCategories(count = 7, exclude = []) {
    const available = CATEGORIES.filter(c => !exclude.includes(c.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}
