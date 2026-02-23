// ============================================
// Polish Word Database for validation
// ============================================

const WORDS = {
    countries: [
        'Afganistan', 'Albania', 'Algieria', 'Andora', 'Angola', 'Argentyna', 'Armenia', 'Australia',
        'Austria', 'Azerbejdżan', 'Bahamy', 'Bahrajn', 'Bangladesz', 'Barbados', 'Belgia', 'Belize',
        'Benin', 'Bhutan', 'Białoruś', 'Birma', 'Boliwia', 'Bośnia', 'Botswana', 'Brazylia', 'Brunei',
        'Bułgaria', 'Burkina', 'Burundi', 'Chile', 'Chiny', 'Chorwacja', 'Cypr', 'Czad', 'Czarnogóra',
        'Czechy', 'Dania', 'Dominika', 'Dominikana', 'Dżibuti', 'Egipt', 'Ekwador', 'Erytrea', 'Estonia',
        'Eswatini', 'Etiopia', 'Fidżi', 'Filipiny', 'Finlandia', 'Francja', 'Gabon', 'Gambia', 'Ghana',
        'Grecja', 'Grenada', 'Gruzja', 'Gwatemala', 'Gwinea', 'Haiti', 'Hiszpania', 'Holandia', 'Honduras',
        'Indie', 'Indonezja', 'Irak', 'Iran', 'Irlandia', 'Islandia', 'Izrael', 'Jamajka', 'Japonia',
        'Jemen', 'Jordania', 'Kambodża', 'Kamerun', 'Kanada', 'Katar', 'Kazachstan', 'Kenia', 'Kirgistan',
        'Kiribati', 'Kolumbia', 'Komory', 'Kongo', 'Korea', 'Kostaryka', 'Kuba', 'Kuwejt', 'Laos', 'Lesotho',
        'Liban', 'Liberia', 'Libia', 'Liechtenstein', 'Litwa', 'Luksemburg', 'Łotwa', 'Macedonia', 'Madagaskar',
        'Malawi', 'Malediwy', 'Malezja', 'Mali', 'Malta', 'Maroko', 'Mauretania', 'Mauritius', 'Meksyk',
        'Mikronezja', 'Mołdawia', 'Monako', 'Mongolia', 'Mozambik', 'Namibia', 'Nauru', 'Nepal', 'Niemcy',
        'Niger', 'Nigeria', 'Nikaragua', 'Norwegia', 'Nowa Zelandia', 'Oman', 'Pakistan', 'Palau', 'Panama',
        'Papua', 'Paragwaj', 'Peru', 'Polska', 'Portugalia', 'Rosja', 'Rumunia', 'Rwanda', 'Salwador',
        'Samoa', 'Senegal', 'Serbia', 'Seszele', 'Sierra Leone', 'Singapur', 'Słowacja', 'Słowenia',
        'Somalia', 'Sri Lanka', 'Sudan', 'Surinam', 'Syria', 'Szwajcaria', 'Szwecja', 'Tadżykistan',
        'Tajlandia', 'Tanzania', 'Togo', 'Tonga', 'Trynidad', 'Tunezja', 'Turcja', 'Turkmenistan', 'Tuvalu',
        'Uganda', 'Ukraina', 'Urugwaj', 'Uzbekistan', 'Vanuatu', 'Watykan', 'Wenezuela', 'Węgry', 'Wietnam',
        'Włochy', 'Wybrzeże Kości Słoniowej', 'Zambia', 'Zimbabwe', 'Zjednoczone Emiraty Arabskie'
    ],

    countries_eu: [
        'Austria', 'Belgia', 'Bułgaria', 'Chorwacja', 'Cypr', 'Czechy', 'Dania', 'Estonia', 'Finlandia',
        'Francja', 'Grecja', 'Hiszpania', 'Holandia', 'Irlandia', 'Litwa', 'Luksemburg', 'Łotwa', 'Malta',
        'Niemcy', 'Polska', 'Portugalia', 'Rumunia', 'Słowacja', 'Słowenia', 'Szwecja', 'Węgry', 'Włochy'
    ],

    cities: [
        'Augustów', 'Amsterdam', 'Ateny', 'Barcelona', 'Berlin', 'Białystok', 'Bielsko-Biała', 'Bochnia',
        'Bogota', 'Bolonia', 'Boston', 'Bratysława', 'Brno', 'Bruksela', 'Bukareszt', 'Bydgoszcz',
        'Bytom', 'Chełm', 'Chorzów', 'Cieszyn', 'Częstochowa', 'Dallas', 'Dąbrowa Górnicza', 'Dublin',
        'Działdowo', 'Elbląg', 'Florencja', 'Frankfurt', 'Gdańsk', 'Gdynia', 'Genewa', 'Gliwice', 'Gniezno',
        'Gorzów', 'Grudziądz', 'Hajnówka', 'Hamburg', 'Inowrocław', 'Istanbul', 'Jasło', 'Jelenia Góra',
        'Kalisz', 'Katowice', 'Kielce', 'Kłodzko', 'Knurów', 'Kołobrzeg', 'Konin', 'Kopenhaga', 'Koszalin',
        'Kraków', 'Krosno', 'Kutno', 'Legnica', 'Leszno', 'Limanowa', 'Lipsk', 'Londyn', 'Lublin', 'Lwów',
        'Łomża', 'Łowicz', 'Łódź', 'Madryt', 'Malbork', 'Manchester', 'Mediolan', 'Mielec', 'Mińsk',
        'Moskwa', 'Mrągowo', 'Myślenice', 'Nowy Jork', 'Nowy Sącz', 'Nowy Targ', 'Nysa', 'Oleśnica',
        'Olkusz', 'Olsztyn', 'Opole', 'Ostrołęka', 'Ostrów', 'Oświęcim', 'Pabianice', 'Paryż', 'Piła',
        'Piotrków', 'Płock', 'Poznań', 'Praga', 'Przemyśl', 'Puławy', 'Radom', 'Radomsko', 'Rawicz',
        'Reda', 'Reszel', 'Ruda', 'Rybnik', 'Rzeszów', 'Sanok', 'Siedlce', 'Siemianowice', 'Skierniewice',
        'Słupsk', 'Sosnowiec', 'Stalowa Wola', 'Starachowice', 'Stargard', 'Szczecin', 'Szczecinek',
        'Sztokholm', 'Świdnica', 'Świdnik', 'Świnoujście', 'Tarnobrzeg', 'Tarnów', 'Tczew', 'Toruń',
        'Turek', 'Tychy', 'Ustka', 'Ustroń', 'Wałbrzych', 'Warszawa', 'Wiedeń', 'Włocławek', 'Wołomin',
        'Wrocław', 'Zabrze', 'Zakopane', 'Zamość', 'Zgorzelec', 'Zielona Góra', 'Żory', 'Żywiec'
    ],

    names: [
        'Adam', 'Adrian', 'Agata', 'Agnieszka', 'Alicja', 'Amelia', 'Andrzej', 'Anna', 'Antoni', 'Arkadiusz',
        'Artur', 'Barbara', 'Bartłomiej', 'Bartosz', 'Beata', 'Bogdan', 'Borys', 'Bożena', 'Celina', 'Cezary',
        'Dagmara', 'Daniel', 'Dariusz', 'Dawid', 'Diana', 'Dominik', 'Dominika', 'Dorota', 'Edward', 'Elżbieta',
        'Emil', 'Emilia', 'Ernest', 'Eugeniusz', 'Ewa', 'Ewelina', 'Fabian', 'Filip', 'Franciszek', 'Gabriela',
        'Grzegorz', 'Halina', 'Hanna', 'Helena', 'Henryk', 'Hubert', 'Ignacy', 'Igor', 'Ilona', 'Irena',
        'Ireneusz', 'Iwona', 'Izabela', 'Jacek', 'Jadwiga', 'Jakub', 'Jan', 'Janina', 'Janusz', 'Jarosław',
        'Jerzy', 'Joanna', 'Jolanta', 'Julia', 'Julian', 'Juliusz', 'Justyna', 'Kacper', 'Kamil', 'Kamila',
        'Karol', 'Karolina', 'Katarzyna', 'Kazimierz', 'Klaudia', 'Konrad', 'Krystian', 'Krystyna',
        'Krzysztof', 'Laura', 'Leon', 'Leonard', 'Leszek', 'Lidia', 'Lucjan', 'Lucyna', 'Łukasz', 'Maciej',
        'Magdalena', 'Maja', 'Małgorzata', 'Marcel', 'Marcin', 'Marek', 'Maria', 'Marianna', 'Marian',
        'Mariusz', 'Marlena', 'Marta', 'Martyna', 'Mateusz', 'Michał', 'Mieczysław', 'Mikołaj', 'Milena',
        'Mirosław', 'Monika', 'Natalia', 'Natasza', 'Nikodem', 'Nina', 'Norbert', 'Oliwia', 'Olga', 'Oscar',
        'Patrycja', 'Patryk', 'Paulina', 'Paweł', 'Piotr', 'Przemysław', 'Radosław', 'Rafał', 'Regina',
        'Renata', 'Robert', 'Roman', 'Ryszard', 'Sandra', 'Sebastian', 'Sławomir', 'Stanisław', 'Stefan',
        'Sylwia', 'Szymon', 'Tadeusz', 'Teresa', 'Tomasz', 'Urszula', 'Wanda', 'Weronika', 'Wiktor',
        'Wiktoria', 'Witold', 'Władysław', 'Włodzimierz', 'Wojciech', 'Zbigniew', 'Zenon', 'Zofia', 'Zuzanna'
    ],

    animals: [
        'Antylopa', 'Bóbr', 'Borsuk', 'Bażant', 'Bizon', 'Chomik', 'Czapla', 'Delfin', 'Dzik', 'Dzięcioł',
        'Foka', 'Flaming', 'Gęś', 'Gepard', 'Gołąb', 'Goryl', 'Hiena', 'Hipopotam', 'Iguana', 'Indyk',
        'Jeleń', 'Jaskółka', 'Jaszczurka', 'Jeż', 'Jaguár', 'Kangur', 'Karp', 'Kaczka', 'Kobra', 'Kogut',
        'Koliber', 'Koń', 'Koza', 'Kret', 'Krokodyl', 'Królik', 'Kruk', 'Krowa', 'Kura', 'Kukułka',
        'Lampart', 'Lama', 'Lew', 'Lis', 'Łabędź', 'Łoś', 'Małpa', 'Manul', 'Mewa', 'Morświn',
        'Mors', 'Motyl', 'Mrówka', 'Mysz', 'Muł', 'Niedźwiedź', 'Norka', 'Nutria', 'Nosorożec', 'Okoń',
        'Orzeł', 'Osioł', 'Owca', 'Panda', 'Papuga', 'Paw', 'Pelikan', 'Pingwin', 'Pies', 'Pszczoła',
        'Pstrąg', 'Puma', 'Pytón', 'Rekin', 'Renifer', 'Ryś', 'Ropucha', 'Sarna', 'Sęp', 'Sikora',
        'Skorpion', 'Słoń', 'Sowa', 'Struś', 'Sum', 'Szop', 'Szczur', 'Szczupak', 'Świnka', 'Tukan',
        'Tygrys', 'Wąż', 'Wieloryb', 'Wilk', 'Wielbłąd', 'Wiewiórka', 'Wrona', 'Wydra', 'Żaba', 'Żbik',
        'Żmija', 'Żółw', 'Żubr', 'Żyrafa'
    ],

    plants: [
        'Akacja', 'Aloes', 'Azalia', 'Bambus', 'Baobab', 'Bluszcz', 'Brzoza', 'Bukszpan', 'Chryzantema',
        'Cynamon', 'Dąb', 'Fiołek', 'Geranium', 'Goździk', 'Grab', 'Grusza', 'Hibiskus', 'Hortensja',
        'Irys', 'Jabłoń', 'Jaśmin', 'Jemioła', 'Jodła', 'Kaktus', 'Kalina', 'Kameila', 'Klon', 'Konwalia',
        'Kukurydza', 'Lilia', 'Lipa', 'Lawenda', 'Magnolia', 'Mak', 'Malina', 'Mięta', 'Modrzew', 'Narcyz',
        'Olcha', 'Orchidea', 'Paproć', 'Petunia', 'Piwonia', 'Pszenica', 'Róża', 'Rzepak', 'Sosna',
        'Słonecznik', 'Storczyk', 'Świerk', 'Topola', 'Trawa', 'Tulipan', 'Wierzba', 'Wiśnia', 'Żonkil'
    ],

    professions: [
        'Adwokat', 'Aktor', 'Aptekarz', 'Archeolog', 'Architekt', 'Artysta', 'Astronauta', 'Bibliotekarz',
        'Biolog', 'Blacharz', 'Brukarz', 'Budowlaniec', 'Chirurg', 'Cieśla', 'Cukiernik', 'Dekarz',
        'Dentysta', 'Detektyw', 'Dietetyk', 'Drukarz', 'Dziennikarz', 'Ekonomista', 'Elektryk', 'Farmaceuta',
        'Fizyk', 'Fotograf', 'Fryzjer', 'Geolog', 'Górnik', 'Grafik', 'Hydraulik', 'Informatyk', 'Inżynier',
        'Jubiler', 'Kasjer', 'Kelner', 'Kierowca', 'Komornik', 'Krawiec', 'Księgowy', 'Kucharz', 'Lekarz',
        'Listonosz', 'Logistyk', 'Lotnik', 'Makler', 'Malarz', 'Marynarz', 'Maszynista', 'Mechanik',
        'Meteorolog', 'Monter', 'Murarz', 'Muzyk', 'Nauczyciel', 'Notariusz', 'Ogrodnik', 'Optyk',
        'Paleontolog', 'Piekarz', 'Pielęgniarka', 'Pilot', 'Pisarz', 'Pływak', 'Policjant', 'Polityk',
        'Położna', 'Prawnik', 'Programista', 'Psycholog', 'Ratownik', 'Redaktor', 'Reżyser', 'Rolnik',
        'Rzeźbiarz', 'Sędzia', 'Ślusarz', 'Socjolog', 'Stolarz', 'Strażak', 'Szewc', 'Taksówkarz',
        'Tłumacz', 'Tokarz', 'Trener', 'Urbanista', 'Weterynarz', 'Wokalista', 'Żołnierz', 'Zoolog'
    ],

    food: [
        'Ananas', 'Banan', 'Barszcz', 'Bigos', 'Biszkopty', 'Brokuły', 'Budyń', 'Bułka', 'Burrito',
        'Chleb', 'Ciasto', 'Ciastko', 'Curry', 'Czekolada', 'Denka', 'Drożdżówka', 'Frytki', 'Galaretka',
        'Gołąbki', 'Grillowane', 'Gulasz', 'Hamburger', 'Herbatnik', 'Hot-dog', 'Indyk', 'Jabłko', 'Jagody',
        'Jajecznica', 'Jogurt', 'Kabanos', 'Kapusta', 'Kasza', 'Kebab', 'Keks', 'Kiełbasa', 'Kisiel',
        'Klopsik', 'Kluski', 'Kompot', 'Kopytka', 'Kotlet', 'Krem', 'Krokiet', 'Lazania', 'Lody',
        'Majonez', 'Makaron', 'Marmolada', 'Naleśnik', 'Ogórek', 'Omlet', 'Pączek', 'Pierogi', 'Piernik',
        'Pizza', 'Placek', 'Pomidor', 'Popcorn', 'Pyzy', 'Racuchy', 'Risotto', 'Rogal', 'Rosół', 'Ryba',
        'Ryż', 'Sałatka', 'Ser', 'Sernik', 'Stek', 'Sushi', 'Szarlotka', 'Szynka', 'Tarta', 'Tort',
        'Tosty', 'Wafel', 'Zapiekanka', 'Zupa', 'Żurek'
    ],

    colors: [
        'Amarantowy', 'Aquamarine', 'Beżowy', 'Biały', 'Bordowy', 'Brązowy', 'Brzoskwiniowy', 'Buraczkowy',
        'Ceglasty', 'Chabrowy', 'Ciemnoniebieski', 'Cyjanowy', 'Czarny', 'Czerwony', 'Ecru', 'Fioletowy',
        'Fuksjowy', 'Grafitowy', 'Granatowy', 'Indygo', 'Jasnozielony', 'Karmazynowy', 'Khaki', 'Koralowy',
        'Kremowy', 'Lazurowy', 'Liliowy', 'Magenta', 'Miedziany', 'Morski', 'Morelowy', 'Niebieski',
        'Oliwkowy', 'Pomarańczowy', 'Purpurowy', 'Róż', 'Różowy', 'Rudy', 'Seledynowy', 'Siwy',
        'Srebrny', 'Szafirowy', 'Szary', 'Szmaragdowy', 'Turkusowy', 'Wrzosowy', 'Złoty', 'Zielony', 'Żółty'
    ],

    sports: [
        'Badminton', 'Baseball', 'Biathlon', 'Boks', 'Brydż', 'Curling', 'Dżudo', 'Fechtunek',
        'Footbal', 'Futsal', 'Golf', 'Gimnastyka', 'Hokej', 'Jeździectwo', 'Judo', 'Kajakarstwo',
        'Karate', 'Kolarstwo', 'Koszykówka', 'Kręgle', 'Krykiet', 'Lacrosse', 'Lekkoatletyka',
        'Łucznictwo', 'Łyżwiarstwo', 'Narciarstwo', 'Paintball', 'Piłka nożna', 'Piłka ręczna',
        'Piłka wodna', 'Pływanie', 'Polo', 'Rajdy', 'Rugby', 'Siatkówka', 'Skoki', 'Squash',
        'Strzelectwo', 'Surfing', 'Szachy', 'Szermierka', 'Tenis', 'Triathlon', 'Wioślarstwo',
        'Wspinaczka', 'Zapasy', 'Żeglarstwo', 'Żużel'
    ],

    rivers: [
        'Amazonka', 'Bug', 'Dniepr', 'Don', 'Dunaj', 'Dunajec', 'Ganges', 'Indus', 'Jangcy', 'Jordan',
        'Ren', 'Loara', 'Łaba', 'Mekong', 'Missisipi', 'Missouri', 'Niger', 'Nil', 'Noteć', 'Nysa',
        'Ob', 'Odra', 'Oka', 'Orinoko', 'Pilica', 'Radomka', 'San', 'Sekwana', 'Tamiza', 'Tyber',
        'Warta', 'Wisła', 'Wisłoka', 'Wisłok', 'Wołga', 'Yukon', 'Zambezi'
    ],

    fruits: [
        'Agrest', 'Ananas', 'Arbuz', 'Awokado', 'Banan', 'Borówka', 'Brzoskwinia', 'Cytryna', 'Czereśnia',
        'Daktyl', 'Figa', 'Grejpfrut', 'Gruszka', 'Jabłko', 'Jagoda', 'Jeżyna', 'Kaki', 'Kiwi', 'Kokos',
        'Liczi', 'Limonka', 'Malina', 'Mandarynka', 'Mango', 'Marakuja', 'Melon', 'Morela', 'Morwa',
        'Nektarynka', 'Oliwka', 'Papaja', 'Pigwa', 'Pomarańcza', 'Porzeczka', 'Poziomka', 'Śliwka',
        'Truskawka', 'Winogrono', 'Wiśnia', 'Żurawina'
    ],

    flowers: [
        'Azalia', 'Begonia', 'Bratek', 'Chryzantema', 'Cynamon', 'Dalia', 'Fiołek', 'Frezja', 'Gardenia',
        'Gerber', 'Goździk', 'Hibiskus', 'Hortensja', 'Irys', 'Jaśmin', 'Konwalia', 'Krokus', 'Lilia',
        'Lawenda', 'Magnolia', 'Mak', 'Margaryta', 'Narcyz', 'Niezapominajka', 'Orchidea', 'Pelargonia',
        'Petunia', 'Piwonia', 'Różanecznik', 'Róża', 'Słonecznik', 'Storczyk', 'Strelicja', 'Tulipan',
        'Wrzos', 'Żonkil'
    ],

    general: [
        // Large general purpose dictionary for "Rzecz", "Narzędzie", etc.
        'Antena', 'Atlas', 'Bateria', 'Biurko', 'Blender', 'Bluza', 'Budzik', 'Brelok', 'Choinka',
        'Czajnik', 'Drabina', 'Drukarka', 'Dywan', 'Dzwonek', 'Fartuch', 'Firanka', 'Fotel', 'Garnek',
        'Gitara', 'Grzebień', 'Guzik', 'Hamak', 'Iglica', 'Jabłko', 'Kabel', 'Kalkulator', 'Kaloryfer',
        'Kapelusz', 'Kask', 'Klucz', 'Koc', 'Kombinerki', 'Kompas', 'Komputer', 'Kostka', 'Krawat',
        'Krzesło', 'Książka', 'Kubek', 'Kuchenka', 'Kurtka', 'Lampka', 'Laptop', 'Latarka', 'Lina',
        'Linijka', 'Lodówka', 'Lustro', 'Łopatka', 'Łóżko', 'Magnes', 'Młotek', 'Monitor', 'Nożyczki',
        'Obraz', 'Okulary', 'Ołówek', 'Opona', 'Parasol', 'Patelnia', 'Piła', 'Pióro', 'Plecak',
        'Poduszka', 'Pokrowiec', 'Pompka', 'Prysznic', 'Pralka', 'Pudełko', 'Radio', 'Rakieta', 'Ramka',
        'Rękawiczki', 'Robot', 'Roleta', 'Rower', 'Różaniec', 'Siatka', 'Sitko', 'Skarpeta', 'Słomka',
        'Smycz', 'Spinacz', 'Stolik', 'Stół', 'Sukienka', 'Suszarka', 'Szafa', 'Szczotka', 'Szuflada',
        'Talerz', 'Telefon', 'Torba', 'Trampolina', 'Tusz', 'Waga', 'Walizka', 'Wazon', 'Wiadro', 'Wieszak',
        'Wkrętak', 'Zapalniczka', 'Zegar', 'Żarówka', 'Żelazko'
    ]
};

/**
 * Normalize string for comparison (lowercase, remove diacritics is optional)
 */
function normalize(str) {
    return str.trim().toLowerCase();
}

/**
 * Check if a word is valid for a given category type
 */
export function validateWord(word, categoryType) {
    if (!word || word.trim().length === 0) return false;

    const normalized = normalize(word);
    const wordList = WORDS[categoryType];

    if (!wordList) {
        // For "general" type categories without specific lists, accept anything
        return normalized.length >= 2;
    }

    // Check if the word exists in the list (case-insensitive)
    return wordList.some(w => normalize(w) === normalized);
}

/**
 * Check if a word starts with the required letter
 */
export function startsWithLetter(word, letter) {
    if (!word || word.trim().length === 0) return false;
    return normalize(word).startsWith(normalize(letter));
}

/**
 * Get all words for a category type that start with a specific letter
 */
export function getWordsForLetter(categoryType, letter) {
    const wordList = WORDS[categoryType];
    if (!wordList) return [];
    return wordList.filter(w => normalize(w).startsWith(normalize(letter)));
}

export default WORDS;
