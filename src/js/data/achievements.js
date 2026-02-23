// ============================================
// Achievement Definitions
// ============================================

export const ACHIEVEMENTS = [
    {
        id: 'perfect_round',
        name: 'Perfekcyjna Runda',
        description: 'Zdobądź punkty w każdej kategorii w jednej rundzie',
        icon: '⭐',
        condition: 'all_categories_scored'
    },
    {
        id: 'unique_100',
        name: '100 Unikalnych Słów',
        description: 'Podaj 100 unikalnych odpowiedzi (10 pkt)',
        icon: '💎',
        condition: 'unique_words_100'
    },
    {
        id: 'speed_demon',
        name: 'Szybki Gracz',
        description: 'Wyślij odpowiedzi w ciągu 10 sekund',
        icon: '⚡',
        condition: 'submit_under_10s'
    },
    {
        id: 'winning_streak',
        name: 'Seria Zwycięstw',
        description: 'Wygraj 5 gier z rzędu',
        icon: '🔥',
        condition: 'win_streak_5'
    },
    {
        id: 'vocabulary_master',
        name: 'Mistrz Słownictwa',
        description: 'Podaj 500 poprawnych odpowiedzi łącznie',
        icon: '📚',
        condition: 'total_correct_500'
    },
    {
        id: 'social_butterfly',
        name: 'Dusza Towarzystwa',
        description: 'Zagraj z 20 różnymi graczami',
        icon: '🦋',
        condition: 'unique_players_20'
    },
    {
        id: 'lone_wolf',
        name: 'Samotny Wilk',
        description: 'Zdobądź 15 pkt (jedyna odpowiedź) 10 razy',
        icon: '🐺',
        condition: 'sole_answer_10'
    },
    {
        id: 'marathon',
        name: 'Maratończyk',
        description: 'Zagraj 50 gier',
        icon: '🏃',
        condition: 'games_played_50'
    },
    {
        id: 'first_blood',
        name: 'Pierwsza Krew',
        description: 'Wygraj swoją pierwszą grę',
        icon: '🏆',
        condition: 'first_win'
    },
    {
        id: 'clean_sheet',
        name: 'Czyste Konto',
        description: 'Nie dostań ani jednego 0 pkt w całej grze',
        icon: '✨',
        condition: 'no_zero_scores'
    }
];

export function getAchievement(id) {
    return ACHIEVEMENTS.find(a => a.id === id);
}
