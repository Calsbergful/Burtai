import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { numberDescriptions } from '../utils/numerology';
import { zodiacSigns, zodiacSignTranslations, zodiacSignEmojis } from '../utils/westernZodiac';
import { zodiacAnimals, zodiacTranslations, zodiacEmojis, enemySigns, trineGroups, specialRelationships, zodiacLyingTypes, zodiacStrongSides, zodiacDislikes } from '../utils/chineseZodiac';

// Helper component to display bilingual content
function BilingualText({ lt, en, showEnglish, className = "", inline = false }) {
    if (!showEnglish || !en) {
        return <span className={className}>{lt}</span>;
    }
    
    if (inline) {
        return (
            <span className={className}>
                {lt} <span className="text-blue-300/60 text-xs ml-1">({en})</span>
            </span>
        );
    }
    
    return (
        <div className={className}>
            <div className="text-white/90">{lt}</div>
            <div className="mt-1 text-xs text-blue-300/70 italic border-l-2 border-blue-500/40 pl-2">
                <span className="font-semibold text-blue-300/80">[EN]</span> {en}
            </div>
        </div>
    );
}

// Helper to preserve English technical terms
function PreserveEnglish({ children, en, showEnglish }) {
    if (!showEnglish || !en) {
        return children;
    }
    return (
        <>
            {children}
            <span className="text-blue-300/60 text-xs ml-1">({en})</span>
        </>
    );
}

// Wrapper component that shows English when available and showEnglish is true
function EnglishContent({ children, english, showEnglish, className = "" }) {
    if (showEnglish && english) {
        return <div className={className}>{english}</div>;
    }
    return <div className={className}>{children}</div>;
}

// Accordion Component for Collapsible Sections
function AccordionSection({ id, title, titleEn, children, isOpen, onToggle, className = "", searchMatch = true, searchQuery = '', contentText = '', expandedSearchTerms = [], showEnglish = false, getEnglishTitle }) {
    const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
    
    // Use English title if showEnglish is true and titleEn is provided, or use helper function
    const englishTitle = titleEn || (getEnglishTitle ? getEnglishTitle(title) : null);
    const displayTitle = (showEnglish && englishTitle) ? englishTitle : title;
    
    // Check if title matches search (supports expanded terms)
    const titleMatches = !hasSearchQuery || (expandedSearchTerms && expandedSearchTerms.length > 0 
        ? expandedSearchTerms.some(term => (displayTitle || '').toLowerCase().includes(term))
        : (displayTitle || '').toLowerCase().includes((searchQuery || '').toLowerCase().trim()));
    
    // Check if content text matches search (supports expanded terms)
    const contentMatches = !hasSearchQuery || !contentText || (expandedSearchTerms && expandedSearchTerms.length > 0
        ? expandedSearchTerms.some(term => (contentText || '').toLowerCase().includes(term))
        : (contentText || '').toLowerCase().includes((searchQuery || '').toLowerCase().trim()));
    
    // Determine if this section matches the search (title, keywords, or content)
    const sectionMatches = hasSearchQuery 
        ? (searchMatch && (titleMatches || contentMatches))
        : true;
    
    // When there's a search query: auto-expand if it matches, otherwise collapse
    // When there's no search query: only show if manually opened
    const effectiveIsOpen = hasSearchQuery 
        ? sectionMatches  // Auto-expand matching sections during search
        : isOpen;         // Only show manually opened sections when no search
    
    // Hide entire section if it doesn't match search
    if (!sectionMatches) {
        return null;
    }
    
    return (
        <div className={`mb-4 ${className}`} id={id}>
            <button
                onClick={() => onToggle(id)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40 rounded-lg hover:border-purple-400/60 transition-all"
            >
                <h4 className="text-left font-bold text-white">{displayTitle}</h4>
                <motion.div
                    animate={{ rotate: effectiveIsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-purple-300"
                >
                    ▼
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: effectiveIsOpen ? 'auto' : 0, opacity: effectiveIsOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="mt-2">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

export default function Database() {
    const [activeTab, setActiveTab] = useState('numbers');
    const [editingItem, setEditingItem] = useState(null);
    const [editData, setEditData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState({});
    const [showEnglish, setShowEnglish] = useState(() => {
        const saved = localStorage.getItem('database_show_english');
        return saved ? JSON.parse(saved) : false;
    });
    const [customData, setCustomData] = useState(() => {
        const saved = localStorage.getItem('database_custom');
        return saved ? JSON.parse(saved) : {};
    });

    // Helper function to get English title for sections
    const getEnglishTitle = (ltTitle) => {
        const titleMap = {
            "📖 Numerologijos Įvadas": "📖 Numerology Introduction",
            "📅 Asmeniniai Metai ir Mėnesiai": "📅 Personal Years and Months",
            "🔤 Gematria ir Letterology": "🔤 Gematria and Letterology",
            "🔄 Sinchronizacijos ir Pasikartojantys Skaičiai": "🔄 Synchronizations and Repeating Numbers",
            "💡 Papildomos Numerologijos Įžvalgos": "💡 Additional Numerology Insights",
            "📚 Detalūs Skaičių Aprašymai": "📚 Detailed Number Descriptions",
            "📊 Numerologijos Skaičių Santykių Diagrama": "📊 Numerology Number Relationships Diagram",
            "🎴 Skaičių Kortelės": "🎴 Number Cards",
            "♎ Svarstyklės (Libra) ir Maldek": "♎ Scales (Libra) and Maldek",
            "❓ Kodėl Nėra 2 Gyvenimo Kelio?": "❓ Why Is There No Life Path 2?",
            "🌐 Matricos Energijos Derlius": "🌐 Matrix Energy Harvesting",
            "🎨 Spalvos ir Vibracinės Energijos": "🎨 Colors and Vibrational Energies",
            "♒ Vandenio Amžius (Age of Aquarius)": "♒ Age of Aquarius",
            "💑 Santykiai ir Suderinamumas": "💑 Relationships and Compatibility",
            "💻 Technologija ir Dvyniai (Gemini)": "💻 Technology and Twins (Gemini)",
            "📊 Numerologijos Hierarchija": "📊 Numerology Hierarchy",
            "⚖️ Karma, Reinkarnacija ir Astrologija": "⚖️ Karma, Reincarnation and Astrology",
            "🔄 Reinkarnacija ir Sielos": "🔄 Reincarnation and Souls",
            "🔗 Zodiako Santykiai": "🔗 Zodiac Relationships",
            "🐉 Detalūs Kinų Zodiako Ženklų Aprašymai": "🐉 Detailed Chinese Zodiac Sign Descriptions",
            "📖 Didžioji Lenktynių Istorija": "📖 The Great Race Story",
            "⚠️ Svarbu: Kinų Naujieji Metai": "⚠️ Important: Chinese New Year",
        };
        return titleMap[ltTitle] || ltTitle;
    };

    // Translation system for UI text
    const t = {
        searchPlaceholder: showEnglish ? "🔍 Search information (e.g., '11', 'Rat', 'Karma', 'Matrix'...)" : "🔍 Ieškoti informacijos (pvz., '11', 'Rat', 'Karma', 'Matrix'...)",
        searching: showEnglish ? "Searching:" : "Ieškoma:",
        searchingRelated: showEnglish ? "(Searching related terms:" : "(Ieškoma susijusių terminų:",
        showEnglishNote: showEnglish ? "📝 Showing all content in original English text" : "📝 Rodo originalų anglų tekstą kartu su lietuvių vertimu",
        toggleTitle: showEnglish ? "Show Lithuanian only" : "Rodyti originalų anglų tekstą",
        tabs: {
            numbers: showEnglish ? "Numbers" : "Skaičiai",
            western: showEnglish ? "Western Zodiac" : "Vakarietiškas Zodiakas",
            chinese: showEnglish ? "Chinese Zodiac" : "Kinų Zodiakas",
            colors: showEnglish ? "Colors" : "Spalvos"
        },
        edit: showEnglish ? "✏️ Edit" : "✏️ Redaguoti",
        save: showEnglish ? "💾 Save" : "💾 Išsaugoti",
        cancel: showEnglish ? "❌ Cancel" : "❌ Atšaukti",
        noDescription: showEnglish ? "No description. Click \"Edit\" to add." : "Nėra aprašymo. Spustelėkite \"Redaguoti\" norėdami pridėti.",
        description: showEnglish ? "Description" : "Aprašymas",
        placeholder: {
            description: showEnglish ? "Description, what to expect on a day when this number is active..." : "Aprašymas, ką tikėtis dieną, kai aktyvus šis skaičius...",
            enterDescription: showEnglish ? "Enter or paste description..." : "Įveskite arba įklijuokite aprašymą...",
            lyingType: showEnglish ? "E.g: half truths, gaslight, manipulation..." : "Pvz: half truths, gaslight, manipulation...",
            strongSide: showEnglish ? "E.g: manipulation, leader, smart..." : "Pvz: manipulation, leader, smart...",
            dislike: showEnglish ? "E.g: can't keep a secret, bossy, annoying..." : "Pvz: can't keep a secret, bossy, annoying..."
        },
        relationship: {
            enemy: showEnglish ? "Enemy" : "Priešas",
            bad: showEnglish ? "Bad" : "Blogas",
            neutral: showEnglish ? "50/50 (Neutral)" : "50/50 (Neutralus)",
            good: showEnglish ? "Good" : "Geras",
            best: showEnglish ? "Best" : "Geriausias",
            ms: showEnglish ? "Master/Slave" : "Master/Slave",
            empty: showEnglish ? "Empty" : "Tuščia"
        }
    };

    // Save custom data to localStorage
    useEffect(() => {
        localStorage.setItem('database_custom', JSON.stringify(customData));
    }, [customData]);

    // Save language preference to localStorage
    useEffect(() => {
        localStorage.setItem('database_show_english', JSON.stringify(showEnglish));
    }, [showEnglish]);

    // Toggle section expansion
    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // Search term associations - when word. is typed, search for related terms
    const searchAssociations = {
        'karma': ['karma', 'karminė', 'karminis', 'reinkarnacija', 'siela', 'sielos', 'emocijos', 'emocinis', 'ryšys', 'pririštas', 'pririšti', 'aktyvuojate', 'aktyvuoti', 'skola', 'apribojimai'],
        'numerologija': ['numerologija', 'numerologijos', 'skaičiai', 'skaičius', 'lifepath', 'gyvenimo kelias', 'likimas', 'asmenybė', 'sielos skaičius', 'asmeniniai metai', 'personal year'],
        'zodiakas': ['zodiakas', 'zodiako', 'ženklai', 'ženklas', 'astrologija', 'astrologijos', 'vakarietiškas', 'kinų', 'vakarietiškas zodiakas', 'kinų zodiakas'],
        'astrologija': ['astrologija', 'astrologijos', 'zodiakas', 'zodiako', 'ženklai', 'planeta', 'planetos', 'namai', 'vedinė', 'vedinės', 'vakarietiškas'],
        'reinkarnacija': ['reinkarnacija', 'reinkarnacijos', 'siela', 'sielos', 'karma', 'karminė', 'gyvenimas', 'gyvenimai', 'kraujotaka', 'kraujotakos'],
        'siela': ['siela', 'sielos', 'reinkarnacija', 'karma', 'mėnulis', 'gaudyklė', 'atmintis', 'karminė'],
        'skaičiai': ['skaičiai', 'skaičius', 'numerologija', 'lifepath', 'gyvenimo kelias', 'likimas', 'asmenybė', 'sielos skaičius', '1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22', '33'],
        'spalvos': ['spalvos', 'spalvų', 'spalva', 'raudona', 'mėlyna', 'žalia', 'geltona', 'violetinė', 'indigo', 'oranžinė', 'vibracija', 'vibracinės'],
        'matrix': ['matrix', 'matrica', 'matricos', 'energija', 'energijos', 'derlius', 'harvesting', 'sistema', 'sistemos'],
        'elementai': ['elementai', 'elementas', 'oro', 'žemės', 'vandens', 'ugnies', 'kinų', 'santykiai', 'priešai', 'draugai'],
        'gyvenimo kelias': ['gyvenimo kelias', 'lifepath', 'lp', 'skaičiai', 'numerologija', 'kelias', 'gyvenimas'],
        'emocijos': ['emocijos', 'emocinis', 'ryšys', 'pririštas', 'karma', 'karminė', 'aktyvuojate'],
        'mėnulis': ['mėnulis', 'mėnulio', 'siela', 'gaudyklė', 'atmintis', 'ciklai', 'fazės'],
        'planeta': ['planeta', 'planetos', 'saulė', 'saturnas', 'venus', 'marsas', 'jupiteris', 'merkūras', 'rahu', 'ketu'],
    };

    // Expand search query if it ends with a dot
    const expandSearchQuery = (query) => {
        if (!query || !query.endsWith('.')) {
            return query ? [query.toLowerCase().trim()] : [];
        }
        
        const baseTerm = query.slice(0, -1).toLowerCase().trim();
        const associations = searchAssociations[baseTerm] || [baseTerm];
        
        // Return all associated terms
        return associations.map(term => term.toLowerCase());
    };

    // Check if text matches any of the expanded search terms
    const matchesExpandedQuery = (text, expandedTerms) => {
        if (!text || !expandedTerms || expandedTerms.length === 0) return false;
        const textLower = text.toLowerCase();
        return expandedTerms.some(term => textLower.includes(term));
    };

    // Calculate expanded search terms (for dot expansion) - must be after expandSearchQuery is defined
    const expandedSearchTerms = searchQuery.trim() 
        ? expandSearchQuery(searchQuery.trim())
        : [];

    // Check if section matches search query (checks both title and keywords, with expansion)
    const matchesSearch = (title, keywords = '') => {
        if (!searchQuery || !searchQuery.trim()) return true;
        try {
            const expandedTerms = expandSearchQuery(searchQuery.trim());
            const titleLower = (title || '').toLowerCase();
            const keywordsLower = (keywords || '').toLowerCase();
            const combinedText = `${titleLower} ${keywordsLower}`;
            return matchesExpandedQuery(combinedText, expandedTerms);
        } catch (error) {
            console.error('Search error:', error);
            return false;
        }
    };

    // Check if a category should be shown (has matching sections or no search)
    const categoryHasMatches = (categoryName, categoryKeywords = '') => {
        if (!searchQuery || !searchQuery.trim()) return true;
        try {
            const expandedTerms = expandSearchQuery(searchQuery.trim());
            const nameLower = (categoryName || '').toLowerCase();
            const keywordsLower = (categoryKeywords || '').toLowerCase();
            const combinedText = `${nameLower} ${keywordsLower}`;
            return matchesExpandedQuery(combinedText, expandedTerms);
        } catch (error) {
            console.error('Category search error:', error);
            return false;
        }
    };


    const getItemData = (type, key) => {
        const customKey = `${type}_${key}`;
        if (customData[customKey]) {
            return customData[customKey];
        }
        return null;
    };

    const saveItemData = (type, key, data) => {
        const customKey = `${type}_${key}`;
        setCustomData(prev => ({
            ...prev,
            [customKey]: data
        }));
        setEditingItem(null);
        setEditData({});
    };

    const startEditing = (type, key, defaultData = {}) => {
        const customKey = `${type}_${key}`;
        const existing = customData[customKey] || defaultData;
        setEditingItem(`${type}_${key}`);
        setEditData(existing);
    };

    const cancelEditing = () => {
        setEditingItem(null);
        setEditData({});
    };

    const handleTextInput = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Get numerology relationship from custom data (starts blank, user fills in)
    const getNumerologyRelationship = (num1, num2) => {
        const key = `relationship_${num1}-${num2}`;
        return customData[key] || null;
    };

    // Handle clicking on relationship cell to cycle through types
    const handleRelationshipClick = (num1, num2) => {
        const key = `relationship_${num1}-${num2}`;
        const current = customData[key] || null;
        
        // Cycle through: null -> enemy -> bad -> neutral -> good -> best -> ms -> null
        const cycle = [null, 'enemy', 'bad', 'neutral', 'good', 'best', 'ms'];
        const currentIndex = cycle.indexOf(current);
        const nextIndex = (currentIndex + 1) % cycle.length;
        const nextValue = cycle[nextIndex];
        
        setCustomData(prev => {
            const updated = { ...prev };
            if (nextValue === null) {
                delete updated[key];
            } else {
                updated[key] = nextValue;
            }
            return updated;
        });
    };

    const getRelationshipLabel = (relationship) => {
        return t.relationship[relationship] || t.relationship.empty;
    };

    return (
        <div className="w-full max-w-6xl mx-auto mb-1 sm:mb-2">
            <div className="bg-gradient-to-br from-purple-900/20 via-violet-900/15 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-purple-500/20">
                {/* Search Bar and Language Toggle */}
                <div className="mb-6">
                    <div className="flex gap-3 mb-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/40 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowEnglish(!showEnglish)}
                            className={`px-4 py-3 rounded-lg border transition-all ${
                                showEnglish 
                                    ? 'bg-blue-600/40 border-blue-500/60 text-white' 
                                    : 'bg-purple-900/40 border-purple-500/40 text-white/70 hover:border-purple-400/60'
                            }`}
                            title={t.toggleTitle}
                        >
                            {showEnglish ? '🇬🇧 EN' : '🇱🇹 LT'}
                        </button>
                    </div>
                    {searchQuery && (
                        <p className="mt-2 text-sm text-white/70">
                            {t.searching} <span className="font-semibold text-purple-300">"{searchQuery}"</span>
                            {searchQuery.trim().endsWith('.') && expandedSearchTerms.length > 1 && (
                                <span className="ml-2 text-xs text-purple-400">
                                    {t.searchingRelated} {expandedSearchTerms.slice(0, 3).join(', ')}{expandedSearchTerms.length > 3 ? '...' : ''})
                                </span>
                            )}
                        </p>
                    )}
                    {showEnglish && (
                        <p className="mt-2 text-xs text-blue-300/70">
                            {t.showEnglishNote}
                        </p>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('numbers')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            activeTab === 'numbers'
                                ? 'bg-purple-500/40 text-white border border-purple-400/60'
                                : 'bg-purple-900/20 text-white/70 hover:text-white hover:bg-purple-500/20 border border-transparent'
                        }`}
                    >
                        {t.tabs.numbers}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('western')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            activeTab === 'western'
                                ? 'bg-purple-500/40 text-white border border-purple-400/60'
                                : 'bg-purple-900/20 text-white/70 hover:text-white hover:bg-purple-500/20 border border-transparent'
                        }`}
                    >
                        {t.tabs.western}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('chinese')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            activeTab === 'chinese'
                                ? 'bg-purple-500/40 text-white border border-purple-400/60'
                                : 'bg-purple-900/20 text-white/70 hover:text-white hover:bg-purple-500/20 border border-transparent'
                        }`}
                    >
                        {t.tabs.chinese}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('colors')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            activeTab === 'colors'
                                ? 'bg-purple-500/40 text-white border border-purple-400/60'
                                : 'bg-purple-900/20 text-white/70 hover:text-white hover:bg-purple-500/20 border border-transparent'
                        }`}
                    >
                        {t.tabs.colors}
                    </motion.button>
                </div>

                {/* Numbers Tab */}
                {(activeTab === 'numbers' || searchQuery.trim()) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Numerologijos Skaičiai</h3>
                        
                        {/* Numerology Introduction */}
                        <AccordionSection
                            id="intro"
                            title="📖 Numerologijos Įvadas"
                            isOpen={expandedSections['intro'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('📖 Numerologijos Įvadas', 'numerologija skaičiai')}
                            showEnglish={showEnglish}
                            getEnglishTitle={getEnglishTitle}
                        >
                            <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg p-4">
                                <EnglishContent 
                                    showEnglish={showEnglish}
                                    english={
                                        <div className="text-sm text-white/90 space-y-3">
                                            <p className="text-xs">
                                                Numerology is the study of number symbolism. It is used to determine a person's personality, 
                                                strengths and talents, obstacles, inner needs, emotional reactions and ways to interact with others.
                                            </p>
                                            <p className="text-xs">
                                                Whether you use numerology to examine your life, take advantage of unexplored opportunities, 
                                                confirm your talents or simply find out where to go next, numerology can be a 
                                                penetrating tool that helps you better understand yourself and loved ones.
                                            </p>
                                            <p className="text-xs">
                                                Numerology provides the complete picture, revealing all the various parts of your personality and how 
                                                they come together to create the person you are. With this complete picture, you can maximize 
                                                your strengths and learn to understand how to overcome weaknesses.
                                            </p>
                                            <div className="border-t border-purple-500/30 pt-3 mt-3">
                                                <p className="font-semibold text-purple-300 mb-2">Birth Days:</p>
                                                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                    <li><span className="font-semibold">Good days to be born:</span> 8, 17, 28 - good for money. Something very good looking - 5, 14, 23.</li>
                                                    <li><span className="font-semibold">Avoid being born on the 19th</span> - they tend to have illnesses, defects.</li>
                                                </ul>
                                                <p className="text-xs mt-2">
                                                    <span className="font-semibold">Energy must match for it to work</span>. Time is important. 
                                                    Meetings.
                                                </p>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="text-sm text-white/90 space-y-3">
                                        <p className="text-xs">
                                            Numerologija yra skaičių simbolikos tyrimas. Ji naudojama nustatyti asmens asmenybę, 
                                            stiprybes ir talentus, kliūtis, vidinius poreikius, emocines reakcijas ir būdus, kaip elgtis su kitais.
                                        </p>
                                        <p className="text-xs">
                                            Ar naudojate numerologiją išnagrinėti savo gyvenimą, pasinaudoti neištyrinėtomis galimybėmis, 
                                            patvirtinti savo talentus arba tiesiog išsiaiškinti, kur eiti toliau, numerologija gali būti 
                                            prasiskverbiančias įrankis, padedantis geriau suprasti save ir mylimus žmones.
                                        </p>
                                        <p className="text-xs">
                                            Numerologija pateikia visą vaizdą, atskleisdama visus įvairius jūsų asmenybės dalis ir kaip 
                                            jos susijungia, kad sukurtų žmogų, kuriuo esate. Turėdami šį pilną vaizdą, galite maksimaliai 
                                            pasinaudoti savo stiprybėmis ir išmokti suprasti, kaip įveikti silpnybes.
                                        </p>
                                        <div className="border-t border-purple-500/30 pt-3 mt-3">
                                            <p className="font-semibold text-purple-300 mb-2">Gimimo Dienos:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li><span className="font-semibold">Geros dienos gimti:</span> 8, 17, 28 - geros pinigams. Kažkas labai gerai atrodantis - 5, 14, 23.</li>
                                                <li><span className="font-semibold">Vengti gimti 19 dieną</span> - jie linkę turėti ligas, defektus.</li>
                                            </ul>
                                            <p className="text-xs mt-2">
                                                <span className="font-semibold">Energija turi atitikti, kad veiktų</span>. Laikas svarbus. 
                                                Susitikimai.
                                            </p>
                                        </div>
                                    </div>
                                </EnglishContent>
                            </div>
                        </AccordionSection>
                        
                        {/* Personal Years and Personal Months */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="personal-years"
                            title="📅 Asmeniniai Metai ir Mėnesiai"
                            isOpen={expandedSections['personal-years'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Asmeniniai Metai Mėnesiai Personal Year')}
                        >
                            <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                
                                <div>
                                    <p className="font-semibold text-blue-300 mb-2">Universalių Metų vs. Asmeninių Metų Skaičiavimas:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Universalių metų nauji metai</span> prasideda sausio 1 d. visiems. 
                                        Pvz., 2021 = 2+0+2+1 = <span className="font-semibold">5 Universalūs Metai (5UY)</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Asmeniniai metai</span> prasideda jūsų gimtadienį. 
                                        Pvz., gimęs spalio 7 d. - pažiūrėkite į spalio 7 d. 2020 m. ir apskaičiuokite asmeninius metus.
                                        Sudėkite: 1+0+7+2+0+2+0 = <span className="font-semibold">12 = 3 Asmeniniai Metai (3PY)</span>.
                                        Asmuo bus 3PY 2020 m. ir įeis į 4PY 2021 m.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Pvz., gimęs sausio 5 d. - jūsų asmeniniai metai prasideda sausio 5 d. 
                                        Skaičiuojama kaip gyvenimo kelias: 1+1+2+0+2+1 = <span className="font-semibold">11 Asmeniniai Metai (11PY)</span>.
                                    </p>
                                    <p className="text-xs">
                                        Pvz., gimęs gruodžio 27 d. 2020 m. įėjo į naują 7PY ciklą gruodžio 27 d. 2020 m.
                                    </p>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">🪞 Veidrodžio Metai (Mirror Years):</p>
                                    <p className="text-xs mb-2">
                                        Žodis "mirror" (veidrodis) turi <span className="font-semibold">3 R raidės</span> - m i R R o R.
                                    </p>
                                    <p className="font-semibold text-blue-200 mb-1 mt-2">18 metų - Priešų Veidrodžio Metai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs mb-2">
                                        <li>Kai žmogus tampa 18 metų, jie bus priešų metais</li>
                                        <li>18 sumažina iki 9 (1+8=9) - Prisitaikymo skaičius</li>
                                        <li>18 metų asmeniniai metai (ĮSPAUSTOS ENERGIJOS) veidrodžiuoja gimimo energiją - jų GYVENIMO KELIO energiją</li>
                                        <li>Tai vadinama <span className="font-semibold">PRIEŠŲ VEIDRODŽIO METAI</span></li>
                                        <li>Pvz.: Gimęs 2003 m. (5 universalūs metai), tapo 18 2021 m. (5 universalūs metai) - asmeniniai metai veidrodžiuoja gimimo energiją</li>
                                        <li>Bet astrologijoje (Kinų/Zemės) tai yra PRIEŠINGAS ženklas</li>
                                        <li>Pvz.: Gegužės 28 d. 1989 m. - 6LP, tapo 18 2007 m. (9 universalūs metai), taip pat 6PY - veidrodžiuoja Gyvenimo Kelią</li>
                                        <li>1989 = 1+9+8+9 = 27/9, 2007 = 2+0+0+7 = 9 - abu 9 universalūs metai</li>
                                        <li>Veidrodis gali bandyti jus apgauti - daug žmonių 17-18 metų amžiaus vis dar ieško savęs ir turi sunkių laikų</li>
                                        <li>Dauguma žmonių būna aukštųjų mokyklų vyresniųjų klasės mokiniai tuo metu</li>
                                    </ul>
                                    <p className="font-semibold text-blue-200 mb-1 mt-2">36 metų - Veidrodžio Metai po Savo Ženklu:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs mb-2">
                                        <li>36 metų - kitas Veidrodžio Metai, šį kartą po savo ženklu</li>
                                        <li>Pvz.: Gegužės 28 d. 1989 m. - 6LP, Gyvatė (gimimo metų įspaustos energijos)</li>
                                        <li>36 metų 2025 m. - 9 universalūs metai (kaip 1989), taip pat Gyvatės metai</li>
                                        <li>Iš esmės kas 36 metus energija kartojasi arba perdirbama - ta pati Numerologija ir Astrologija</li>
                                        <li>Vienintelis variantas - daugeliu atvejų bus skirtingi skaitmenys metuose, bet ta pati vertė</li>
                                        <li>Reti išimtys, kaip 2002 iki 2020</li>
                                        <li>Šie metai yra reikšmingi, nes veidrodžiuoja energiją</li>
                                        <li>Veidrodis atspindi visus jūsų keistus dalykus - ne visi turės gerą gyvenimą, gerus pasirinkimus ar gerą karmą</li>
                                        <li>Pvz.: Lamar Odom (gimęs lapkričio 6 d. 1979 m.) - 1997 m. (Jaučio metai) buvo 18, buvo METŲ ŽAIDĖJAS, bet taip pat areštuotas už prostitucijos siūlymą</li>
                                        <li>2009 m. (priešų metai) vedė Kim Kardashian, laimėjo čempionatą - dalykai priešų metais greičiausiai neveiks ilgalaikėje perspektyvoje</li>
                                        <li>2015 m. (Ožkos metai Ožkai) - pasiekė dugną, perdozavo bordelyje, buvo gyvybės palaikymo sistemoje, šventė 36-ąjį gimtadienį ligoninėje</li>
                                        <li>Prostitucijos proklamacija pasirodė abiejuose veidrodžio metuose - aukštame ir žemame taške</li>
                                    </ul>
                                    <p className="font-semibold text-blue-200 mb-1 mt-2">Kiti Veidrodžio Metai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>54 metai - dar vienas Veidrodžio Metai, vis dar galima pasukti dalykus</li>
                                        <li>72 metai - dar vienas Veidrodžio Metai</li>
                                        <li>18-36-54-72 - visi žinomi kaip Veidrodžio Metai (visi sumažina iki 9)</li>
                                    </ul>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">Asmeniniai Mėnesiai (PM):</p>
                                    <p className="text-xs mb-2">
                                        Paimkite PY ir pridėkite prie dabartinio mėnesio. 
                                        Pvz., sausio 5 d. gimęs (11PY) + Sausis = 12PM (3PM).
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Asmeniniai mėnesiai neprasideda mėnesio 1 d., bet jūsų gimimo dieną.</span>
                                    </p>
                                    <p className="text-xs">
                                        Pvz., gruodžio 27 d. 2020 m. įėjo į 1PM.
                                    </p>
                                    <p className="text-xs mt-2 italic">
                                        Svarba: Ne taip svarbu kaip PY, turi tam tikrą vertę, bet ne pirmas dalykas, į kurį reikia žiūrėti. 
                                        Suteikia energijos skonį kiekvienam mėnesiui asmeniui.
                                    </p>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">Asmeninių Metų Reikšmės:</p>
                                    <div className="bg-blue-950/40 rounded p-3 space-y-2 text-xs">
                                        <p><span className="font-semibold text-blue-200">1 Ciklas:</span> Naujas pradžia jums, tiesiogine prasme. Pradėkite naujus dalykus. Ne laikas būti pasyviam. Būkite aktyvus.</p>
                                        <p><span className="font-semibold text-blue-200">3 Ciklas:</span> Viskas apie komunikaciją. 3-ame, nebūkite atsiskyrėliu. Kalbėkite su daug, tinkluokite, susipažinkite, būkite kūrybingi. Dėmesio spanas tikriausiai nebus toks geras - bus traukiamas daug kryptimis.</p>
                                        <p><span className="font-semibold text-blue-200">4 Ciklas:</span> Eikite prie darbo, daugiau smulkmenų. Nelaužykite įstatymų. Praeities teisiniai klausimai. Epstein pirmą kartą pateko į kalėjimą 2008 m., gimęs sausio 20 d., taigi 1/20/2008 sudėjus = 4 - teisė ir tvarka.</p>
                                        <p><span className="font-semibold text-blue-200">5 Ciklas:</span> Kelionės. Atviraus proto, sulaužykite rutiną, būkite atsargūs su seksualine energija, nes trauka bus aukščiausiame taške. Sveikatos ir grožio fokusas geras.</p>
                                        <p><span className="font-semibold text-blue-200">6 Ciklas:</span> Šeima, atsakomybės.</p>
                                        <p><span className="font-semibold text-blue-200">7 Ciklas:</span> Leiskite laiką vienam, mokymasis, problemų sprendimas, ne materialistinis, sunkiau sveikatai ir santykiams.</p>
                                        <p><span className="font-semibold text-blue-200">8 Ciklas:</span> Pinigai, karma, galia. Bidenas šiuo metu 8 cikle.</p>
                                        <p><span className="font-semibold text-blue-200">9 Ciklas:</span> Ciklo užbaigimas. Priverstas prisitaikyti, atsispindėti, tada viską pradedate iš naujo.</p>
                                        <p><span className="font-semibold text-blue-200">11 Ciklas:</span> Gali būti vienas geriausių arba vienas blogiausių, priklausomai nuo draugiško astro metų - vieni geriausi metai gyvenime, arba blogiausi, jei priešingi. Dėl aukštesnio dažnio. Daug emocijų, charizma aukščiausiame taške, tapti dvasiniu, turėti kitokį požiūrį metų pabaigoje.</p>
                                        <p><span className="font-semibold text-blue-200">22 Ciklas:</span> Daug retesnis, daugiausia 4 ciklas. Turi tiksliai sudėti iki 22. Galimybė statyti didesniu mastu.</p>
                                        <p><span className="font-semibold text-blue-200">33 Ciklas:</span> Labai retas, ypač nuo 2000-ųjų. 2020 turėjo kai kurias 22 savybes, o ne 4 - labiau kaip 22/4. Liepos 4 d. JAV - 7 + 4 + 2020 = 33. Galingas skaičius, padidiniklis, veikia kaip posūkio taškas, taigi posūkio taškas Amerikai. Įtakos skaičius, taigi 33/6 cikle įtaka turi didesnį poveikį.</p>
                                    </div>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">Asmeninės Dienos:</p>
                                    <p className="text-xs">
                                        Taip, jos egzistuoja, bet plačiai kalbant nėra svarbios didžiojoje schemoje - Gary to nemoko. 
                                        Galite net suskaidyti į asmenines valandas, minutes, sekundes - tai jus išvarys iš proto, 
                                        mes ne kompiuteriai.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Gematria and Letterology */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="gematria"
                            title="🔤 Gematria ir Letterology"
                            isOpen={expandedSections['gematria'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Gematria Letterology raidės')}
                        >
                            <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                
                                <div>
                                    <p className="font-semibold text-green-300 mb-2">Gematria:</p>
                                    <p className="text-xs mb-2">
                                        Iš esmės paimant raides ir paverčiant jas į skaičius, sudėti, kad gautumėte vertę skirtingiems žodžiams.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Apskritai tai nėra taip tikslu - <span className="font-semibold">darželio numerologija</span>, 
                                        viena iš žemesnių numerologijos formų.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Geriau veikia su trumpesniais žodžiais arba fundamentalesniais žodžiais:
                                    </p>
                                    <div className="bg-green-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>Magic = 13+1+7+9+3 = <span className="font-semibold">33</span></p>
                                        <p>Fire = 6+9+18+5 = <span className="font-semibold">11</span></p>
                                        <p>Water = <span className="font-semibold">22</span></p>
                                        <p>Food = <span className="font-semibold">22</span></p>
                                    </div>
                                    <p className="text-xs mt-2 italic">
                                        Gali būti naudinga, bet imkite su druska. Kiti numerologai remiasi tuo, nes jie yra sukčiai 
                                        ir neturi žinių.
                                    </p>
                                </div>

                                <div className="border-t border-green-500/30 pt-3">
                                    <p className="font-semibold text-green-300 mb-2">Letterology - Balsės:</p>
                                    <p className="text-xs mb-2">
                                        Vienas svarbiausių aspektų yra žiūrėti į <span className="font-semibold">balses</span> - 
                                        pirmoji balsė žodyje:
                                    </p>
                                    <div className="bg-green-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>Argue - A = <span className="font-semibold">1</span></p>
                                        <p>Sex = E = <span className="font-semibold">5</span></p>
                                        <p>Funny = U = <span className="font-semibold">3</span></p>
                                        <p>COVID-19 - O = <span className="font-semibold">6</span> = paveikė keliones ir 5 energiją labiausiai. 
                                        Dabar 5UY žmonės maištautų daugiau ir kovotų atgal, ypač Vandenio sezono metu.</p>
                                    </div>
                                </div>

                                <div className="border-t border-green-500/30 pt-3">
                                    <p className="font-semibold text-green-300 mb-2">Letterology - Didžiosios Raidės:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Didžiosios raidės:</span>
                                    </p>
                                    <div className="bg-green-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>Didžioji A = <span className="font-semibold">27</span></p>
                                        <p>Didžioji B = <span className="font-semibold">28</span> (kaip Billionaire)</p>
                                        <p>Didžioji G = <span className="font-semibold">33</span> raidė - 'paslėptas' 33</p>
                                        <p>Freemasonai - ordinas eina iki 33 laipsnių, simbolis yra G</p>
                                        <p>Gematria - prasideda didžiąja G, gauna daug dėmesio, nors nėra taip tikslu</p>
                                        <p>Tinkamas pavadinimas turėtų būti graikiškas vardas Isopsephy(?)</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Syncs and Repeating Numbers */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="sync"
                            title="🔄 Sinchronizacijos ir Pasikartojantys Skaičiai"
                            isOpen={expandedSections['sync'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Sinchronizacijos Pasikartojantys skaičiai')}
                        >
                            <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p className="text-xs">
                                    Iš esmės tai, kas tampa svarbu, yra atskirti, kas svarbiau ar mažiau svarbu ir aktualu jums.
                                </p>
                                
                                <div>
                                    <p className="font-semibold text-purple-300 mb-2">Signifikatoriai:</p>
                                    <p className="text-xs">
                                        Pvz., gimtadienis gegužės 27 d. - matote 527 daug - reiškia tiesiogesnį pranešimą jums - 
                                        pažiūrėkite, kas aplink - kontekstas.
                                    </p>
                                </div>

                                <div className="border-t border-purple-500/30 pt-3">
                                    <p className="font-semibold text-purple-300 mb-2">Pasikartojantys Skaičiai:</p>
                                    <div className="bg-purple-950/40 rounded p-3 space-y-2 text-xs">
                                        <p><span className="font-semibold">555</span> - rodo jums, kur energija jūsų palieka</p>
                                        <p><span className="font-semibold">33</span> - dažnai veikia kaip patvirtinimas/validacija, ypač žiniose</p>
                                        <p><span className="font-semibold">11</span> - gali veikti kaip dvasinis pabudimas arba žadintuvas, taip pat gali būti įspėjimas. 
                                        11 ne visada geras arba blogas, bet šiek tiek nestabilus</p>
                                    </div>
                                </div>

                                <div className="border-t border-purple-500/30 pt-3">
                                    <p className="font-semibold text-purple-300 mb-2">Kontekstas:</p>
                                    <p className="text-xs mb-2">
                                        Kas yra asmeninis pranešimas ar kažkas kito, jūs visada gaunate signalus iš Matrix ir 
                                        neperkomplikuokite dalykų, jūs žinote, ką skaičiai reiškia.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Taikykite su kontekstu, ką matote aplink, kad suprastumėte. Kur jūsų protas, kas aplink, 
                                        ką jis jums sako.
                                    </p>
                                    <p className="text-xs italic">
                                        Ne visi skaičiai, kuriuos matote, yra pranešimas jums - kai kurie žmonės taip galvoja, 
                                        ir tai yra nesąmonė.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Additional Numerology Insights */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="insights"
                            title="💡 Papildomos Numerologijos Įžvalgos"
                            isOpen={expandedSections['insights'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Papildomos Numerologijos Įžvalgos žiurkė Rat matrix mėgstamiausias')}
                            contentText="numerologija įžvalgos santykiai kelionės priešų metai draugiška astrologija žiurkė rat matrix mėgstamiausias ženklas"
                        >
                            <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                
                                <div>
                                    <p className="font-semibold text-orange-300 mb-2">Freemasonai:</p>
                                    <p className="text-xs mb-2">
                                        Visi Illuminati yra kažkokia Freemason forma, bet ne atvirkščiai - toli nuo to.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">95% Freemason</span> yra Mėlynos Ložės dalis - jie tikrai nežino nieko - 
                                        jie vaidina kostiumus, brolija ir kt.
                                    </p>
                                    <p className="text-xs">
                                        Kiti <span className="font-semibold">5% yra Raudonos Ložės dalis</span> - tik 32 ir 33 laipsniai - 
                                        daug daugiau vyksta. Dauguma literatūros iš Mėlynos Ložės - daugiausia ne slapta. 
                                        Knyga iš Raudonos Ložės būtų įdomi. Dauguma konspiracijų iš Raudonos Ložės.
                                    </p>
                                </div>

                                <div className="border-t border-orange-500/30 pt-3">
                                    <p className="font-semibold text-orange-300 mb-2">8 Dienos ir Sapnai:</p>
                                    <p className="text-xs mb-2">
                                        Kai 8 turi košmarus? 8 dienomis, kai miegi - kai kurie išplėstiniai duomenys.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Matrix maitinasi daugiausia 8 dienomis, kai miegi, nemiegokite tiek daug 8 dieną. 
                                        8 = eat = maitinimas. Nėra neįprasta turėti košmarus 8 dieną, geriausias dalykas yra 
                                        neleisti baimės, jie mėgsta tai, tai juos maitina.
                                    </p>
                                    <p className="text-xs">
                                        Taip pat nemiegokite tiek daug 8 dieną - naudokite druską apsisaugoti aplink savo lovą, 
                                        druskos lempą, violetinę spalvą (apsauginė), gemstones taip pat.
                                    </p>
                                </div>

                                <div className="border-t border-orange-500/30 pt-3">
                                    <p className="font-semibold text-orange-300 mb-2">Violetinė Spalva:</p>
                                    <p className="text-xs mb-2">
                                        Violetinė sujungia raudoną ir mėlyną, taigi viena pusė kalba apie dviejų politinių pusių vienybę. 
                                        Kitoji monetos pusė yra ta, kad jie mėgsta naudoti atvirkštinį - jie skelbia vienybę, bet reiškia priešingai.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Violetinė reiškia apsaugą, susijusi su karališkumu, susijusi su žiniomis = 7 (p=16). 
                                        Kai kurios blogesnės esybės ir žmonės imasi violetinės mantijos dėl daugiau piktų priežasčių.
                                    </p>
                                    <p className="text-xs">
                                        Disney piktosios raganos nešioja juodą ir violetinę. Clinton'o pasidavimo kalba 11 dieną 2016 m. 
                                        atėjo violetinėje ir nuo to laiko buvo violetinė plovimas.
                                    </p>
                                </div>

                                <div className="border-t border-orange-500/30 pt-3">
                                    <p className="font-semibold text-orange-300 mb-2">Santykiai ir Numerologija:</p>
                                    <div className="bg-orange-950/40 rounded p-3 space-y-2 text-xs">
                                        <p><span className="font-semibold">7 ir 9:</span> Nėra griežtai priešai, bet ne geriausi vienas kitam. 
                                        Dažnai destruktyvūs, ypač romantiniai. 9 gali turėti labai neigiamą poveikį 7 santykiuose. 
                                        Abu labai protingi. Ego gali būti problema.</p>
                                        <p><span className="font-semibold">7 ir 7:</span> Kol jie duoda vienas kitam erdvės. 
                                        Gali būti stiprus ryšys dvasiniu intelektualiu lygmeniu.</p>
                                        <p><span className="font-semibold">8 ir 3:</span> Labai gerai sutaria. 
                                        Dauguma numerologų to nepasakys, bet jie labai gerai dirba kartu.</p>
                                        <p><span className="font-semibold">7LP ir 11LP:</span> Arba 7 diena ir 11 diena. 
                                        Susiderinkite taip, kad rastumėte mėnesio dieną, draugišką 5.</p>
                                    </div>
                                </div>

                                <div className="border-t border-orange-500/30 pt-3">
                                    <p className="font-semibold text-orange-300 mb-2">Kitos Įžvalgos:</p>
                                    <div className="bg-orange-950/40 rounded p-3 space-y-2 text-xs">
                                        <p><span className="font-semibold">3-ės:</span> Laikykite burnas uždaromas 4 dieną, koja burnoje, 
                                        būkite žemai priešų energijos metu.</p>
                                        <p><span className="font-semibold">Kelionės:</span> Keliauti ne 5 dieną bus daug lėčiau - 
                                        vėlavimai ir kt. Keliauti vienam - 7 diena taip pat gerai veikia.</p>
                                        <p><span className="font-semibold">Priešų metai:</span> Apsisaugoti save - taip ir ne. 
                                        Žinoti yra pirmas žingsnis, taigi vengti klaidų, kurių kitaip nedarytumėte. 
                                        Nedarykite didelių judesių - ne naujas namas, santuoka, ne įspaudas su ta energija, 
                                        kuri tęsis ilgą laiką. Tuo pačiu metu negalite gyventi po uola, bet tiesiog turėkite tą sąmoningumą, 
                                        kad vengtumėte didžiulių spąstų.</p>
                                        <p><span className="font-semibold">Draugiška numerologija arba astrologija:</span> 
                                        Taigi Nike (28) yra gerai 11-oms. Nedėvėkite Ožkos prekių ženklų Ožkos metais, jei esate Ožka - 
                                        dėvėkite Kiaulės arba Katės prekių ženklus.</p>
                                        <p><span className="font-semibold">Žiurkė:</span> Matrix mėgstamiausias ženklas. 
                                        Jie gali išsisukti su daug, daug naudos, nereiškia, kad 100% jų bus.</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Detailed Number Information */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="detailed-numbers"
                            title="📚 Detalūs Skaičių Aprašymai"
                            isOpen={expandedSections['detailed-numbers'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Detalūs Skaičių Aprašymai skaičiai 1 2 3 4 5 6 7 8 9 11 22 33')}
                            contentText="skaičius 1 2 3 4 5 6 7 8 9 11 22 33 numerologija lifepath gyvenimo kelias"
                        >
                            <div className="bg-teal-900/30 border border-teal-500/40 rounded-lg p-4">
                            <div className="text-sm text-white/90 space-y-6 max-h-[800px] overflow-y-auto">
                                
                                {/* Number 1 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 1 - Vyriškos Energijos Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 1, 10, 19, 28 arba 1 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Pilnas vyriškos energijos - galvos kaip vyras</li>
                                            <li>Labai agresyvus - Aggression prasideda A (1-oji raidė)</li>
                                            <li>Linkęs būti atletiški - Athletic prasideda A</li>
                                            <li>Ginčijasi sportui - Argue prasideda A</li>
                                            <li>Mokosi sunkiai - visada nori daryti savo būdu</li>
                                            <li>Manosi, kad gali apgauti visus, nulaužti visus kodus</li>
                                            <li>Stipriai užsispyręs - visada nori daryti savo būdu</li>
                                            <li>Duoda patarimus, bet jų nepriima</li>
                                            <li>Linkęs būti alkoholikai - Alcoholics prasideda A</li>
                                            <li>Linkęs būti kapitalistai - Capitalism pirmoji balsė A</li>
                                            <li>Gali pabėgti nuo karminės skolos geriau nei dauguma</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li><span className="font-semibold">1 ir 9 yra priešai</span> - blogiausias derinys numerologijoje</li>
                                            <li>8 visada rūpinasi 1 - Master/Slave santykis</li>
                                            <li>1 gerai dera su 11, ypač sporte</li>
                                            <li>1, 4, 7 trikampis</li>
                                            <li>1 ir 6 - stipriausias Master/Slave santykis</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 2 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 2 - Moteriškos Energijos Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 2, 11, 20, 29 arba 2 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">Gimęs 2 arba 20 dieną:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Jūs esate rūpestingi ir labai jautrūs</li>
                                            <li>Jūs esate taikos kūrėjas</li>
                                            <li>Naudojate emocijas daugiau nei logiką</li>
                                            <li>Puikiai kompromisuojate</li>
                                            <li>Jūsų tikslas - rasti harmoningą būdą visiems</li>
                                            <li>Reikia dirbti su savimi pasitikėjimu ir būti šiek tiek drąsesniems</li>
                                            <li>Labai mylintys ir žavūs</li>
                                            <li>Reikia partnerio gyvenime - labai svarbu, kad jis būtų suprantantis</li>
                                            <li>Nėra geros idėjos per daug spaudžti skaičių 2 - jie gali atsakyti greitu temperamentu</li>
                                            <li>Būdamas mylėtojas, ne kovotojas, nekenčiate konfrontacijos ir kompromisuosite, kad išlaikytumėte taiką</li>
                                            <li>Gali būti linkę į nuotaikos svyravimus</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Moteriškos energijos skaičius</li>
                                            <li>Nuo 2000 m. visuomenė tapo politiškai korektiška - perėjimas nuo 1 prie 2 energijos</li>
                                            <li>Labai jautrus - jei pasakysite neteisingą dalyką, 2 visada prisimins</li>
                                            <li>Negalite būti labai tiesūs su žmonėmis, gimusiomis 2 dieną</li>
                                            <li>Taikos skaičius - geriausia diena dėl taikų derybų</li>
                                            <li>Moteriškumo skaičius - moterys, gimusios 2 dieną, turi labai moteriškas savybes</li>
                                            <li>Vyrai, gimę 2 dieną, rūpinasi savo išvaizda, gali būti laikomi moteriškais</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>2, 5, 8 trikampis</li>
                                            <li>2 yra 9 priešas - abu yra sekėjai</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 3 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 3 - Komunikacijos ir Kūrybiškumo Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 3, 12, 21, 30 arba 3 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">3 Dienos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li><span className="font-semibold">Riebalų dienos</span> - 3 yra išraiškos skaičius</li>
                                            <li>Turėkite atvirą namą 3 dieną - 3 yra komunikacijos skaičius, sandorių sudarymo skaičius</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Trumpas dėmesio spanas</li>
                                            <li>Atrodo jaunai - 3 yra jaunystės šaltinis</li>
                                            <li>Labai gerai komunikuoja, išreiškia mintis žodžiu</li>
                                            <li>Balsai labai patrauklūs kitiems</li>
                                            <li>Nusikalstamumo skaičius, korupcija - Crime prasideda C (3-oji raidė)</li>
                                            <li>Gali pabėgti nuo nusikaltimų geriau nei dauguma</li>
                                            <li>Laimingi - L (12), U (21), C (3) = 333</li>
                                            <li>Labai juokingi - Funny pirmoji balsė U</li>
                                            <li>Vaiko energija - 3 yra vaikas</li>
                                            <li>Labiausiai socialus skaičius - geriausia diena vakarėliams</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>3 dera su visais, išskyrus 4</li>
                                            <li>3 ir 5 - geriausi draugai</li>
                                            <li>3 ir 7 - frenemies (50/50)</li>
                                            <li>3, 6, 9 trikampis</li>
                                            <li>3 yra vienintelis 4 priešas</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 4 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 4 - Darbo ir Stabilumo Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 4, 13, 31 arba 4 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">4 Dienos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li><span className="font-semibold">Standumas, darbas, rutina</span></li>
                                            <li><span className="font-semibold">Niekada nepažeiskite įstatymų 4 dienomis</span></li>
                                            <li>Sunkus darbas</li>
                                            <li>Gera diena treniruotis</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Disciplinuoti - visada turi rutiną</li>
                                            <li>Darbininkų bitės - gali eiti visą gyvenimą darant tą patį</li>
                                            <li>Daug policininkų yra 4</li>
                                            <li>Daug turi karinį arba policijos praeitį - M (13-oji raidė, 1+3=4)</li>
                                            <li>Labai materialistiški - Material ir Money prasideda M</li>
                                            <li>Dirba labai sunkiai iki senatvės</li>
                                            <li>Linkę būti konservatyvūs - dirba sunkiai ir nori išlaikyti pinigus</li>
                                            <li>Nėra ryškiausi skaičiai - reikia kartoti veiksmus</li>
                                            <li>Lėtai ir nuosekliai laimi lenktynes</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>4 ir 6 - vienas geriausių santykių numerologijoje</li>
                                            <li>4 ir 9 dera labai gerai</li>
                                            <li>1, 4, 7 trikampis</li>
                                            <li>3 ir 4 nemato akių į akis - Nusikaltėliai ir Policininkai</li>
                                            <li>4 ir 5 nemato akių į akis - 4 mėgsta stabilumą, 5 - laisvę</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 5 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 5 - Laisvės ir Kelionių Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 5, 14, 23 arba 5 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">5 Dienos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li><span className="font-semibold">5 dienos - kalbėkite seksualiai su moterimis</span>. Supraskite, kad protas veikia vibracijomis, kurios atsiskleidžia. Nupieškite paveikslą jos proto viduje. Ką ji vizualizuoja, atsiskleis jos proto viduje.</li>
                                            <li>Eikite į pasimatymus 5 dieną</li>
                                            <li>Pokytis, transformacija ir naujos kryptys</li>
                                            <li>5 yra vibracija, kuri skatina jus patirti gyvenimą per jūsų pojūčius</li>
                                            <li>Labiausiai tikėtina diena, kai įvyks vienos nakties santykiai</li>
                                            <li>Pertrauka nuo rutinos</li>
                                            <li>5 energija mūsų numerologijoje padeda padidinti mūsų seksualinę energiją keliaujant ir judant aplink nuotykiuose</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Labai atviraus proto - 5 forma atvira abiejose pusėse</li>
                                            <li>5 yra viduryje 1-9 sistemos</li>
                                            <li>Kelionės - arba darbui, arba pramogai</li>
                                            <li>Labai gerai atrodo - daug modelių</li>
                                            <li>Mokosi labai greitai - po 7, 5 greičiausiai mokosi</li>
                                            <li>5 yra kaip kompiuteris su greitu procesoriumi, bet be kietojo disko</li>
                                            <li>Problema su atmintimi - Memory pirmoji balsė E (5-oji raidė)</li>
                                            <li>Labai sveikatos sąmoningi - Health pirmoji balsė E</li>
                                            <li>Labai seksualūs - Sex pirmoji balsė E</li>
                                            <li>Visada keičia nuomonę - vienas didžiausių problemų</li>
                                            <li>Gali turėti priklausomybę</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>3 ir 5 - vienas geriausių santykių</li>
                                            <li>2, 5, 8 trikampis</li>
                                            <li>5 yra 4 ir 6 priešas</li>
                                            <li>9 visada seka 5</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Įspėjimai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Atidžiai su STD - gali būti atviri seksualumo atžvilgiu</li>
                                            <li>Geriau nuomotis nei turėti - 5 nėra ilgalaikis dalykas</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 6 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 6 - Šeimos ir Tarnavimo Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 6, 15, 24 arba 6 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Labai namų ir šeimos orientuoti - 6 yra šeimos skaičius</li>
                                            <li>Prijaukinti - mėgsta būti namuose</li>
                                            <li>Sunkūs darbininkai - prisiima kitų atsakomybę</li>
                                            <li>Jauni 6 dažnai yra kilimėlis kitiems</li>
                                            <li>Subrendę vis dar padeda, bet taip, kaip jie mano, kad reikia</li>
                                            <li>Pirmą kartą susitikę 6 bus labai tyli, drovūs</li>
                                            <li>Kai atidarote, jie nebeužsilenkia</li>
                                            <li>Gali priaugti svorio pilve - 6 forma turi didelį pilvą</li>
                                            <li>Linkę būti disleksikai - sakykite eiti kairėn, eina dešinėn</li>
                                            <li>6 viską mato per veidrodį - mato iš kitos pusės</li>
                                            <li>Dauguma moterų galvoja kaip socialistės ir komunistės - O balsė</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>4 ir 6 - geriausias santykis numerologijoje</li>
                                            <li>1 ir 6 - Master/Slave santykis (1 yra master)</li>
                                            <li>3, 6, 9 trikampis</li>
                                            <li>5 ir 6 yra priešai - Heterosexual (E) ir Homosexual (O)</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 7 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 7 - Genijaus ir Mokymosi Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 7, 16, 25 arba 7 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">Mokymasis 7 Asmeniniais Metais:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>7 yra <span className="font-semibold">skaičius traumų, nelaimingų atsitikimų</span></li>
                                            <li>Sutelkite dėmesį mokytis naujų dalykų arba senų dalykų giliau</li>
                                            <li>Matau per iliuzijas ir paslaptis</li>
                                            <li>Turėkite problemas, kurias tikrai norite išspręsti ir išsiaiškinti tais metais</li>
                                            <li>Būkite daugiau (g)enerous ir (p)hilantropy</li>
                                            <li>Įsitraukite į daugiau gilią vidinį darbą ir dvasinį augimą (dalykai už šio pasaulio)</li>
                                            <li>Jūsų fizinė gerovė bus blogesnė, todėl padidinkite poilsio dienas ir sumažinkite fizinį stresą</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Genijai - Genius prasideda G (7-oji raidė)</li>
                                            <li>Labai aukštas IQ lygis, nepriklausomai nuo rasės ir lyties</li>
                                            <li>Ryškus protas, bet kūnas gali sugesti</li>
                                            <li>Blogai sekasi santykiuose - 7 yra vienatvės energija</li>
                                            <li>Nesituokite 7 energijoje</li>
                                            <li>Mokytojai - mokyti 7 yra džiaugsmas</li>
                                            <li>7 reikia tik kelių duonos trupinių, jie patys išsiaiškins</li>
                                            <li>Tech amžiuje 7 pradės klestėti ir tapti milijonieriais</li>
                                            <li>7 gali būti viename rąste 5 metus ir visiškai gerai</li>
                                            <li>Mėgsta izoliaciją, "me time"</li>
                                            <li>Vienas didžiausių problemų - negali komunikuoti su kitais</li>
                                            <li>Labiausiai linkę gauti vėžį, leukemiją</li>
                                            <li>Nėra laimingas skaičius - 7 yra lošimų skaičius</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>7 geriausiai dera su 11 - yra parduotuvė 7-11</li>
                                            <li>7 ir 3 yra frenemies - daugiausiai susituokę ir išsiskyrę</li>
                                            <li>1, 4, 7 trikampis</li>
                                            <li>7 gali derėti su 5, jei duoda vienas kitam erdvės</li>
                                            <li>7 yra 8 priešas</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 8 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 8 - Pinigų ir Galios Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 8, 17, 26 arba 8 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">8 Dienos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li><span className="font-semibold">Mokėkite sąskaitas, loškite 8 dienomis</span></li>
                                            <li>8 yra <span className="font-semibold">galutinė Manifestacija ir Pinigų Dažnis</span></li>
                                            <li>8 = 8 karma, <span className="font-semibold">apribojimų ir limitacijų skaičius</span></li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Pinigų skaičius</li>
                                            <li>Rusija yra tobulas 8 pavyzdys - 8 LP šalis, Ožka (8-asis ženklas)</li>
                                            <li>8 yra didelis viršuje, didelis apačioje, bet labai plonas viduryje</li>
                                            <li>Su 8 arba turite, arba neturite</li>
                                            <li>Daug 8 per visą gyvenimą eina per kalnelius - neturėjo, prarado, atgavo</li>
                                            <li>8 mėgsta boomerang pinigus - mokėkite sąskaitas 8 dieną, grįš atgal</li>
                                            <li>Daug rabinų, kunigų yra 8 - 8 taip pat yra galia</li>
                                            <li>8 nėra religingi, bet yra šalia dėl galios</li>
                                            <li>Gali prarasti ir priaugti svorio labai lengvai</li>
                                            <li>8 taip pat yra karmos skaičius</li>
                                            <li>8 nori padėti 1</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>8 ir 8 nederėtų - vienintelis skaičius taip</li>
                                            <li>8 + 8 = 16, 1+6 = 7, kuris yra 8 priešas</li>
                                            <li>2, 5, 8 trikampis</li>
                                            <li>8 dera su 22 ir 33</li>
                                            <li>8 turi turėti materialistinę pusę - jei bando būti visiškai dvasiniai, gyvenimas bus sunkus</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 9 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 9 - Prisitaikymo ir Užbaigimo Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 9, 18, 27 arba 9 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">9 Dienos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li><span className="font-semibold">Užbaikite projektą 9 dienomis</span></li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">9 Gyvenimo Kelias - Gimęs 9/18/27 dieną:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Jūsų didžiausia dovana gyvenime yra <span className="font-semibold">gebėjimas prisitaikyti prie beveik visko</span></li>
                                            <li>Lengvai prisitaikote kaip chameleonas ir gerai kompromisuojate</li>
                                            <li>Nesugebate gerai valdyti spaudimo, bet gerai duodate patarimus kitiems žmonėms</li>
                                            <li>Galite turėti susidomėjimą praeities gyvenimu - galbūt sprendžiate praeities gyvenimo problemas ir atnešate jas į užbaigimą šiame gyvenime</li>
                                            <li>Jūs esate žavūs ir suprantantys ir turite gebėjimą paveikti kitus, bet taip pat galite būti šalti, kieti ir atsiriboję ir domėtis tik savimi</li>
                                            <li>Nepateikite į blogus įpročius, nes juos bus labai sunku nutraukti</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">9 Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>9 yra prisitaikantys ir eina su srove</li>
                                            <li>Galvokite apie 9 kaip master skaičius mokymuisi. Jei jie praeina šią inkarnaciją, jie pakils lygmeniu</li>
                                            <li>Kai kuriuos galite stebėti realiu laiku žlugant, kai kurie yra daug stabilesni ir judės aukštyn</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Didžiausias įgūdis - gebėjimas prisitaikyti prie bet kokios situacijos</li>
                                            <li>Taip pat vienas didžiausių silpnybių</li>
                                            <li>9 visada prisitaiko prie aplinkos - veidrodis</li>
                                            <li>Jei 9 aplink šiukšles, tampa šiukšlėmis</li>
                                            <li>Jei 9 aplink gerus, stiprius žmones, tampa tuo pačiu</li>
                                            <li>Nėra 9 geriausias nieko - sportas, intelektiniai siekiai - nebent kažkas aplink buvo toks</li>
                                            <li>9 visada seka 5 - 9 yra labiausiai paviršutiniški žmonės</li>
                                            <li>9 geriau būtų vienas nei su kažkuo, kas neatitinka jų standartų</li>
                                            <li>5 geriausiai atrodo, todėl 9 seka 5</li>
                                            <li>9 LP moterys susituokia dėl išvaizdos</li>
                                            <li>Linkę turėti priklausomybę - Pills pirmoji balsė I</li>
                                            <li>2-asis protingiausias skaičius - Intelligence prasideda I</li>
                                            <li>9 LP turi gerai atrodančius draugus</li>
                                            <li>Blogai tvarko spaudimą - gali būti vice prezidentas, bet ne prezidentas</li>
                                            <li>9 nederėtų veikti 9 energijoje</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>9 yra 1 absoliutus priešas - blogiausias priešų derinys</li>
                                            <li>9 taip pat yra 2, 11, 22 priešas</li>
                                            <li>3, 6, 9 trikampis</li>
                                            <li>9 ir 4 dera gerai</li>
                                            <li>9 turėtų naudoti 4 kaip pagrindą, ne 1</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 11 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Master Skaičius 11 - Emocijų Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 11, 20, 29 arba 11 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">11 Dienos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li><span className="font-semibold">11 energija - STAIGŪS ĮVYKIAI</span></li>
                                            <li>11 yra <span className="font-semibold">konflikto ir emocijų skaičius</span></li>
                                            <li><span className="font-semibold">Neskraidykite 11 dienomis</span></li>
                                            <li>Emociniai testai yra dažni 11 metų cikluose</li>
                                            <li>11 = 11 <span className="font-semibold">žaibo greičio manifestacija</span></li>
                                            <li>Granatas (Pomegranate)</li>
                                            <li>11 asmeniniai metai - požiūris į gyvenimą visiškai keičiasi. <span className="font-semibold">Dideli poslinkiai</span>.</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">11 Gyvenimo Kelias:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Žmonės, gimę 11 arba 29 dieną, yra <span className="font-semibold">labai emocingi</span></li>
                                            <li>Turite <span className="font-semibold">labai gilias akis</span></li>
                                            <li>Michael Jordan ir Kobe Bryant turi <span className="font-semibold">žudikų instinktus</span> dėl 11</li>
                                            <li>Žmonės su 1LP turi problemų su alkoholiu</li>
                                            <li><span className="font-semibold">Didžiausias raktas yra subalansuoti savo energiją</span></li>
                                            <li>Kaip 11 Gyvenimo Kelias, jūs <span className="font-semibold">jaučiate žmonių energiją</span>. Kai jie pyksta, laimingi. Žmonės ateina pas jus ir pradeda pasakoti savo problemas, pradeda pasakoti viską, kas negerai su jais. Nes jie jaučiasi atviri, nes jie jaučia tą energiją su jumis.</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Emocingi - geriausias būdas sudeginti emocijų energiją - mankšta</li>
                                            <li>Daug 11 yra įtempti žmonės - kai kurie vadina juos energijos vampyrais</li>
                                            <li>Reikia būdo sudeginti emocijų energiją - mankšta</li>
                                            <li>Turintys daug charizmos - žmonės traukiami prie tos energijos</li>
                                            <li>11 gauna energiją iš 3 - charizma, išorinis pobūdis</li>
                                            <li>11 gauna iš 7 - gebėjimas domėtis okultu (numerologija, astrologija)</li>
                                            <li>11 gali būti kultų lyderiai dėl kulto asmenybių</li>
                                            <li>Turi poreikį keisti pasaulį - įgimtas poreikis</li>
                                            <li>Problema - kai kurie 11 negali padėti sau, kaip gali padėti kitiems</li>
                                            <li>Reikia išmokti kontroliuoti emocijų energiją</li>
                                            <li>Daug mokyklų šaudytojų yra 11</li>
                                            <li>Turintys senas sielas - akys turi tą kibirkštį</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>11 geriausiai dera su 7 - yra parduotuvė 7-11</li>
                                            <li>11 dera su 1</li>
                                            <li>11 yra 9 priešas - dabar suprantate, kodėl įvyko 9-11</li>
                                            <li>11, 22, 33 trikampis</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Įspėjimai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Neskraidykite 11 dieną - lėktuvai krenta šią dieną</li>
                                            <li>Elektra turi problemų 11 dienomis</li>
                                            <li>Viskas, susijusi su elektronika, turi problemų 11 dienomis</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 22 */}
                                <div className="pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Master Skaičius 22 - Vidinio Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 22 arba 22 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">22 Gyvenimo Kelias:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li><span className="font-semibold">Mr. Manifest</span></li>
                                            <li>Žmonės, gimę 22 dieną, yra <span className="font-semibold">labai raumeningi</span></li>
                                            <li>Stato ant žinių</li>
                                            <li>Gerai stato žmones, kūnus, kariuomenę (generolai), architektūrą</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Vidinio skaičius - gali kalbėti su kita puse (dvasiomis, vaiduokliais)</li>
                                            <li>Kartais tos energijos iš kitos pusės nepalieka jų vienos</li>
                                            <li>Daug 22, kurie pasako žmonėms, kad gali girdėti dalykus, baigia psichiatrinėse ligoninėse</li>
                                            <li>22 neturėtų pasakyti žmonėms, kad gali tai daryti</li>
                                            <li>22 yra vandens skaičius - vanduo yra master statytojas</li>
                                            <li>Vanduo duoda viską gyvybę, eroduoja su ledu, eroduoja su lietumi</li>
                                            <li>Vanduo statė, naikina, duoda gyvybę viskam</li>
                                            <li>Vanduo taip pat geriausias laidininkas planetoje</li>
                                            <li>22 yra "galutinis rezultatas pateisina priemones" tipo žmonės</li>
                                            <li>Daug istorijos 22 buvo laikomi monstrais, blogiu</li>
                                            <li>Daug 22 tampa generolais - generolai yra "galutinis rezultatas pateisina priemones"</li>
                                            <li>Daug 22 tampa žudikais</li>
                                            <li>Labiausiai materialistiškas master skaičius - bando gauti apmokėjimą</li>
                                            <li>Gimusieji 22 dieną dažnai yra labai raumeningi</li>
                                            <li>22 yra vienintelis skaičius, kuris statė skaičius aplink jį - 21 ir 23</li>
                                            <li>Gimusieji 22 dieną statė žmones aplink juos</li>
                                            <li>Geriausi treneriai, vadybininkai, generolai yra labai geri statant žmones aplink juos</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>22 geriausiai dera su 8</li>
                                            <li>11, 22, 33 trikampis</li>
                                        </ul>
                                        <p className="font-semibold text-teal-200 mt-2">Įspėjimai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Teroristiniai išpuoliai vyksta ir 22 dieną, ne tik 11</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 33 */}
                                <div className="border-b border-teal-500/30 pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Master Skaičius 33 - Įtakos Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 33 arba 33 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">33 Gyvenimo Kelias:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>33 yra <span className="font-semibold">master įtakotojas</span>. Jie čia mokyti.</li>
                                            <li><span className="font-semibold">Senoji siela</span></li>
                                            <li><span className="font-semibold">Kelio kūrėjai</span>. Jie išsiaiškina dalykus, kurių kiti žmonės negali.</li>
                                            <li>33 yra <span className="font-semibold">padidiniklis</span>. Ar tai Tigras, Mergelė, Beždžionė - tai padidina.</li>
                                            <li>Norite <span className="font-semibold">įtakoti kiek įmanoma daugiau</span></li>
                                            <li>33 gyvenimo kelio tikslas yra <span className="font-semibold">įtikinti žmones, kad jūsų mąstymo būdas yra teisingas, o jų - neteisingas</span>.</li>
                                            <li>33 žiūri į pasaulį kaip į <span className="font-semibold">šeimą, kurią reikia prižiūrėti</span></li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Number 13 */}
                                <div className="pb-4">
                                    <h5 className="text-teal-300 font-bold mb-2 text-base">Skaičius 13 - Matrix Skaičius</h5>
                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimimo dienos:</span> 13 arba 13 Gyvenimo Kelias</p>
                                        <p className="font-semibold text-teal-200">13 Dienos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>13 yra <span className="font-semibold">Matrix skaičius</span></li>
                                            <li>13 = 33</li>
                                            <li><span className="font-semibold">Spręskite pinigų klausimus 13 dieną</span></li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Numerology Relationship Chart */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="relationship-chart"
                            title="📊 Numerologijos Skaičių Santykių Diagrama"
                            isOpen={expandedSections['relationship-chart'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Numerologijos Skaičių Santykių Diagrama santykiai')}
                        >
                            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-lg p-4">
                            
                            {/* Relationship Grid */}
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full">
                                    <table className="w-full text-xs border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="p-1 text-white/70 font-semibold border border-purple-500/30 bg-purple-900/40 w-[40px] h-[40px]"></th>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(num => (
                                                    <th key={num} className="p-2 text-white font-bold border border-purple-500/30 bg-purple-900/40 w-[40px] h-[40px]">
                                                        {num}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(rowNum => (
                                                <tr key={rowNum}>
                                                    <td className="p-2 text-white font-bold border border-purple-500/30 bg-purple-900/40 text-center w-[40px] h-[40px]">
                                                        {rowNum}
                                                    </td>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(colNum => {
                                                        const relationship = getNumerologyRelationship(rowNum, colNum);
                                                        // Get emoji/symbol for relationship type
                                                        const getRelationshipSymbol = (rel) => {
                                                            if (!rel) return '';
                                                            switch(rel) {
                                                                case 'enemy': return '❌';
                                                                case 'bad': return '⚠️';
                                                                case 'neutral': return '⚪';
                                                                case 'good': return '✅';
                                                                case 'best': return '⭐';
                                                                case 'ms': return '💜';
                                                                default: return '';
                                                            }
                                                        };
                                                        return (
                                                            <td 
                                                                key={colNum} 
                                                                onClick={() => handleRelationshipClick(rowNum, colNum)}
                                                                className={`p-0 text-center w-[40px] h-[40px] transition-all duration-200 cursor-pointer hover:opacity-80`}
                                                                style={relationship ? {
                                                                    background: relationship === 'enemy' ? 'radial-gradient(circle, #f87171 0%, #ef4444 40%, #dc2626 100%)' :
                                                                                relationship === 'bad' ? 'radial-gradient(circle, #fb923c 0%, #f97316 40%, #ea580c 100%)' :
                                                                                relationship === 'neutral' ? 'radial-gradient(circle, #facc15 0%, #eab308 40%, #ca8a04 100%)' :
                                                                                relationship === 'good' ? 'radial-gradient(circle, #34d399 0%, #10b981 40%, #059669 100%)' :
                                                                                relationship === 'best' ? 'radial-gradient(circle, #22d3ee 0%, #06b6d4 40%, #0891b2 100%)' :
                                                                                relationship === 'ms' ? 'radial-gradient(circle, #a78bfa 0%, #8b5cf6 40%, #7c3aed 100%)' :
                                                                                undefined,
                                                                    boxShadow: relationship ? 'inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.2)' : undefined,
                                                                    border: relationship ? '2px solid' : '2px solid rgba(107, 114, 128, 0.3)',
                                                                    borderColor: relationship === 'enemy' ? 'rgba(248, 113, 113, 1)' :
                                                                                 relationship === 'bad' ? 'rgba(251, 146, 60, 1)' :
                                                                                 relationship === 'neutral' ? 'rgba(250, 204, 21, 1)' :
                                                                                 relationship === 'good' ? 'rgba(52, 211, 153, 1)' :
                                                                                 relationship === 'best' ? 'rgba(34, 211, 238, 1)' :
                                                                                 relationship === 'ms' ? 'rgba(167, 139, 250, 1)' :
                                                                                 'rgba(107, 114, 128, 0.3)'
                                                                } : {
                                                                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.5) 0%, rgba(17, 24, 39, 0.5) 100%)',
                                                                    border: '2px solid rgba(107, 114, 128, 0.3)'
                                                                }}
                                                                title={`${rowNum} ir ${colNum}: ${getRelationshipLabel(relationship)} (Click to change)`}
                                                            >
                                                                <span className="text-lg font-bold" style={{ 
                                                                    textShadow: relationship ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                                                                    filter: relationship ? 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' : 'none'
                                                                }}>
                                                                    {getRelationshipSymbol(relationship)}
                                                                </span>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Number Cards */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="number-cards"
                            title="🎴 Skaičių Kortelės"
                            isOpen={expandedSections['number-cards'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Skaičių Kortelės skaičiai 1 2 3 4 5 6 7 8 9 11 22 33')}
                            contentText="skaičius 1 2 3 4 5 6 7 8 9 11 22 33 numerologija lifepath gyvenimo kelias"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 28, 33].map(num => {
                                const custom = getItemData('number', num);
                                const defaultData = numberDescriptions[num] || {};
                                const displayData = custom || defaultData;
                                const isEditing = editingItem === `number_${num}`;

                                return (
                                    <motion.div
                                        key={num}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-bold text-yellow-400">Skaičius {num}</h4>
                                            {!isEditing && (
                                                <button
                                                    onClick={() => startEditing('number', num, defaultData)}
                                                    className="text-purple-300 hover:text-purple-100 text-sm"
                                                >
                                                    {t.edit}
                                                </button>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Gyvenimo Kelias:</label>
                                                    <textarea
                                                        value={editData.lifePath || ''}
                                                        onChange={(e) => handleTextInput('lifePath', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        rows="2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Likimas:</label>
                                                    <textarea
                                                        value={editData.destiny || ''}
                                                        onChange={(e) => handleTextInput('destiny', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        rows="2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Asmenybė:</label>
                                                    <textarea
                                                        value={editData.personality || ''}
                                                        onChange={(e) => handleTextInput('personality', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        rows="2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Siela:</label>
                                                    <textarea
                                                        value={editData.soul || ''}
                                                        onChange={(e) => handleTextInput('soul', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        rows="2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Asmeninio Meto Diena:</label>
                                                    <textarea
                                                        value={editData.personalYearDay || ''}
                                                        onChange={(e) => handleTextInput('personalYearDay', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        rows="3"
                                                        placeholder={t.placeholder.description}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveItemData('number', num, editData)}
                                                        className="flex-1 px-3 py-2 bg-green-500/60 hover:bg-green-500/80 text-white rounded-lg text-sm font-semibold"
                                                    >
                                                        {t.save}
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="flex-1 px-3 py-2 bg-red-500/60 hover:bg-red-500/80 text-white rounded-lg text-sm font-semibold"
                                                    >
                                                        {t.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-sm text-white/80">
                                                <div>
                                                    <span className="text-yellow-400 font-semibold">Gyvenimo Kelias:</span>
                                                    <p className="mt-1">{displayData.lifePath || 'Nėra duomenų'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-yellow-400 font-semibold">Likimas:</span>
                                                    <p className="mt-1">{displayData.destiny || 'Nėra duomenų'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-yellow-400 font-semibold">Asmenybė:</span>
                                                    <p className="mt-1">{displayData.personality || 'Nėra duomenų'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-yellow-400 font-semibold">Siela:</span>
                                                    <p className="mt-1">{displayData.soul || 'Nėra duomenų'}</p>
                                                </div>
                                                {displayData.personalYearDay && (
                                                    <div>
                                                        <span className="text-yellow-400 font-semibold">Asmeninio Meto Diena:</span>
                                                        <p className="mt-1">{displayData.personalYearDay}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                            </div>
                        </AccordionSection>
                    </motion.div>
                )}

                {/* Western Zodiac Tab */}
                {((activeTab === 'western' || searchQuery.trim()) && categoryHasMatches('Vakarietiškas Zodiakas', 'vakarietiškas zodiakas zodiako ženklai astrologija karma reinkarnacija')) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Vakarietiškas Zodiakas</h3>
                        
                        {/* Libra and Maldek */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="libra-maldek"
                            title="♎ Svarstyklės (Libra) ir Maldek"
                            isOpen={expandedSections['libra-maldek'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Svarstyklės Libra Maldek')}
                        >
                            <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <div>
                                    <p className="font-semibold text-purple-300 mb-2">Valdančioji Planeta:</p>
                                    <p className="text-xs mb-2">
                                        99% astrologų mano, kad Svarstyklės valdomos Veneros - <span className="font-semibold">jie klysta abiem atvejais</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Planeta, kuri valdė Svarstyklės, buvo <span className="font-semibold">MALDEK</span>, 
                                        dabar sunaikinta, o jos liekanos dabar vadinamos <span className="font-semibold">ASTEROIDŲ JUOSTA</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Svarstyklės yra 7-asis ženklas - <span className="font-semibold">nėra prasmės, kad tai būtų meilės ir santykių ženklas</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Tai viena iš priežasčių, kodėl Svarstyklės yra <span className="font-semibold">labiausiai nesuprantamas zodiako ženklas</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Jei atkreipsite dėmesį, jie visada paliks užuominas ir įdės <span className="font-semibold">VISKĄ AIŠKIAI MATOMAI</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Vienas didžiausių pop kultūros franšizių pasaulyje yra: <span className="font-semibold">STAR WARS</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Originaliame Star Wars filme jie parodė, kad Princesės Leia namų planeta <span className="font-semibold">ALDERAAN</span> buvo <span className="font-semibold">SPROGDINTA</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Taip atsitiko, kad Princesė Leia, kurią vaidino aktorė Carrie Fisher, gimė po <span className="font-semibold">Svarstykių</span> ženklu.
                                    </p>
                                    <p className="text-xs">
                                        Planeta (ALDE)raan ir M(ALDE)K - jie įdėjo (paslėptą) aiškiai matomai.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Why No 2 Life Path */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="no-2-lifepath"
                            title="❓ Kodėl Nėra 2 Gyvenimo Kelio?"
                            isOpen={expandedSections['no-2-lifepath'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Kodėl Nėra 2 Gyvenimo Kelio')}
                        >
                            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <div>
                                    <p className="font-semibold text-indigo-300 mb-2">Atsakymas Paslėptas Aiškiai Matomai:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Matricos skaičius yra 13</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Jei pažiūrėsite į raidę <span className="font-semibold">B</span> (didžioji B).
                                    </p>
                                    <p className="text-xs mb-2">
                                        Pažiūrėkite savo proto akyje - B, tada padalinkite ją ir pažiūrėkite, kas liko - <span className="font-semibold">1 ir 3</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Dabar sudėkite tuos 1 ir 3 kartu - gaunate didžiąją B.
                                    </p>
                                    <p className="text-xs mb-2">
                                        B kaip 2-oji raidė. Kitas Matricos reikšmė yra 1.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Pažiūrėkite, kaip <span className="font-semibold">MOTERYS yra vartai per gimimus (WOM)b</span> į fizinį pasaulį.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Taigi <span className="font-semibold">MATRICOJE nėra 2 gyvenimo kelių</span>, nes esate matricos viduje.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Štai kodėl mėnesio 2-oji gali būti labai reikšminga.
                                    </p>
                                    <p className="text-xs">
                                        Iki tam tikro masto - <span className="font-semibold">Vasaris</span> gali būti reikšmingas - 2.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Matrix Energy Harvesting */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="matrix-energy"
                            title="🌐 Matricos Energijos Derlius"
                            isOpen={expandedSections['matrix-energy'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Matricos Energijos Derlius Matrix')}
                        >
                            <div className="bg-gray-900/30 border border-gray-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-300 mb-2">Kaip Matrica Maitinasi:</p>
                                    <p className="text-xs mb-2">
                                        Pati <span className="font-semibold">Matrica maitinasi mūsų energija, mūsų emocine energija</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Kaip filme "Matrica" informavo visus - mes esame kaip <span className="font-semibold">Baterijos</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Daug šių spąstų - priešų energijos, seksualiniai spąstai, nes <span className="font-semibold">seksas yra vartai žemėje per moteris</span>, 
                                        turite būti labai atsargūs.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Spąstai, sukurti sukurti situacijas - konfliktus - baimę - neapykantą - meilę, 
                                        kad <span className="font-semibold">PASIEKTŲ TĄ ENERGIJĄ</span>.
                                    </p>
                                </div>
                                
                                <div className="border-t border-gray-500/30 pt-3">
                                    <p className="font-semibold text-gray-300 mb-2">Elito Bandymai Imituoti Matricą:</p>
                                    <p className="text-xs mb-2">
                                        Elitas bandė imituoti matricą daug būdų, nes jie nori būti kaip Dievas. 
                                        Jie ketina kištis į dalykus kaip Genetika, Klonavimas.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Derlius emocinės energijos, bet jie taip pat bando šnipinėti visus ir viską su technologija, 
                                        bet matrica turi pažangesnį būdą tai daryti.
                                    </p>
                                </div>

                                <div className="border-t border-gray-500/30 pt-3">
                                    <p className="font-semibold text-gray-300 mb-2">Matricos Regėjimas:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Viskas, kas atspindi šviesą, gali matyti per</span> - 
                                        ir štai kodėl vienintelis galbūt aklasis matricos taškas yra <span className="font-semibold">GRYNOJE TAMSOJE</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        D + ARK - kaip žmonės su kibirkštimi, vėl ARK akyse.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Žmonės su ta kibirkštimi akyje - matote, tie žmonės turi <span className="font-semibold">SIELAS</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Akys yra siela</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Niekas nėra 100% Matricoje, net kontrolė.
                                    </p>
                                    <p className="text-xs">
                                        Visada yra ta kibirkštis per TAMSUMĄ, jei galite matyti Matricos viduje.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Colors and Vibrational Energies */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="colors-vibrations"
                            title="🎨 Spalvos ir Vibracinės Energijos"
                            isOpen={expandedSections['colors-vibrations'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Spalvos Vibracinės Energijos Colors')}
                        >
                            <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                <div>
                                    <p className="font-semibold text-emerald-300 mb-2">Raudona (Red):</p>
                                    <p className="text-xs mb-2">
                                        R(18/9) + E(5) + D(4) = 18/1+8 = <span className="font-semibold">9</span>
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">1 gyvenimo kelio/energijos turėtų vengti dėvėti raudoną</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Raudona susijusi su <span className="font-semibold">šaknies čakra</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Raudona yra <span className="font-semibold">lengviausia spalva korupcijai ir geismui</span>.
                                    </p>
                                    <p className="text-xs">
                                        Pvz.: Kalifornija - pilna raudonų medžių, korupcijos ir geismo.
                                    </p>
                                </div>

                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Oranžinė (Orange):</p>
                                    <p className="text-xs mb-2">
                                        O(15/6) + R(18/9) + A(1) + N(14/5) + G(7) + E(5) = <span className="font-semibold">33/6</span>
                                    </p>
                                    <p className="text-xs mb-2">
                                        Oranžinė gera <span className="font-semibold">namams</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Oranžinės lempos ir apšvietimas yra geri namams.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Oranžinė projektuoja <span className="font-semibold">pasitikėjimą</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Žmogus, kuris sukūrė krepšinio kamuolį, buvo <span className="font-semibold">33LP</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        NBA buvo sukurtas <span className="font-semibold">6 dieną</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Kur 33/6 oranžinėje rodo realiame gyvenime.
                                    </p>
                                    <p className="text-xs">
                                        O(RA)NGE - <span className="font-semibold">RA yra SAULĖS DIEVAS</span>.
                                    </p>
                                </div>

                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Violetinė (Purple):</p>
                                    <p className="text-xs mb-2">
                                        Violetinė sumažina iki <span className="font-semibold">7</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Violetinė gera <span className="font-semibold">intelektui</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Violetinė gera <span className="font-semibold">apsaugai, dvasinei apsaugai</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Vizualizuokite violetinį skydą/aurą aplink jus apsaugai.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Norėdami išvalyti kažką, galvokite apie <span className="font-semibold">VIOLETINĘ liepsną</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Violetinė yra <span className="font-semibold">karališkumas</span>.
                                    </p>
                                    <p className="text-xs">
                                        Dauguma žmonių nėra matę TIKROJO violetinio karališkumo - tie, kuriuos matėme, yra sukčiai, 
                                        dėvinčys violetinį karališkumą.
                                    </p>
                                </div>

                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Violetinė (Violet):</p>
                                    <p className="text-xs mb-2">
                                        Violetinė - <span className="font-semibold">KARŪNOS čakros</span> spalva.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Intensyvesnė spalva nei violetinė (purple).
                                    </p>
                                    <p className="text-xs">
                                        Tik <span className="font-semibold">keli žmonės pasaulyje</span> gali atidaryti karūnos čakrą.
                                    </p>
                                </div>

                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Indigo (Indigo):</p>
                                    <p className="text-xs mb-2">
                                        Indigo - <span className="font-semibold">Trečiosios akies</span> spalva.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Jei užsikabinate sunkiame uždavinyje, pažiūrėkite arba vizualizuokite <span className="font-semibold">INDIGO arba VIOLETINĘ</span> galvoje.
                                    </p>
                                    <p className="text-xs">
                                        Turėtumėte išspręsti problemą per <span className="font-semibold">7-33 minutes</span>.
                                    </p>
                                </div>

                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Spalvos su E Reikšme:</p>
                                    <p className="text-xs mb-2">
                                        25-2 yra atviras skaičius. 5 yra atviras skaičius. Jie neužsidaro.
                                    </p>
                                    <p className="text-xs mb-2">
                                        R(E)D, GR(E)(E)N, Y(E)LLOW - visos turi <span className="font-semibold">E reikšmę</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Dvyniai (Gemini) linkę į <span className="font-semibold">psichikos ligas</span>.
                                    </p>
                                    <p className="text-xs">
                                        Nors gegužės 25 d. turi neigiamų, kai kurie teigiami šios datos dalykai: 
                                        Star Wars buvo sukurtas tą dieną, atnešė naują viltį. 
                                        Lord of the Rings buvo sukurtas tą datą.
                                    </p>
                                </div>

                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Priešų Laikas ir Ekstremali Sėkmė:</p>
                                    <p className="text-xs mb-2">
                                        Gary pasakė GG33 Gold, bet <span className="font-semibold">5-9 minutes prieš jūsų PRIEŠŲ laiką</span>, 
                                        turite <span className="font-semibold">EKSTREMALIĄ SĖKMĘ</span> savo pusėje.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Pvz.: Aš esu Tigras, 3-5PM yra mano priešų ženklas. 
                                        Taigi <span className="font-semibold">2:50-2:59 PM</span> turėsiu ekstremalią sėkmę.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Kodėl turiu ekstremalią sėkmę tame laiko tarpelyje?
                                    </p>
                                    <p className="text-xs mb-2">
                                        Matrica nustato <span className="font-semibold">spąstą spąste</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Jei pasiekiu kažką sėkmingo tame 2:50-2:59 laiko tarpelyje ir tada bandau tęsti po to, 
                                        kai pasiekia 3 PM, galiu viską prarasti, nes dabar esu priešų laike.
                                    </p>
                                    <p className="text-xs">
                                        99% žmonių to nežino, todėl jie tampa sėkmingi prieš priešų laiką ir tada praranda viską priešų laike.
                                    </p>
                                </div>

                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Žalia Spalva:</p>
                                    <p className="text-xs mb-2">
                                        Jei pažiūrėtume į balses E E vėl - 5.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Žalia yra svarbiausia spalva Žemei</span> - E-arth.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Raidės E-arth yra <span className="font-semibold">PERDĖSTYTOS</span> į Heart (Širdis).
                                    </p>
                                    <p className="text-xs mb-2">
                                        Širdies čakra yra žalios spalvos ir... Dauguma Gyvačių turi <span className="font-semibold">žalias akis</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Jie yra tie, kurie gali matyti, ko kiti negali.
                                    </p>
                                    <p className="text-xs">
                                        Tam tikras procentas žmonių, gimusių Gyvatės metais, turi <span className="font-semibold">žalias akis</span>.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Age of Aquarius */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="age-aquarius"
                            title="♒ Vandenio Amžius (Age of Aquarius)"
                            isOpen={expandedSections['age-aquarius'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Vandenio Amžius Age of Aquarius')}
                        >
                            <div className="bg-cyan-900/30 border border-cyan-500/40 rounded-lg p-4">
                            <div className="text-sm text-white/90 space-y-4">
                                <div>
                                    <p className="font-semibold text-cyan-300 mb-2">Amžiaus Pradžia:</p>
                                    <p>
                                        Dabar esame Vandenio amžiuje nuo <span className="font-semibold">9/11/2001</span>. 
                                        Tą dieną atliktas ritualas simboliškai atnešė Vandenio amžių - 11-ąjį ženklą. 
                                        Dvynių bokštai buvo nugriauti, reprezentuodami Vandenio amžiaus pradžią. 
                                        Tai įvyko po Mergelės ženklu, kuris yra priešingas Žuviai. 
                                        Mes palikome Žuvies amžių už nugaros.
                                    </p>
                                </div>
                                
                                <div className="border-t border-cyan-500/30 pt-3">
                                    <p className="font-semibold text-cyan-300 mb-2">Vandenio Charakteristikos:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li><span className="font-semibold">11-asis ženklas</span> - Master skaičius, emocijų skaičius</li>
                                        <li><span className="font-semibold">Valdomas Saturno</span> - apribojimų planeta, valdžia, sistema, kontrolė</li>
                                        <li><span className="font-semibold">Paradoksas:</span> Vandenio yra maištingiausias ženklas, bet valdomas Saturno (apribojimų)</li>
                                        <li><span className="font-semibold">Bėglys</span> - labiausiai linkęs maištauti prieš vyriausybę</li>
                                        <li><span className="font-semibold">Atviraus proto</span> - vienas iš labiausiai atvirų ženklų, ypač žinių atžvilgiu</li>
                                        <li><span className="font-semibold">Apribotos emocijos</span> - sunkiai išreiškia emocijas ir jausmus</li>
                                        <li><span className="font-semibold">Blogiausias zodiakas santykiams</span> - labiau atsiribojęs</li>
                                        <li><span className="font-semibold">Technologija ir futurizmas</span> - kompiuteriai, virtuali realybė, kvantinė fizika, nanotechnologija</li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-cyan-500/30 pt-3">
                                    <p className="font-semibold text-cyan-300 mb-2">Elito Planas:</p>
                                    <p>
                                        Elitas planavo tai <span className="font-semibold">400 metų</span> iš anksto. 
                                        1600 m. Francis Bacon išleido "Mokslinio Metodo" knygą. 
                                        Vidutinis žmogus žinojo apie astrologiją ir metafiziką, dabar tai laikoma prietaru. 
                                        Jie norėjo pakeisti metafiziką mokslu, kad žmonės ieškotų atsakymų pas mokslinius autoritetus.
                                    </p>
                                </div>
                                
                                <div className="border-t border-cyan-500/30 pt-3">
                                    <p className="font-semibold text-cyan-300 mb-2">Saturnas ir Saulė:</p>
                                    <p>
                                        Saturnas ir Saulė yra dvi svarbiausios planetos astrologijoje. 
                                        Saturnas valdo Ožiaragį ir Vandenį. Matrix reikia Ožiaragių valdžioje, 
                                        kad išlaikytų struktūrą, ir Vandenio kaip maištininkų, kad subalansuotų - revoliucija.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Relationships and Compatibility */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="relationships"
                            title="💑 Santykiai ir Suderinamumas"
                            isOpen={expandedSections['relationships'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Santykiai Suderinamumas Relationships')}
                        >
                            <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <div>
                                    <p className="font-semibold text-purple-300 mb-2">Numerologijos Suderinamumas:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>Turėti tuos pačius skaičius gimimo datą, bet skirtinga tvarka, sukuria ryšį, ypač jei tas pats gyvenimo kelias</li>
                                        <li>Poravimas zodiako ženklų naudojant numerologijos draugų/priešų sistemą turi tiesos</li>
                                        <li>Pvz: Aries (1-asis ženklas) geriau dera su Leo (5-asis ženklas) nei su Sagittarius (9-asis ženklas)</li>
                                        <li>Santykiai gali veikti, jei gyvenimo keliai puikiai dera, nepaisant priešų karminių dienų</li>
                                        <li><span className="font-semibold">Gyvenimo kelias visada vyrauja</span></li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-purple-500/30 pt-3">
                                    <p className="font-semibold text-purple-300 mb-2">Master-Slave Santykiai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>8 rūpinasi 1</li>
                                        <li>1 ir 6 - vyriškos energijos ir šeimos energijos</li>
                                        <li>1 yra namų lyderis</li>
                                        <li><span className="font-semibold">1 ir 6 yra stipriausias master-slave santykis</span></li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-purple-500/30 pt-3">
                                    <p className="font-semibold text-purple-300 mb-2">Trines/Triads:</p>
                                    <p className="text-xs">
                                        Tie patys zodiako ženklai nėra geriausias derinys. Geriausias derinys yra per trines/triads 
                                        dėl balanso. Energija trine yra 120 laipsnių, todėl energija geriausiai perduodama tokiu būdu. 
                                        Tie patys ženklai turi puikų kameradiškumą/supratimą, bet santykių atžvilgiu tai nėra geriausia.
                                    </p>
                                </div>
                                
                                <div className="border-t border-purple-500/30 pt-3">
                                    <p className="font-semibold text-purple-300 mb-2">Sielos Draugai (Soulmates):</p>
                                    <p className="text-xs mb-2">
                                        Sielos susiję su karma. Jie visada traukia vienas kitą, kaip karma - kas eina ratu, grįžta ratu, 
                                        sukuria kilpą. Bet kas turi sielą, renka karminį skolą. Sielos draugai ne visada romantiniai - 
                                        tai klaidinga nuomonė. Kartais jie tiesiog turi stiprų ryšį per skirtingus gyvenimus, gali vaidinti 
                                        skirtingus vaidmenis vienas kitam. Visada traukia vienas kitą.
                                    </p>
                                    <p className="text-xs">
                                        <span className="font-semibold">Karminiai santykiai</span> yra daugiau neigiami. 
                                        Pvz: tėvas turi vaiką, kuris yra priešo ženklas - tai neigiamas karminis santykis šeimoje.
                                    </p>
                                </div>
                                
                                <div className="border-t border-purple-500/30 pt-3">
                                    <p className="font-semibold text-purple-300 mb-2">Žiurkė ir Jautis (Kinų Zodiakas):</p>
                                    <p className="text-xs">
                                        Žiurkė ir Jautis yra kaip Matrix pora. Jie yra sielos draugai, bet gali būti daug toksiškų 
                                        elementų jų santykiuose. Jautis gali pavydėti, kad Žiurkė rodo daug meilės kitiems ženklams.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Technology and Gemini */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="technology-gemini"
                            title="💻 Technologija ir Dvyniai (Gemini)"
                            isOpen={expandedSections['technology-gemini'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Technologija Dvyniai Gemini Technology')}
                        >
                            <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    Internetas nebuvo prieinamas visuomenei, kol WWW (World Wide Web) nebuvo sukurtas 
                                    <span className="font-semibold"> 7LP Dvynių</span>. Dvyniai ir Vandenys yra oro ženklai. 
                                    Dvynių išradimas paleido mus į naują informacijos amžių.
                                </p>
                                <p>
                                    World Wide Web skiriasi nuo paties interneto. Tai kaip greitkelis, sudarytas iš hipernuorodų, 
                                    leidžiančių prieiti prie interneto. Kadangi dauguma žmonių prieina prie interneto per WWW, 
                                    jis laikomas turinčiu stiprią Dvynių energiją.
                                </p>
                                <div className="bg-blue-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-blue-300 mb-1">Dvynių Dvilypumas:</p>
                                    <p className="text-xs">
                                        Dvyniai taip pat yra ženklas, labiausiai linkęs prie psichinių ligų / suskilusios asmenybės. 
                                        Kai naršote tinkle, girdite balsus, žmones socialinėse medijose kalbančius su savimi, 
                                        skirtingas tapatybes tinkle. Tai Dvilypumas.
                                    </p>
                                </div>
                                <p className="text-xs italic">
                                    Nepaisant to, kad žmonės turi visą informaciją prieinamą pirštuose, žmonės yra kvailesni nei 
                                    kada nors. Dėl informacijos pertekliaus atsiranda dėmesio trūkumas. Vandenys - 50% genialus, 50% kvailas.
                                </p>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Numerology Hierarchy */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="numerology-hierarchy"
                            title="📊 Numerologijos Hierarchija"
                            isOpen={expandedSections['numerology-hierarchy'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Numerologijos Hierarchija Hierarchy')}
                        >
                            <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p className="font-semibold text-orange-300 mb-2">Svarbumo Tvarka:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-2">
                                    <li><span className="font-semibold">Gyvenimo Kelias</span> - gyvenimo kelias</li>
                                    <li><span className="font-semibold">Diena, kurią gimėte</span> - stiprus 2-asis poveikis</li>
                                    <li><span className="font-semibold">Metai</span></li>
                                    <li><span className="font-semibold">Mėnuo</span></li>
                                    <li><span className="font-semibold">Laiko juosta</span> - per ją einame kiekvieną dieną</li>
                                </ol>
                                <p className="text-xs italic mt-2">
                                    Techniškai galite apskaičiuoti asmeninę dieną, asmeninę valandą, iki sekundžių. 
                                    Bet tuo metu tai nustoja būti naudinga = tapsite beprotiški.
                                </p>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Karma, Reincarnation and Astrology */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="karma-reincarnation"
                            title="⚖️ Karma, Reinkarnacija ir Astrologija"
                            isOpen={expandedSections['karma-reincarnation'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Karma Reinkarnacija Astrologija')}
                            contentText="Karma emocijos pririštos veiksmai emocinis ryšys laukianti karma reinkarnacija aktyvuojate karmą karminė skola karminiai apribojimai sielos galimybė pasirinkti parametrus reinkarnuosis karminė skola karminiai apribojimai mėnulis sielos gaudyklė ištrina atmintį perdirbti kitą gyvenimą"
                        >
                            <div className="bg-violet-900/30 border border-violet-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                <div>
                                    <p className="font-semibold text-violet-300 mb-2">Karma ir Emocijos:</p>
                                    <p className="text-xs mb-2">
                                        Karmai svarbu - <span className="font-semibold">jūsų emocijos, pririštos prie veiksmų</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Kuo daugiau esate prisirišę prie žmonių ir dalykų aplink jus, tuo daugiau kuriate <span className="font-semibold">emocinį ryšį</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Tai šis <span className="font-semibold">emocinis ryšys kuria laukiančią karmą</span> ir verčia jus reinkarnuotis vėl šioje žemėje.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Kuo daugiau sąveikaujate su kitais, tuo daugiau <span className="font-semibold">aktyvuojate savo karmą</span>.
                                    </p>
                                    <p className="text-xs">
                                        Turėti <span className="font-semibold">mažiausiai emocinio prisirišimo prie žmonių yra raktas būti mažiausiai paveiktam karmos</span>.
                                    </p>
                                </div>

                                <div className="border-t border-violet-500/30 pt-3">
                                    <p className="font-semibold text-violet-300 mb-2">Vandens Elementai ir Emocijos:</p>
                                    <p className="text-xs mb-2">
                                        Vanduo yra vienas iš penkių elementų, kuris <span className="font-semibold">neša emocijas</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Vandens elementai yra: <span className="font-semibold">Vėžys (Cancer), Skorpionas (Scorpio) ir Žuvys (Pisces)</span>.
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs mb-2">
                                        <li><span className="font-semibold">Vėžys yra 4-asis zodiako ženklas</span> - reiškia motiną</li>
                                        <li><span className="font-semibold">Skorpionas yra 8-asis ženklas</span> - reiškia mirtį ir gimimą</li>
                                        <li><span className="font-semibold">Žuvys yra 12-asis ženklas</span> - reiškia užbaigimą ir išsilaisvinimą</li>
                                    </ul>
                                    <p className="text-xs mb-2">
                                        Temos, susijusios su gimimu, reinkarnacija, mirtimi, yra susijusios su <span className="font-semibold">vandens ženklais</span>.
                                    </p>
                                    <p className="text-xs">
                                        Tai rodo, kad <span className="font-semibold">emocijos yra atsakingos už jūsų gimimą šioje žemėje</span>.
                                    </p>
                                </div>

                                <div className="border-t border-violet-500/30 pt-3">
                                    <p className="font-semibold text-violet-300 mb-2">Kaip Sumažinti Karmą:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-2 text-xs">
                                        <li><span className="font-semibold">Sumažinti socialinę mediją</span></li>
                                        <li><span className="font-semibold">Vengti dėvėti juodą dienomis, kai tikėtumėte svarbių naujienų</span> - pritraukiate daugiau karmos</li>
                                        <li><span className="font-semibold">Vengti daryti bet ką svarbaus šeštadienį (Sabbath)</span> - vengti klaidų</li>
                                    </ol>
                                </div>

                                <div className="border-t border-violet-500/30 pt-3">
                                    <p className="font-semibold text-violet-300 mb-2">Karma ir Rezultatai:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Karma ir rezultatai ateina vėlai</span>. Yra laiko delsa.
                                    </p>
                                    <p className="text-xs">
                                        Jūs <span className="font-semibold">mokate savo karminę skolą miegodami</span>.
                                    </p>
                                </div>

                                <div className="border-t border-violet-500/30 pt-3">
                                    <p className="font-semibold text-violet-300 mb-2">W(EIGHT) - Šeima ir Karma:</p>
                                    <p className="text-xs">
                                        Jūsų gebėjimas <span className="font-semibold">apsitamsyti yra karmos rezultatas, sveikata</span>. 
                                        Kaip tan = 8.
                                    </p>
                                </div>

                                <div className="border-t border-violet-500/30 pt-3">
                                    <p className="font-semibold text-violet-300 mb-2">Piratavimas ir Jupiterio Afekcija:</p>
                                    <p className="text-xs mb-2">
                                        Ar kas nors, ką žinote, skaito/mokosi iš piratavimo knygų?
                                    </p>
                                    <p className="text-xs mb-2">
                                        Jupiteris Vedinėje Astrologijoje reiškia <span className="font-semibold">Vadovą ir mokytoją</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Kai žmogus mokosi bet ko per piratavimo knygas, tai reiškia, kad jis/ji <span className="font-semibold">apgauna knygos autorių</span>, 
                                        kitaip tariant, tas žmogus apgauna Vadovą/mokytoją (Jupiterį), todėl Jupiteris jo/jos horoskope <span className="font-semibold">tampa paveiktas</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Dėl to tas žmogus rastų sunkumus gyvenimo srityse, kuriomis valdo Jupiteris (pvz.: vaikai, finansai ir kt. - skiriasi priklausomai nuo horoskopo).
                                    </p>
                                    <p className="text-xs mb-2">
                                        Taip pat žmogus rastų nereikalingus kliūtis ir kliūtis, kai vyksta Jupiterio ciklai ir tranzitai.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Gydymas:</span> Kartokite šią mantrą 21 kartą per 1-ąją valandą po saulėtekio kitiems 21 ketvirtadieniams:
                                    </p>
                                    <p className="text-xs mb-2 font-mono bg-violet-950/40 p-2 rounded">
                                        "Om vrim brihaspataye namah"
                                    </p>
                                    <p className="text-xs">
                                        Tai atstumia Jupiterio afekciją tam tikru mastu ir sumažina jo neigiamą įtaką jums.
                                    </p>
                                </div>

                                <div className="border-t border-violet-500/30 pt-3">
                                    <p className="font-semibold text-violet-300 mb-2">Karmos Analizė Vedinėje Gimimo Diagramoje:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Karma yra atmintis, valdoma Saturno</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Kai kas nors jums nutinka <span className="font-semibold">8, 17, 26 dienomis</span> - tai yra <span className="font-semibold">karmos rezultatas</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Karma yra <span className="font-semibold">priežastis ir pasekmė</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Savanaudiškumas kaupia karmą</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Gera yra subalansuota su blogiu.
                                    </p>
                                </div>

                                <div className="border-t border-violet-500/30 pt-3">
                                    <p className="font-semibold text-violet-300 mb-2">Kaip Karma Veikia:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Išmintingai pasirinkite, ką nekenčiate</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Pinigai yra karminis mainas</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Karminis balansas nėra tiek daug apie gerus ar blogus darbus. Tai daugiau apie <span className="font-semibold">balansą ir abipusiškumą</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Ar jūs atiduodate savo galią ir laimę, kad patenkintumėte kitus? 
                                        Gerai pažiūrėkite į savo veiksmus ir darbus, kad įsitikintumėte, kad esate tikri sau.
                                    </p>
                                    <p className="text-xs">
                                        <span className="font-semibold">8 ir Gyvatės gali pristatyti karmą efektyviau</span>.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Reincarnation and Souls */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="reincarnation-souls"
                            title="🔄 Reinkarnacija ir Sielos"
                            isOpen={expandedSections['reincarnation-souls'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Reinkarnacija Sielos Reincarnation Souls')}
                        >
                            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    Reinkarnacija vyksta per <span className="font-semibold">kraujotaką</span>. 
                                    Sielos galimybė pasirinkti savo parametrus, kur reinkarnuosis, yra ribotose galimybėse. 
                                    Tai taip pat susiję su karmine skola / karminiais apribojimais.
                                </p>
                                <p>
                                    <span className="font-semibold">Mėnulis = sielos gaudyklė</span> - jis ištrina jūsų atmintį, 
                                    jūs esate perdirbti į kitą gyvenimą. Galios, kurios valdo, ilgai bando tai apeiti.
                                </p>
                                <div className="bg-indigo-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-indigo-300 mb-1">Master Skaičiai (11, 22, 33):</p>
                                    <p className="text-xs">
                                        Gimti į 11/22/33 energiją nėra kažkas, ką tiesiog darote - reikia praeiti daug testų ir bandymų. 
                                        Ne lengva. Jei turite 1LP, bet gimėte 11 dieną - tai kūdikis senoji siela. 
                                        Ne jauna siela, ne sena siela, dar ne.
                                    </p>
                                </div>
                                <p className="text-xs">
                                    Reinkarnacija nėra linijinė - ji vyksta vienu metu. Skirtingi laiko juostos, skirtingos versijos, 
                                    sukrautos viena ant kitos.
                                </p>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Matrix Concepts */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="matrix-concepts"
                            title="🌐 Matrix Konceptai"
                            isOpen={expandedSections['matrix-concepts'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Matrix Konceptai Concepts')}
                        >
                            <div className="bg-gray-900/30 border border-gray-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    Santykis tarp žmonių/sielų ir Matrix nėra abipusiai naudingas santykis. 
                                    Tai daugiau <span className="font-semibold">parazitinis santykis</span>.
                                </p>
                                <p>
                                    <span className="font-semibold">12 ir 1 sistema</span> prasiskverbia per Matrix: 
                                    1 saulė ir 12 ženklų aplink ją. 1 centrinis bankas/Federal Reserve ir 12 mažesnių bankų. 
                                    12 ir 1 sistema = 13 - Matrix skaičius.
                                </p>
                                <p>
                                    Elitas visada turi <span className="font-semibold">kontroliuojamą opoziciją</span>. 
                                    Jiems patinka žaisti abiejose pusėse. Vienas iš jų mėgstamiausių triukų/magijos yra 
                                    <span className="font-semibold">atvirkštinis</span>. Vandenio amžiuje (atviraus proto energija) 
                                    - įtraukties mobas, žmonės, kurie vaizduoja save kaip atvirus, bet yra uždaros minties 
                                    ir sukuria daugiau padalijimo.
                                </p>
                                <p className="text-xs italic">
                                    Visada manykite, kad jie yra 20-30 žingsnių priekyje visų kitų, išskyrus GG33 ir Gary.
                                </p>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Additional Insights */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="additional-insights"
                            title="💡 Papildomos Įžvalgos"
                            isOpen={expandedSections['additional-insights'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Papildomos Įžvalgos Additional Insights')}
                        >
                            <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <div>
                                    <p className="font-semibold text-yellow-300 mb-1">9 Energija:</p>
                                    <p className="text-xs">
                                        9 susiję su užbaigimu. Paleisti dalykus yra kartu kartu ir saldžiai. 
                                        9 yra savanaudiškas skaičius - jų dėmesys apie save, savęs užbaigimą. 
                                        9 gali būti gana standūs žmonės, bet ir prisitaikantys. 
                                        Kodėl jie gerai dera su 4 energija. 9 pradeda dalykus skaičiuje 4, 
                                        visi kiti turėtų pradėti 1 energijoje.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-yellow-300 mb-1">3 ir 4:</p>
                                    <p className="text-xs">
                                        3 nėra stipresni nei 4. Jie turi labai skirtingas asmenybes. 
                                        4 - struktūra ir tvarka. 3 - vaiko energija = chaotiška. 
                                        3+4=7 - blogiausias skaičius santykiams. 7 mokymosi atžvilgiu vaikui - 
                                        reikia nustatyti apribojimus, jie gali jus nekęsti už tai tam tikrą laiką.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-yellow-300 mb-1">34/7 Gyvenimo Kelias:</p>
                                    <p className="text-xs">
                                        Būti 34/7 gyvenimo keliu nėra neigiamas dalykas. Tiesą sakant, 
                                        34LP yra protingiausias 7 derinys.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-yellow-300 mb-1">Gyvenimo Kelias ir Gimimo Diena:</p>
                                    <p className="text-xs">
                                        Turėti gyvenimo kelią, kuris yra priešas su diena, kurią gimėte - 
                                        atsakymas yra ne, daugeliu atvejų tai palaiko. Tai padeda subalansuoti 
                                        jų stiprybes ir silpnybes.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Vedic Astrology Fundamentals */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="vedic-fundamentals"
                            title="📚 Vedinės Astrologijos Pagrindai"
                            isOpen={expandedSections['vedic-fundamentals'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Vedinės Astrologijos Pagrindai Vedic')}
                        >
                            <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                <div>
                                    <p className="font-semibold text-emerald-300 mb-2">3 Astrologijos Stulpai: (12+9+12=33)</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="bg-emerald-950/40 rounded p-2">
                                            <p className="font-semibold text-emerald-300 text-xs mb-1">12 Zodiako Ženklų:</p>
                                            <p className="text-xs">Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces</p>
                                        </div>
                                        <div className="bg-emerald-950/40 rounded p-2">
                                            <p className="font-semibold text-emerald-300 text-xs mb-1">9 Planetos:</p>
                                            <p className="text-xs">
                                                7 Pagrindinės: Saulė, Mėnulis, Marsas, Merkurijus, Jupiteris, Venera, Saturnas<br/>
                                                2 Šešėlinės: Rahu (Šiaurės Mazgas), Ketu (Pietų Mazgas)<br/>
                                                3 Išorinės: Uranas, Neptūnas, Plutonas
                                            </p>
                                        </div>
                                        <div className="bg-emerald-950/40 rounded p-2">
                                            <p className="font-semibold text-emerald-300 text-xs mb-1">12 Namų:</p>
                                            <p className="text-xs">1-Kūnas, 2-Pinigai, 3-Broliai, 4-Turtai, 5-Meilė, 6-Ligos, 7-Santuoka, 8-Mirtis, 9-Žinios, 10-Karjera, 11-Pelnas, 12-Išlaidos</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Savaitės Dienos ir Valdančios Planetos:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                        <div>Sekmadienis - Saulė</div>
                                        <div>Pirmadienis - Mėnulis</div>
                                        <div>Antradienis - Marsas</div>
                                        <div>Trečiadienis - Merkurijus</div>
                                        <div>Ketvirtadienis - Jupiteris</div>
                                        <div>Penktadienis - Venera</div>
                                        <div>Šeštadienis - Saturnas</div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Zodiako Ženklai ir Valdančios Planetos:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <div>Aries - Marsas</div>
                                        <div>Taurus & Libra - Venera</div>
                                        <div>Gemini & Virgo - Merkurijus</div>
                                        <div>Cancer - Mėnulis</div>
                                        <div>Leo - Saulė</div>
                                        <div>Scorpio - Marsas, Plutonas</div>
                                        <div>Sagittarius - Jupiteris</div>
                                        <div>Capricorn - Saturnas</div>
                                        <div>Aquarius - Saturnas(1), Uranas(2), Rahu(3)</div>
                                        <div>Pisces - Jupiteris(1), Neptūnas(2), Ketu(3)</div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-emerald-500/30 pt-3">
                                    <p className="font-semibold text-emerald-300 mb-2">Kryptys ir Valdančios Planetos:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                        <div>Šiaurė - Merkurijus</div>
                                        <div>Šiaurės Rytai - Jupiteris</div>
                                        <div>Rytai - Saulė</div>
                                        <div>Pietryčiai - Venera</div>
                                        <div>Pietūs - Marsas</div>
                                        <div>Pietvakariai - Rahu</div>
                                        <div>Vakarai - Saturnas</div>
                                        <div>Šiaurės Vakarai - Mėnulis</div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Astrological Beauty Types */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="beauty-types"
                            title="✨ Astrologinės Grožio Rūšys (Planetų Dominavimas Moterims)"
                            isOpen={expandedSections['beauty-types'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Astrologinės Grožio Rūšys Beauty Types')}
                        >
                            <div className="bg-pink-900/30 border border-pink-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-6">
                                
                                {/* Venus Dominant */}
                                <div className="bg-pink-950/40 rounded p-4">
                                    <h5 className="text-pink-300 font-bold mb-2">♀️ Veneros Dominavimas (Bharani, Purva Phalguni, Purva Ashada)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-pink-200">Išvaizda:</p>
                                        <p>Tendencija būti elfiškos išvaizdos. Reikia labai mažai makiažo. Išvaizda labai subalansuota, simetriška ir proporcinga. Lūpos sultingos ir pilnos, su stora, išsikišusia viršutine lūpa. Smakras paprastai kvadratinis. Nosis pakelta su kvadratine ar trikampe, labiau nukreipta nei Merkurijus. Antakiai turi gražų lanką ir yra pakelti aukštai ant veido. Akys migdolo formos, vidutinio iki didelio dydžio. Labai lygūs, gražūs dantys. Bruožai išdėstyti tolygiau per veidą su ilgesniu atstumu tarp akių ir burnos.</p>
                                        <p className="font-semibold text-pink-200 mt-2">Asmenybė:</p>
                                        <p>Veneros moterys yra labiau atsiribojusios. Jos yra prisitaikančios, bet neapsimetinėja kvailomis ar nesako malonių dalykų tik tam, kad paglostytų kieno nors ego. Jos yra atsiribojusios, bet mandagios. Venera yra yin ir jūs pastebėsite baisesnę pusę tik tada, kai nukreipsite energiją į Veneros dominuojančius žmones, nes jie akimirksniu įvertins energijos vertę. Labai protingos plačiąja prasme - emociniu, akademiniu, dvasiniu lygmenimis. Santykiai yra pagrindinė jų egzistencijos dalis. Jos labiausiai linkusios įsitraukti į dvasinius santykius ir tantrinius ritualus. Jos yra tokios rafinuotos ir protingos, kad dauguma žmonių neatitinka jų standartų. Jos turi aukštus standartus gyvenime dėl to, su kuo susitinka, kur gyvena, ką valgo, ką mėgaujasi. Jos labiausiai mėgsta prabangą kasdieniame gyvenime ir labiausiai vertina menus. Jos linkusios stimuliuoti savo pojūčius pačiais maloniausiais ir rafinuotais būdais. Natūralus spindesys. Elitizmo ir pranašumo aura.</p>
                                    </div>
                                </div>

                                {/* Rahu Dominant */}
                                <div className="bg-indigo-950/40 rounded p-4">
                                    <h5 className="text-indigo-300 font-bold mb-2">🌑 Rahu Dominavimas (Ardra, Swati, Shatabhisha)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-indigo-200">Išvaizda:</p>
                                        <p>Didžiausias Yin moteriškos jėgos pasireiškimas. Bruožai linkę būti dideli ir apvalūs, ypač aplink akis ir nosį, kas rodo tuščią ir erdvią vidinę prigimtį. Rahu moterys rodo Yin bruožus turėdamos dideles ir apvalias, plačiai išdėstytas akis, kurios linkusios būti pakeltos. Išsikišusi mėsinga nosies galiukas, dažnai su kalneliu ant tilto ir šiek tiek nuleista, ypač su Rahu mėnuliu. Lengvesnė spektra. Linkusios turėti žalias ir pilkas atspalvius, labai šviesias ir šokiruojančias akis. Rahu yra labai yin.</p>
                                        <p className="font-semibold text-indigo-200 mt-2">Asmenybė:</p>
                                        <p>Rahu moterys elgiasi taip, tarsi norėtų būti maištingos ir individualistinės bei nepriklausomos, bet tai, ko jos tikrai trokšta, yra vyras, kuris turi visas priešingas savybes - visišką jėgą, tikrumą, diskriminacinį gebėjimą, sprendžiantį pobūdį. Kai Rahu veikia libidą, tai gali reikalauti daug kantrybės vyro pusėje, nes gali sukurti tikrai šaltą ir apribojančią prigimtį, kuri yra atsitraukusi ir labai atsargi dėl intensyvaus ir vėžlio panašaus Rahu pobūdžio. Šios moterys yra taip yin ir mėgsta traukti energiją, kad joms nepatinka būti aplink vyru, kurį jaučia gali traukti ar bandyti traukti jų energiją. Jos yra taip alkstančios energijos, mėtomos į jas, kad mėgsta vyrus su daug yang ir saulės energijos.</p>
                                    </div>
                                </div>

                                {/* Sun Dominant */}
                                <div className="bg-yellow-950/40 rounded p-4">
                                    <h5 className="text-yellow-300 font-bold mb-2">☀️ Saulės Dominavimas (Krittika, Uttara Phalguni, Uttara Ashada)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-yellow-200">Išvaizda:</p>
                                        <p>Mažos, siauros akys dėl jų ryškaus spindesio. Labai kvadratinis, gerai struktūruotas veidas ir platus smakras. Labai išvystyti kaulai veide dėl Saulės, valdančios kaulus kūne. Linkusios turėti susiaurėjusias iki vidutinio storio lūpas. Dignifikuota, individualistinė, tvirta valia ir moralinė. Nuosaiki ir tvirta dvasia. Atvira, atletinė ir tvirta.</p>
                                        <p className="font-semibold text-yellow-200 mt-2">Asmenybė:</p>
                                        <p>Saulės dominuojančios moterys turi didžiausią moralinį kompasą. Jos niekada neleidžia sau nusileisti iki to, ką jaučia yra neteisinga. Jos kovoja už teisingumą ir standartus. Jos yra tos, kurios seka kiekvieną taisyklę, kiekvieną įstatymą ir niekada nedaro nieko neteisingo, net jei niekas nežiūri. Moralė ir gerumas yra tai, ką jos palaiko dėl savo laimės ir pasitenkinimo savimi. Šios moterys yra spindinčios ir pilnos energijos. Šis individualistinis pobūdis reiškia, kad jos paprastai rūpinasi savimi, jos apsėsta mitybos ir sveikatos ir baigia gyventi labai energingą ir laimingą gyvenimą iki senatvės, nes jų ego yra tvirtai įsišaknijęs ir susijęs su fiziniu kūnu. Jos mėgsta iššūkius sau ir yra žinomos užsiimant hobiais, įgijant naujų įgūdžių visą gyvenimą, visada mokosi, dažnai keliauja, mokosi naujų kalbų, gyvenimo įgūdžių, mokslų, kažko, kas stimuliuoja kūną ir protą. Išlaiko jaunatvišką gyvybingumą.</p>
                                    </div>
                                </div>

                                {/* Mercury Dominant */}
                                <div className="bg-cyan-950/40 rounded p-4">
                                    <h5 className="text-cyan-300 font-bold mb-2">☿️ Merkurijaus Dominavimas (Ashlesha, Jyestha, Revati)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-cyan-200">Išvaizda:</p>
                                        <p>Lygios, viliojančios, mažo karkaso figūros, kartais didelės krūtinės. Linkusios turėti mažus raktikaulius ir pečius. Paprastai žemesnės ūgio nuo apie 4'11 iki 5'5. Linkusios turėti trumpą. Linkusios turėti mėsingą, beveik snub nosį. Labai pakelta su plačiomis šnervėmis. Pug nosis. Minkštos skruostikauliai apvaliame veide, kurie dažnai sukuria duobutes. Jų akys yra migdolo formos, vidutinio iki didelio dydžio, giliai įdėtos ir linkusios turėti šiek tiek uždenktą išvaizdą išoriniuose kampuose. Natūraliausiai ploniausi antakiai iš visų padėčių, jie yra žemai nustatyti ir linkę būti gana ilgi. Vidutinio iki pilnų lūpų, ypač pabrėžiant apatinę lūpą, bet labai ilga viršutinė lūpa ir labai ilga išsikišusi burna. Labai trumpas smakras su ypač dideliais skruostais ir aukštais bei pločiais skruostikauliais. Visi veido bruožai linkę būti stumiami į mažą sritį veide. Paliekant vietos didesniam kaktai ir labai apvaliam ar kvadratiniam veidui. Apskritai šių merginų grožis linkęs būti labai jaunatviškas ir mielas.</p>
                                        <p className="font-semibold text-cyan-200 mt-2">Asmenybė:</p>
                                        <p>Pasionatos, puikūs įgūdžiai ir vikrumas. Jautri nervų sistema ir linkusios puikiai turėti natūralius psichinius gebėjimus. Teikia pirmenybę socializacijai, maloniam socialiniam mainui su kitais ir labai orientuotos į malonumą. Daugelis gauna plastinės chirurgijos dėl jų išrankios ir išrankios prigimties dėl jų išvaizdos. Geba viliojant kitus ir sužadinant juos. Per seksualumą, humorą, vaidybą, apgaulę, manipuliaciją, bet ką panašaus. Mėgsta puoštis, nešioti daug papuošalų, žiedų ir karolių. Mėgsta gauti tatuiruotes. Gerai su būrimu, mėgsta knygas, kaligrafiją, bet ką, susijusį su vikrumu. Natūraliai mėgsta būti švariai ir higieniškai. Dažnai mėgsta išdėstyti objektus, dekoracijas ir raštus. Įkūnija natūralius klasikinius moteriškus elgesius ir bruožus labiausiai iš visų planetų. Daug moterų pavydi šioms moterims, nes jos yra viliojančios. Labai konkurencingos su kitomis moterimis ir retai turi moteriškų draugų.</p>
                                    </div>
                                </div>

                                {/* Ketu Dominant */}
                                <div className="bg-gray-900/40 rounded p-4">
                                    <h5 className="text-gray-300 font-bold mb-2">🌙 Ketu Dominavimas (Ashwini, Magha, Mula)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-gray-200">Išvaizda:</p>
                                        <p>Tamsus varnas su beveik mieguistu, praskiedžiančiu ir paslaptingu efektu. Linkusios traukti absoliučiai tamsiausius bruožus iš jų genetinio fondu, suteikiant tamsesnę odą, labai tamsų rudos ar juodos plaukus. Tačiau daugeliu atvejų, jei moteris yra grynai šiaurės ar vakarų europietė, ji neturi tamsesnės odos genetikos, kurią galėtų traukti, ji vis tiek turės tamsiausius galimus plaukus, sukurdama daug unikalaus kontrasto. Panašiai kaip Sniego Baltoji aprašymas - sniego baltos odos, raudonų lūpų ir varno juodų plaukų. Alternatyviai, dažnai sukuria raudonus plaukus. Linkusios turėti dideles mieguistas akis, kurios išsikiša, dėl to atsiranda didžiulis baltoji erdvė. Labai panašiai kaip Rahu mazgas, nes abu natūraliai neturi šviesos, todėl linkę pabrėžti akis, kurios sugeria ir traukia šviesą. Ketu reprezentuoja tamsą. Ketu turi tuščią, paslaptingą, paralyžuojančią, apstulbinančią išvaizdą akims. Tendencija turėti didžiausias natūralias lūpas iš visų planetų, jų burnos yra ilgiausios ir didžiausios, dažnai pabrėžiant jų didelius dantis ar unikalius dantis, tokius kaip tarpas tarp dviejų priekinių dantų, ir daugeliu atvejų, pakeičiant dideles lūpas ar kartu su didelėmis lūpomis, bus ilgesnis smailus smakras. Nosis linkusi būti maža, bet plati. Šnervės pakeltos ir pertvara žema. Linkusios turėti apibrėžtus skruostikaulius su išdžiūvusiais apatiniais skruostais ir labai apvalią, gražiai formuotą kaktą.</p>
                                        <p className="font-semibold text-gray-200 mt-2">Asmenybė:</p>
                                        <p>Ketu suteikia moterims labai tamsią energiją, kuri atrodo mieguista ir toksiška. Jos turi visiškai paslaptingą ir intriguojantį grožį. Jos mėgsta skaityti, ypač grožinę literatūrą ir istorinius romanus, nes jos linkusios užsikabinti prie dalykų, kurie yra astraliniai ar praeityje, daugiausia per dalykus, tokius kaip istorija ir protėviai, įsivaizduojamos idėjos, fantazija, sapnų interpretacijos ir kt. Jos yra tos, kurios labiausiai linkusios rinkti informaciją kažkokiame keistame ir stebinančiame srityje. Stebindamos žmones savo žinių baze, ypač srityse, susijusiose su dvasinėmis praktikomis. Planeta, labiausiai traukiama prie okulto, religijos ir dvasingumo, jos yra geriausios bet kame, reikalaujančiame stipraus intuicijos ir astralinių ar psichinių gebėjimų. Jos yra labiausiai traukiamos prie dalykų, tokių kaip darbas su mirusiais, astralinė projekcija. Jų auros linkusios būti atviros ir linkusios internalizuoti įtakas, kurios yra ant jų padėtos, todėl joms reikia būti atsargioms, nes jos yra jautrios patekti į pavojingas situacijas dėl jų apsėstumo šiais pavojingesniais dvasingumo aspektais.</p>
                                    </div>
                                </div>

                                {/* Saturn Dominant */}
                                <div className="bg-slate-950/40 rounded p-4">
                                    <h5 className="text-slate-300 font-bold mb-2">♄ Saturno Dominavimas (Pushya, Anuradha, Uttara Bhadrapada)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-slate-200">Išvaizda:</p>
                                        <p>Saturnas suteikia labiau netaisyklingą ir mažesnę išvaizdą bruožams dėl labiau suspaudžiančio ir apribojančio Saturno aspekto. Saturno moterys linkusios turėti vidutinio iki didelio dydžio akis, kurios yra labai plačiai išdėstytos ir pakeltos. Kai jos yra didesnės, jos yra siauros ir ilgos. Jos turi dideles, pločias, sunkias kaktas kvadratinio veido formoje su kontūruotais skruostais, trumpą kvadratinį smakrą. Jų lūpos paprastai plonos iki vidutinio storio, su dauguma storio tiesiai viršutinės ir apatinės lūpos centre. Jų veidai turi beveik baisią veido simetriją. Jų viršutinės galvos sunkumas ir jų labai toli esantis atstumas mano nuomone atneša beveik ateivišką, eterinį grožį. Jų kūnai linkę būti natūraliai gana ploni, kas suteikia labiau susitraukusią išvaizdą, kai jos užsiima fitnesu. Jos yra moteriškos planetos, labiausiai linkusios turėti presus. Ilgas kaklas, ilgi gracingi galūniai. Pečiai linkę būti gerai struktūruoti ir pločiai. Ilgas liemuo ir žemai nustatytos krūtinės, kurios paprastai yra mažos.</p>
                                        <p className="font-semibold text-slate-200 mt-2">Asmenybė:</p>
                                        <p>Malonios ir prisitaikančios. Natūraliai pradeda imtis darbų, padėti kitiems, imtis atsakomybių nuo jaunystės. Jos linkusios norėti tarnauti visuomenei, o ne eiti prieš ją ar būti antagonistiškos jai. Linkusios būti labai priimančios socialinių vaidmenų ir archetiškai normalių socialinių vaidmenų. Gerai subalansuotos, gerai prisitaikančios, puikiai atlieka bet ką, ką jos nusprendžia. Ypač bet ką, kas tarnauja kitiems, ypač versle ar namuose. Ji tiki, kad viskas aplink yra tobula ir ji yra sugedusi. Padidina gerą karmą ieškodama klaidų viduje, o ne lauke. Daug labiau fiksuota pateikti ir tada tobulinti ir prisidėti prie jau padėtų socialinių ir moralinių struktūrų, o ne keisti ar nuversti jas. Visose jos gyvenimo srityse, Saturno moteris sieks būti geriausia, kokia ji gali būti, ir žiūrės į save su sąžiningu ir aiškiu kritika ir supratimu apie savo trūkumus ir trūkumus. Laiko ir tvarko aplinką. Puikiai atlieka varginančius veiksmus, kurių kiti neturi kantrybės ar dėmesio, tokius kaip kepimas, kruopštus organizavimas ir kt.</p>
                                    </div>
                                </div>

                                {/* Mars Dominant */}
                                <div className="bg-red-950/40 rounded p-4">
                                    <h5 className="text-red-300 font-bold mb-2">♂️ Marso Dominavimas (Mrigashira, Chitra, Dhanishta)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-red-200">Išvaizda:</p>
                                        <p>Neįtikėtinai orientuotos į kūną. Daugelis šių moterų yra labiausiai žinomos dėl savo tikrų kūnų, dar labiau nei jų veidų. Jos turi puikų natūralų gebėjimą kurti raumenis, jos turi labiausiai išvystytą ir gausiausiai siekiamą figūrą iš visų planetų. Kaip galbūt pastebėjote nuotraukose, šios moterys dažnai jaučiasi patogiau, kai jie pašviesina savo plaukus, net jei jie neturi natūraliai šviesių ar šviesių plaukų pradžioje. Kitas dažnas dalykas su daugybe Marso diagramoje yra turėti rausvus atspalvius plaukams arba tiesiog visiškai raudonus plaukus, taip pat rausvą, alyvuotą, spindintį odą. Kitas dalykas, kurį pastebėsite veide - labai mėsingi skruostai. Akys yra gana siauros ir šiek tiek pakeltos. Tai tikrai trumpas, bet pločias veido formos su neįtikėtinai mėsingais skruostais. Daugeliu atvejų labai mėsingas nosies galiukas. Daugelis šių moterų turi gana pločias ir didesnes nosis. Mėsa pločia, nebūtinai kaip kalnelis ant tilto ar panašiai, bet galiukas yra mėsingesnis, šnervės yra šiek tiek pločios. Jos dažnai turi storas lūpas, gana pilnas lūpas. Kitas dalykas apie Marsą yra tai, kad jis turi labai simetrišką išvaizdą veidui ir kūnui. Šios moterys turi gausius kūno audinius ir mėsą, linkusios turėti gražius plaukus, odą ir nagus. Žodžiai, kuriuos galite naudoti apibūdinti šio tipo grožiui, linkę būti tokie kaip geidulingas, buksus, išlenktas, fizinis grožis.</p>
                                        <p className="font-semibold text-red-200 mt-2">Asmenybė:</p>
                                        <p>Dėl intensyvaus kūno pabrėžimo ženklo, pagrindinė problema su Marso dominuojančiomis moterimis yra tendencija link promiskuity. Visi trys šie Nakšatros turi reputaciją būti promiskuity ir seksualiai tyrinėjantys. Kai galvojame apie tai, kaip Marsas tikrai gali turėti blogiausią poveikį mūsų santykiams, mūsų santuokai, jei jis nėra gerai padėtas. Apskritai, kalbant apie vyrų tipus, kuriuos šio tipo moterys mėgsta, jos linkusios mėgti Jupiterio asmenis, kurie yra socialūs, kurie yra turtingi, kurie yra dosnūs. Jos mėgsta vyrus, kurie yra labiau pasiduodantys ir kurie nekelia apribojimų merginoms. Jos mėgsta pasiduodančio, draugiško, linksmo pobūdžio vyrus, su kuriais susitinka, gali teikti pirmenybę vyrams su daug seksualinio ištvermės, nes jos dažnai kartais net su keliais žmonėmis tuo pačiu metu ir jos tikrai nemato logiškos priežasties, kodėl jos neturėtų būti. Daugeliu atvejų jos nemėgsta būti priverstos visai, kaip ir kaip žemės elementai gali padaryti moteris nepriimančias vyrų, šios moterys nėra atviros būti paveiktos apskritai.</p>
                                    </div>
                                </div>

                                {/* Jupiter Dominant */}
                                <div className="bg-amber-950/40 rounded p-4">
                                    <h5 className="text-amber-300 font-bold mb-2">♃ Jupiterio Dominavimas (Punarvasu, Vishaka, Purva Bhadrapada)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-amber-200">Išvaizda:</p>
                                        <p>Jupiterio dominuojančioms moterims veido forma linkusi būti apversta trikampė su smakru, kuris šiek tiek išsikiša į priekį ir dideliais bruožais apskritai. Jų lūpos yra labai storos, ypač apatinė lūpa. Jos turi ryškų ir aukštą Kupido lanką. Vienintelė sritis su šiek tiek plonumo ant lūpos linkusi būti viršutinės lūpos šonai ir burna yra natūraliai nuleista. Akys yra vidutinio iki didelio dydžio su plačiu ir storu vokų tarpu. Akys linkusios būti išsikišusios ir šiek tiek nuleistos kampuose. Nosis yra šiek tiek pakelta su storu tiltu ir mažomis šnervėmis ir linkusi turėti labai kvadratinį galiuką.</p>
                                        <p className="font-semibold text-amber-200 mt-2">Asmenybė:</p>
                                        <p>Jupiterio moterys yra filantropiškos ir dažnai yra aktyvistės dėl įvairių priežasčių, tokių kaip feminizmas, pabėgėliai, juodų gyvybių svarba ir panašiai. Šios moterys yra tiesioginės prigimties ir gali būti šiek tiek įžeidžiančios, taip pat gali būti lengvai įžeidžiamos, o neigiama emocija, kuriai jos labiausiai linkusios, yra pyktis, frustracija ir nepasotinamas troškimas tikrai kontroliuoti save ir savo aplinką visada. Jų išorinis elgesys yra labai ramus, šiek tiek monotoniškas, šiek tiek švelnus su mažai arba jokiomis emocinėmis reakcijomis pokalbio metu, ir jos yra super nuslėptos, nesunkiai sužadinamos, sužadintos ar įspūdžio. Nors jos yra gudrios veikti maloniau ir susijusiai viešose situacijose, kai jaučia, kad tai būtina. Jos taip pat linkusios skleisti daug labiau linksmą ir palaikančią tipo požiūrį, kai jos yra savo paauglystėje ir 20-ies metų. Tai šiek tiek keičiasi, kai jos sensta. Šios moterys išlieka ramios ir kontroliuojamos beveik kiekvienoje situacijoje. Vienintelis laikas, kai jos praranda tą labai kontroliuojamą elgesį, linkęs būti, kai jaučia, kad asmeniškai nesiseka kažkam arba gėdijasi savęs, tuo metu jos yra labai emocinės dėl jų labai konkurencingos prigimties.</p>
                                    </div>
                                </div>

                                {/* Moon Dominant */}
                                <div className="bg-blue-950/40 rounded p-4">
                                    <h5 className="text-blue-300 font-bold mb-2">🌙 Mėnulio Dominavimas (Rohini, Hasta, Shravana)</h5>
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold text-blue-200">Išvaizda:</p>
                                        <p>Mėnulio dominuojančių moterų charakteristikos linkusios būti labai storo smakro ir smakrai, kurie yra pločiai ir stambūs. Apskritai labai kvadratinis veido formos, jos linkusios turėti trumpą smakrą, labai kvadratinę kaktą, siauras mažas iki vidutinio dydžio akis daugiausia tik todėl, kad veidas yra toks didelis, kad jis šiek tiek stumia šią sritį mažesnę ir atrodo didesnė palyginti su akies sritimi. Skruostų obuoliai yra labai pilni, bet jie yra gana žemai nustatyti ant veido. Nosis linkusi būti viena iš didesnių nosių tarp planetų su pločiu tiltu ir storiu trikampiu galiuku su storiomis šnervių sparnais. Lūpos yra gana lygios ir jos yra storos ir mėsingos, todėl ar jos yra didelės ar mažos, jos linkusios būti lygios viršuje ir apačioje, o Kupido lankas linkęs būti gana pločias, ypač su Shravana, nes tai yra galutinis Mėnulio pasireiškimas. Kūnas linkęs turėti trumpą ir storą kaklą. Storą vidurio dalį su mėsinga oda, trumpomis kojomis ir storiomis rankomis. Dažnai visas kūnas yra gana obuolio formos ir pabrėžia krūtis ir apskritai mėsą, o ne klubus. Mėnulio dominuojančios moterys paprastai yra gana vidutinio ūgio.</p>
                                        <p className="font-semibold text-blue-200 mt-2">Asmenybė:</p>
                                        <p>Mėnulio dominuojančios moterys yra labai nevertinančios apie žmones, kuriuos jos myli. Kai jos kam nors patinka, jos tikrai jiems patinka ir jos myli besąlyginės meilės ir atsidavimo idėją savo artimiausiems draugams, savo šeimai ar savo partneriui, nes mėnulis valdo, kaip jūs esate pasitenkinę. Šios moterys linkusios nelabai trokšti, jos yra labai pasitenkinusios tuo, kas ir ką jos turi. Kartais iki ekstremo taško, kur jos lieka labai stagnuojančios gyvenime, niekada nepasiekia naujų patirčių ir naujų idėjų, bet geriau mėgsta būti saugiai įsikūrusios žmonėse, su kuriais jos prisiriša, ir idėjose, su kuriomis jos užaugo. Tiems, kurie nėra jų brangiamame ir artimame draugų, šeimos, mylimųjų rate. Šios moterys gali atrodyti labai užsispyrusios dėl jų padėties žemės ženkluose. Jos gali atrodyti užsidariusios, jos gali atrodyti per daug iracionalios ir emocinės savo argumentuose, jų balsai dažnai neša emocijų toną visame, apie ką jos kalba, kas gali pakelti bet kokį pokalbį į aukštesnį lygį, bet jos vis tiek turi daug ištvermės argumentuose ir atsidavimo veikla.</p>
                                    </div>
                                </div>

                                {/* Summary Section */}
                                <div className="bg-purple-950/40 rounded p-4">
                                    <h5 className="text-purple-300 font-bold mb-2">📊 Apibendrinimas</h5>
                                    <div className="text-xs space-y-3">
                                        <div>
                                            <p className="font-semibold text-purple-200 mb-1">Ūgis:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2">
                                                <li>Merkurijus - trumpiausios ir mažiausios</li>
                                                <li>Jupiteris - antrosios trumpiausios, mėsingesnės ir išlenktesnės</li>
                                                <li>Vidutinio ūgio ir plonas kūnas - Ketu ir kartais Rahu</li>
                                                <li>Vidutinio ūgio ir vidutinis mėsos kiekis - Venera ir Saulė</li>
                                                <li>Aukštesnės ir plonesnės - Saturnas</li>
                                                <li>Vidutinio ūgio ir vidutinio iki didelio karkaso, gana mėsingas - paprastai Mėnulis</li>
                                                <li>Vidutinio iki aukšto ūgio ir vidutinio iki aukšto karkaso - bet kas gana išpūstas, kaip turėti tikrai gerą raumenų atsargą, tikrai didelį mėsos kiekį kūne, kažką panašaus kaip labai pločios klubai arba labai didelės krūtinės, tai paprastai bus Marsas</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-purple-200 mb-1">Plaukų Spalva:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2">
                                                <li>Natūraliai šviesūs plaukai - Venera</li>
                                                <li>Vidutinio tono - Jupiteris, Saulė, Merkurijus, Rahu, Saturnas ir Marsas</li>
                                                <li>Marsas ir Ketu su raudonais plaukais</li>
                                                <li>Ketu su visiškai juodais plaukais</li>
                                                <li>Turėti šviesiausią savo genetikoje - labiausiai tikėtina Venera</li>
                                                <li>Turėti tamsiausią - Ketu</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-purple-200 mb-1">Akys ir Lūpos:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2">
                                                <li>Didžiausios akys - Rahu ir Ketu (nesugeria šviesos, visiškai sugeria šviesą)</li>
                                                <li>Mažiausios akys - Saulė ir Mėnulis (luminarės, skleidžia ar atspindi šviesą)</li>
                                                <li>Didžiausios lūpos - Ketu ir Marsas</li>
                                                <li>Ilgiausios lūpos - Merkurijus</li>
                                                <li>Pločiausios burnos - Ketu</li>
                                                <li>Su Veneros grožiu pamatysite daug pilnumo viršutinėje lūpoje</li>
                                                <li>Su Merkurijumi pamatysite ilgį viršutinėje lūpoje</li>
                                                <li>Rahu turi hipnotizuojančias, plačiai išdėstytas akis su pilna apatine lūpa</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Imprinted Energy and Advanced Numerology */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="imprinted-energy"
                            title="⚡ Įspaustos Energijos ir Išplėstinė Numerologija"
                            isOpen={expandedSections['imprinted-energy'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Įspaustos Energijos Imprinted Energy žiurkė Rat privilegija matrix katė toxoplasmosis')}
                            contentText="įspaustos energijos numerologija astrologija žiurkė rat privilegija matrix mėgstamiausias vaikas katė toxoplasmosis varžybos"
                        >
                            <div className="bg-teal-900/30 border border-teal-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                
                                <div>
                                    <p className="font-semibold text-teal-300 mb-2">Kas yra Įspaustos Energijos?</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Įspaustos energijos = Numerologija + Astrologija.</span> 
                                        Metafizinė mokslo energija. Ne tas pats kaip materialusis mokslas. 
                                        Matematika apima materialiąją pusę. Numerologija apima dvasinę pusę.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Numerologija viršija astrologiją</span>, nes ženklai turi skaičių. 
                                        Pvz., Šuo, 11-asis ženklas, 11 yra emocijos.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Astrologija iš tikrųjų kilusi iš Numerologijos - 100%</span>.
                                    </p>
                                    <p className="text-xs">
                                        Numerologija veikia tik todėl, kad tai yra matrica. Netikra sritis arba energijos matrica. 
                                        Galime pažiūrėti į skaičių seką iš kieno nors gimtadienio ir perskaityti juos kaip knygą.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">33 Metų Amžiaus Reikšmė iš Trikampio (Trine):</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">33 metų amžiaus reikšmė kilo iš Trikampio (Skaičių)</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Trikampiai:</span>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs mb-2">
                                        <li>(1, 4, 7) trikampis</li>
                                        <li>(2, 5, 8) trikampis</li>
                                        <li>(3, 6, 9) trikampis</li>
                                    </ul>
                                    <p className="text-xs mb-2">
                                        Kiekvienam ženklui (Kinų), <span className="font-semibold">33 metų amžius (Kinų ženklas) kilo iš Trikampio</span>.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Pavyzdys - Katė:</span>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs mb-2">
                                        <li>Katė yra 4-asis ženklas, ateina į (1(Žiurkė, Gaidys**), 4(Katė), 7(Arklys)) trikampį</li>
                                        <li>Kai Katė tampa 33 metų, jis/ji bus Žiurkės metais</li>
                                        <li>Žiurkės metai ateina (3,6,9) metų cikle Katės</li>
                                        <li>Katė kaip 9, 21(3), <span className="font-semibold">33</span>, 45(9), 57(3), 69(6), 81(9), 93(3), 105(6) metų Žiurkės metais</li>
                                    </ul>
                                    <p className="text-xs mb-2">
                                        Kitas skaičius yra 7(Arklys) iš Trikampio. Arklys metai taip pat ateina (3,6,9) metų cikle Katės:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs mb-2">
                                        <li>Katė kaip 3, 15(6), 27(9), 39(3), 51(6), 63(9), 75(3), 87(6), 99(9), 111(3) metų Arklys metais</li>
                                    </ul>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">(3,6,9) metų ciklas yra galingas</span> - James gali šviesą apie tai.
                                    </p>
                                    <p className="text-xs italic">
                                        ** = Priešų ženklai negali būti skaičiuojami Trikampyje
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Balansas yra Raktas:</p>
                                    <p className="text-xs mb-2">
                                        Ne tas pats visiems. Tarkime, jūs esate sportininkas, nusprendžiate treniruotis kiekvieną dieną, 
                                        tai jums pakenks, jei treniruositės 7 dienomis. 8LP paprastai bus materialistiškesnis nei dauguma. 
                                        Negalite būti materialistu visą laiką. Materializmo lygis gali būti aukštesnis daugumoje skaičių. 
                                        Bet net 7 turi sutelkti dėmesį į medžiagas, ne tiek daug kaip 8, nes tai sukurs disbalansą.
                                    </p>
                                    <p className="text-xs">
                                        Žodžiai "seven" ir "eight" - 7 turi raidę V, 22-oji raidė. Eight turi tylųjį G centre. 
                                        Net su dvasiniu, yra materialus. Ir materialiame yra dvasinis. Visada yra balansas.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Aukštesnės ir Žemesnės Kokybės:</p>
                                    <p className="text-xs mb-2">
                                        Kiekvienas skaičius ir ženklas turi aukštesnes ir žemesnes kokybes. Teigiamas ir neigiamas. 
                                        Ir tai yra neutralios kokybės. Nesvarbu jūsų polinkis, kiti turi šališkumą už ar prieš. 
                                        Viskas yra balansas.
                                    </p>
                                    <p className="text-xs">
                                        Pvz., Beždžionės linkusios į patyčias. Kai kuriems žmonėms tai turėtų būti nepageidaujamiausia 
                                        kokybė žmoguje, kai kurie sako, kad tai juokinga ir jums reikia atsipalaiduoti. 
                                        Kiti gali rasti Ožką per minkštą, o kiti mato jas kaip turinčias stiprų buvimą. 
                                        Visada yra balansas.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Gyvenimo Kelias - Svarbiausias Skaičius:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Gyvenimo kelias yra svarbiausias skaičius.</span> 
                                        Tai jūsų dabartinės reinkarnacijos kelias. Tai yra didesnio reinkarnacijos ciklo dalis, 
                                        kad tęstumėte evoliuciją.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Jūsų gimimo diena yra antras svarbiausias skaičius.</span> 
                                        Galite turėti stiprią energiją kiekvieną mėnesį jūsų gimimo dieną. 
                                        Pvz., gimęs 31 d., stiprios 31 dienos.
                                    </p>
                                    <p className="text-xs">
                                        Ką reiškia nepavykti savo gyvenimo kelio: 1 turėtų vadovauti, ne būti priklausomu, 
                                        nepavykti žengti į priekį - taip jie nepavyksta. Tai sunkiau moteriai. 
                                        3 yra komunikacijos skaičius, jei 3 niekam nekalba, tai nepavyko reinkarnacija. 
                                        9 yra ego skaičius, užbaigimas. 9, kuris gyvena savo gyvenimą kitiems ir neužbaigia savęs, 
                                        tai nepavyko.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Gyvenimo Kelias vs. Gimimo Diena:</p>
                                    <p className="text-xs mb-2">
                                        Jei esate 1LP, gimęs 4 d., ar 9, 18 d. yra blogi jums? Atsakymas yra ne. 
                                        Jei gimėte 4 d., 9 yra gana naudingas jums.
                                    </p>
                                    <p className="text-xs">
                                        Jei esate 7LP, gimęs 8 d., ar tai daro jus priešu sau? Ne. 
                                        Tai sukuria balansą asmeniui.
                                    </p>
                                </div>
                                
                                
                                <div>
                                    <p className="font-semibold text-teal-300 mb-2">Kurti Teigiamą Energiją:</p>
                                    <p className="text-xs mb-2">
                                        Kalbant apie įspaustą energiją, tai ne tik apie klaidų vengimą, pvz., būti žemai priešų metais. 
                                        Jūs taip pat turite padaryti, kad dalykai įvyktų. Kurti teigiamą energiją savo gyvenime. 
                                        Kad jūs evoliuotumėte.
                                    </p>
                                    <p className="text-xs">
                                        Pavyzdžiui, santykiai. Susituokti su tinkamu žmogumi, tinkamu metu, tinkama diena. 
                                        <span className="font-semibold"> Kraujotaka yra karalius.</span> Tai yra teigiamos energijos kūrimo pavyzdys jūsų gyvenime.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Santuoka ir 11 Energija:</p>
                                    <p className="text-xs mb-2">
                                        Susituokti 11 dieną arba paslėptą 20 (11 diena) yra viena geriausių dienų susituokti. 
                                        Ne visiems. Ne 9-oms. Bet apskritai puiku.
                                    </p>
                                    <p className="text-xs">
                                        <span className="font-semibold">11 gali būti viena geriausių energijų tam tikriems dalykams, bet taip pat viena blogiausių.</span> 
                                        Viena blogiausių dienų skraidyti lėktuvu yra 11. Niekada nedarykite operacijos 11 dieną. 
                                        Bet kas, nuo ko priklauso jūsų gyvenimas technologiškai arba nuo kito žmogaus, 
                                        patartina nedaryti to 11 energijos metu.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Metų Paskutinio Skaičiaus Reikšmė:</p>
                                    <p className="text-xs mb-2">
                                        Kitas numerologijos sluoksnis. Paskutinis skaitmuo jūsų gimimo metuose arba metuose. 
                                        Jis turi reikšmę.
                                    </p>
                                    <div className="bg-teal-950/40 rounded p-3 space-y-2">
                                        <p className="text-xs"><span className="font-semibold">1995</span> - 6 universalus metai, bet turi 5 pabaigoje. Žmonės, gimę 1995, linkę būti gražesni ir seksualesni nei kitos Kiaulės.</p>
                                        <p className="text-xs"><span className="font-semibold">1985</span> - daug modelių gimė 1985.</p>
                                        <p className="text-xs"><span className="font-semibold">1993</span> - daug kalba. Gerai sekasi su medijomis.</p>
                                        <p className="text-xs"><span className="font-semibold">1991</span> - turi 1 pabaigoje. 1991 Ožkos turi daugiau lyderystės nei tipinės Ožkos.</p>
                                        <p className="text-xs"><span className="font-semibold">1992</span> - jautresnės nei dauguma Beždžionių.</p>
                                        <p className="text-xs"><span className="font-semibold">1999</span> - turi didelius ego dėl 9 pabaigoje.</p>
                                        <p className="text-xs"><span className="font-semibold">1996</span> - 7 universalus metai. Protingiausias iš 90-ųjų.</p>
                                        <p className="text-xs"><span className="font-semibold">1997</span> - taip pat protingas dėl 7 pabaigoje.</p>
                                        <p className="text-xs"><span className="font-semibold">0 Reikšmė:</span> Jis padidins skaičių pabaigoje. 1980 padidina 8. 1970 padidina 7. 0 yra paradoksas. Jis reiškia nieką, bet gali padidinti skaičių aplink jį.</p>
                                    </div>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Žiurkės Privilegija ir Matrix:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Žiurkė yra Matrix mėgstamiausias vaikas. Žiurkės privilegija.</span> 
                                        Ankstesnėje Matrix versijoje, Katė buvo mėgstamiausia, Žiurkės perėmė dabartinėje versijoje. 
                                        Vis dar yra Katės liekanos įtaka. Tai galime matyti per Toxoplasmosis. 
                                        Iki 33% populiacijos turi šį parazitą. Dauginasi tik katėse. 
                                        Jis veikia nuotaikas, libidą ir kt. Galite matyti tai per beprotes kates turinčias moteris, 
                                        kurios turi 20 kačių. Tai labai aišku.
                                    </p>
                                    <p className="text-xs">
                                        Žiurkės ir Katės varžybos. Žiurkė, užkrėsta šiuo parazitu, gali prarasti baimę ir patekti tiesiai į Katę. 
                                        Ji praras vieną iš savo didžiausių dovanų - pavojaus jausmą.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Toxoplasmosis:</p>
                                    <p className="text-xs mb-2">
                                        Būkite dėmesingi dėl Toxoplasmosis. Tai pripažįstama Rytuose. 
                                        Moteris gali negalėti pagimdyti, jei turi šį parazitą. 
                                        Kiek moterų kovoja su pastojimu dėl būvimo aplink kates. 
                                        Jos gali pastoti, jei yra toli nuo kačių metus. Atvirkštinis efektas.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Vakarietiškos Astrologijos Tikslumas:</p>
                                    <p className="text-xs mb-2">
                                        Vakarietiškoje astrologijoje. Daug paslėptų programų, kalbant apie tai, kas pateikiama viešai.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Kalbant apie galią ir tikslumą:
                                    </p>
                                    <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
                                        <li>Numerologija</li>
                                        <li>Kinų Astrologija</li>
                                        <li>Vakarietiška astrologija (viešai - 66% tikslus)</li>
                                    </ol>
                                    <p className="text-xs mt-2">
                                        Pavyzdžiai: 99% pasakys, kad Libra ir 7-asis namas susiję su santykiais. 
                                        7 iš tikrųjų yra blogiausias santykiuose. Pagal daugumą, Sagittarius yra aukšto išminties ženklas, 
                                        o Gemini - žemo išminties. Bet jei pažiūrėsime į Kinų astrologiją, Sag prasideda Kiaulės mėnesį, 
                                        o Gemini - Gyvatės mėnesį. Spręskite patys, kas protingesnis.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Saulė ir Saturnas:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Saulė ir Saturnas.</span> Jūs labiau panašus į savo Saulės ženklą dieną. 
                                        Jūs labiau panašus į savo Saturno ženklą naktį.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Saturnas pats yra paslėptas okultinis galios centras astrologijos atžvilgiu. 
                                        Nors mes jo nematome kaip Saulės kiekvieną dieną šviečiančios danguje, 
                                        Saturnas valdo daug aspektų. Jis susijęs su sistemomis ir vyriausybe. 
                                        Labai Ožiaragio vyriausybei, yra Vėžlio riaušės, kad tai prieštarautų.
                                    </p>
                                    <p className="text-xs">
                                        Vėžlys prasideda Arklio mėnesį - maištininkas. Ožiaragis prasideda Žiurkės mėnesį. 
                                        Saturnas kaip režisierius. Saulė kaip aktorius. Stipriausios planetinės įtakos yra Saulė ir Saturnas. Yin/yang.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Kinų Astrologijos Deriniai:</p>
                                    <p className="text-xs mb-2">
                                        140 derinių iš Kinų astrologijos, gyvenimo kelio ir vakarietiškos astrologijos. 
                                        Atsižvelgiant į karminę dieną, Saturno ženklą, gimimo laiką, yra eksponentinis unikalių derinių kiekis.
                                    </p>
                                    <p className="text-xs">
                                        Saturnas lieka viename ženkle 2,5 metų. Kaip Kinų astrologijos ženklai gali būti tikslūs, 
                                        jei tai ta pati energija visiems, gimusiems tais pačiais metais? 
                                        Žmonės galvoja mažu mastu. Galvoti labiau kaip elitas, galvoti labiau dešimtmečiais ir šimtmečiais. 
                                        Nubraižykite metus, per šimtmetį, gausite didesnį vaizdą.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Slaptas vs. Aktyvuotas Kodas:</p>
                                    <p className="text-xs mb-2">
                                        Jei 11 gyvenimo keliai yra geriausi sportininkai, o kaip su 11-ais, kurie nepavyksta tapti profesionalais? 
                                        Jei yra daugiau nei 100,000 žmonių, gimusių tą pačią dieną kaip jūs, kodėl jie nėra kaip aš? 
                                        <span className="font-semibold"> Slaptas kodas vs. aktyvuotas kodas.</span>
                                    </p>
                                    <p className="text-xs">
                                        Intelektualiai kalbant, jūs žinote, kad yra 100,000 individų, gimusių tą pačią dieną kaip jūs. 
                                        Jūs manote, kad jie visi yra mąstantys, valingi individai. Praktiškai kalbant, 
                                        jūs vargu ar sutiksite ir bendrausite su daugiau nei keliais iš jų. 
                                        Yra daugiau kaip NPC, veikiantys fone. Keli gali tapti žinomi ir verti dėmesio ir aktyvuoti kodą, 
                                        kuris buvo slaptas matricoje. 99% taps slaptais jūsų realybėje.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Priešingų Įstatymas ir Vengimas:</p>
                                    <p className="text-xs mb-2">
                                        Klaidų vengimas neužtenka dėl priešingų įstatymo. Daugeliu atvejų priešingų įstatymas 
                                        viršija traukos įstatymą. Jei jūs dedate energiją vengdami kažko, tai gali atsirinkti ir grįžti pas jus. 
                                        Daug žmonių sako, kad nori vengti būti kaip jų tėvai, bet nežinodami, 
                                        kad jie manifestuoja tas pačias klaidas kaip jų tėvai ir kartojasi jų tėvus.
                                    </p>
                                    <p className="text-xs">
                                        Žinokite, kada padaryti, kad dalykai įvyktų, ir žinokite, kada vengti. 
                                        Tokiu būdu pasieksite balansą.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Žiurkė ir Jautis - Matrix Poros Detalės:</p>
                                    <p className="text-xs mb-2">
                                        Žiurkė ir Jautis turi sielos draugo santykį. Visada traukia vienas kitą. 
                                        Nereiškia, kad santykis visada bus tobulas ir ramus. Dėl ženklų prigimties. 
                                        Jaučiai viskas apie jautieną.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Vandens ženklai yra geriausi vienas kitam santykiuose. Tačiau santykis yra emocinis, 
                                        pilnas dramos, netvarkingas. Ką jie dažnai mėgsta.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Žiurkė ir Jautis yra Matrix pora. Žiurkė yra Matrix mėgstamiausias vaikas. 
                                        Jautis yra Žiurkės padėjėjas.
                                    </p>
                                    <p className="text-xs">
                                        Matrix maitinasi energija, sukurtą iš dramos, neigiamų emocijų, konflikto. 
                                        Yra toksiški elementai Žiurkės ir Jaučio santykiuose, bet jie grįš kartu.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Draugų Ženklai:</p>
                                    <p className="text-xs mb-2">
                                        Draugų ženklai gali padaryti geriausią ir blogiausią vienas kitam. 
                                        Tačiau jie vis tiek yra unikaliose pozicijose padėti sau.
                                    </p>
                                    <p className="text-xs">
                                        Ožkos baus Katę už smurtą. Gyvatės baus Gaidžius už neištikimybę, 
                                        nes tai yra tai, kuo jie turėtų būti. Šunys gali atvesti blogą Tigrą prieš teisingumą. 
                                        Nepaisant to, vis tiek laikykitės draugų ženklų ir sutelkite dėmesį į teigiamų dinamikų kūrimą su jais.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Saulė ir Saturnas - Dvi Svarbiausios Planetos:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Saulė ir Saturnas.</span> Dvi svarbiausios planetos astrologijoje, 
                                        kaip yin yang. Saulė yra šou centras, dėmesio centras. Ji valdo Leo, pramogų ženklą. 
                                        Visi žino savo Saulės ženklą, nedaug žino savo Saturno.
                                    </p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">Saturnas yra paslėptas okultinis galios centras.</span> 
                                        Jo energija yra visur ir įterpta į dvasinį pasaulį. Yra daug Saturno simbolikos aplink.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Saturnas valdo Ožiaragį ir Vandenį. Saturnas valdo vyriausybę, apribojimus. 
                                        Mes matome, kas vyksta pasaulyje dabar, nes esame Vandenio amžiuje.
                                    </p>
                                    <p className="text-xs">
                                        Saulė taip pat turi paslėptą pusę.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">19 - Ligų/Sveikatos Problemų Skaičius:</p>
                                    <p className="text-xs mb-2">
                                        <span className="font-semibold">19 yra ligų/sveikatos problemų skaičius.</span> 
                                        Gary atskleidė, kad 19 yra neigiamas sveikatai, ypač jauname amžiuje. 
                                        Taigi, nors vadinamasis virusas gali būti pavojingas vyresniems, 
                                        bendras tikslas yra atakuoti jaunesnę kartą, kuri gimsta.
                                    </p>
                                    <p className="text-xs mb-2">
                                        Elitas mėgsta atvirkštinius. Jei apversite 19, gausite 61, gausite 7. 
                                        Tai susiję su 2016. Kai Trump laimėjo 2016 m. ir daug dalykų atsirado. 
                                        Pvz., El. laiškai, Hollywood sekso prekyba, Harvey Weinstein. 
                                        Jie norėjo tai anuliuoti, kad vėl paslėptų, ir pradėjo tai daryti 2019 m.
                                    </p>
                                </div>

                                <div className="border-t border-teal-500/30 pt-3">
                                    <p className="font-semibold text-teal-300 mb-2">Klausimai ir Atsakymai:</p>
                                    <div className="bg-teal-950/40 rounded p-3 space-y-2 text-xs">
                                        <p><span className="font-semibold">Gimę 1999</span> = sudaro 28. Pritrauks daug pinigų.</p>
                                        <p>Kažkas, gimęs tą pačią dieną, mėnesį ir metus. Kažkas, gimęs tą pačią dieną, gali taikytis mažesniu mastu. 
                                        Jūs dalinsitės kai kuriomis šiomis sąsajomis su tais, kurie turi tą patį gimtadienį kaip jūs.</p>
                                        <p>Apskritai, žmonės, gimę tą pačią dieną, gali suprasti vienas kitą, gerai sutarti. 
                                        Bet jei yra kažkas, ko jums nepatinka matyti, jie bus veidrodis.</p>
                                        <p><span className="font-semibold">2000</span> būtų paslėpti 11 metai. Jei pažiūrėsite į skaičių 20, tai yra 11. 
                                        Nulis padidintų 11. Kiekvienas žmogus, gimęs po 2000, turės du savo gimtadienyje, 
                                        tai turės reikšmingą poveikį, kai mes toliau eisime per tūkstantmetį.</p>
                                        <p>Diena, kurią perkate, ir diena, kurią atvykstate, galite žiūrėti kaip du energijos sluoksnius. 
                                        Jei norite nusipirkti kažką 28, tai bus originalus įspaudas.</p>
                                        <p>Nusikirpkite plaukus 28. Visi plaukai, kurie atauga, turės įspaustą 28 energiją. Barzda taip pat. 
                                        Bet kokie plaukai. Plaukai ant mūsų galvų yra labiau susiję su dvasine būtybe, kur yra karūna.</p>
                                        <p>Du master skaičiai gimtadienyje. Jie yra senoji siela. Duokite 11-oms vadovavimą, 
                                        jos turi daug testų gyvenime. 11-os gali būti geriausios iš geriausių arba blogiausios iš blogiausių. 
                                        Arba emociniai teroristai, arba charizmatiški žmonės, kurie įkvepia kitus.</p>
                                        <p>11-oms kontroliuojant emocijas. Likite aktyvūs, formoje, deginti energiją.</p>
                                        <p>2 energija nelygu blogai. Tai tik kaip elitas bando stumti dalykus link neigiamo. 
                                        Jie stumia neigiamą 2 energijos pusę į populiaciją. Kalbant apie žinias, jie tiksliai žino, ką daro. 
                                        Naujasis pasaulio tvarkymas yra tironija per pasyvų sutikimą. Jie visada jums pasako, ką daro. 
                                        Net pasąmonės lygmenyje, jie vis tiek gali gauti jūsų sutikimą ir vengti karminio atsirinkimo.</p>
                                        <p><span className="font-semibold">2022</span> bus įdomūs metai. Žmonės ne tik sėdės. 
                                        Tai Tigro metai, dalykai pablogės prieš pagerėjant.</p>
                                        <p className="mt-3 font-semibold">Papildomi Klausimai ir Atsakymai:</p>
                                        
                                        <div className="bg-teal-950/40 rounded p-3 mt-3 space-y-3">
                                            <p className="font-semibold text-teal-200">Kinų Zodiako Metų Numerologija:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Žiurkės ir Arklio metai sudaro 1, 4 (arba 22) ir 7</li>
                                                <li>Jaučio ir Ožkos metai sudaro 2 (arba 11), 5 ir 8</li>
                                                <li>Tigro ir Beždžionės metai sudaro 3, 6 (arba 33) ir 9</li>
                                                <li>Matai, kaip priešingi ženklai sąveikauja ir silpnina vienas kito energiją</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Karma ir Sielos:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Mūsų sielos yra čia įkalintos. Nėra tokio dalyko kaip gera karma - yra tik bloga karma</li>
                                                <li>Ta bloga karma perduodama į skirtingus gyvenimus</li>
                                                <li>Kaip Federal Reserve laiko mus skolose pinigais, energijos matrica laiko mus skolose energetiniu lygmeniu</li>
                                                <li>Kai einate miegoti, einate į ketvirtą dimensiją - ten yra esybės, kurios siurbia mūsų energiją</li>
                                                <li>Kai esate ten trumpą laiką, jos nespėja daug siurbti jūsų energijos</li>
                                                <li>Kai esate ten ilgą laiką, jos gali su jumis žaisti</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Submaster Skaičiai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>13 ir 28 yra submaster skaičiai - aplink juos yra daug energijos</li>
                                                <li>23 suskaidomas į 2/3 = 0.6667 = 666 - numerologijos skaičius</li>
                                                <li>20 yra paslėptas 11</li>
                                                <li>13 yra paslėptas 33 (1/3 = 0.3333333)</li>
                                                <li>28 yra master turtų statytojas</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">2021 Jaučio Metai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>2021 nebus geras Jaučiui, nors tai yra Jaučio metai</li>
                                                <li>Paskutiniai Jaučio metai 2009 turėjo 9 pabaigoje, o 2021 turi 1 pabaigoje</li>
                                                <li>9 ir 1 yra priešai, ir kadangi numerologija vyrauja prieš astrologiją, Jaučiai neturės gerų metų</li>
                                                <li>Gyvatės turės geriausius metus, nes 2001 ir 2021 atitinka</li>
                                                <li>Žiurkės turės gerus metus, nes 2008 ir 2021 - 8 ir 1 rūpinasi vienas kitu</li>
                                                <li>Gaidžiai (2005) bus neutralūs</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Numerologija Vyrauja:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Numerologija vyrauja prieš astrologiją</li>
                                                <li>Pavyzdys: Kobe/Shaw - 1LP ir 11LP</li>
                                                <li>Santykiuose priešų ženklai vis tiek bus galutinis L, net jei jie suderinami numerologiškai</li>
                                                <li>Svarbumo tvarka: 1) Numerologija, 2) Kinų Astrologija, 3) Vakarietiška Astrologija</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Narkotikai ir Master Skaičiai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Narkotikai kaip crack arba dar blogiau - Crystal Meth yra pavojingi, nes jie atidaro jus nuo užvaldymo</li>
                                                <li>Dar blogiau, jei esate master skaičius 22 arba 33, nes jie jau gali Astral Project</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Įspaustos Energijos:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Jūs esate sudaryti iš kitų įspaustų energijų, ne tik jūsų gyvūno metų ženklo energijos</li>
                                                <li>Būtinai laikas, mėnuo, apvaisinimas ir kt.</li>
                                                <li>Ankstesnė energija lieka, bet nauja įspaustos energija yra šviežia</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Maistas ir Priešai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Neturėtumėte valgyti savo priešo - jūsų maistas suskaidomas ir atstatomas kaip jūsų ląstelės</li>
                                                <li>Jei jūsų ląstelės yra pagamintos iš jūsų priešo, nešate tą energiją, kol ląstelė nemiršta</li>
                                                <li>Avys techniškai yra Ožka - vengti jautienos, jei esate Ožka</li>
                                                <li>Katės turėtų vengti kiaušinių</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Veidrodžiai ir Durys:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Veidrodžiai yra portalai</li>
                                                <li>Durys laikomos sankryžomis - iš esmės kitas portalas</li>
                                                <li>Kaip portalai ir sankryžos demonams ir mirusiems</li>
                                                <li>Taip, jūs galite būti stebimi per veidrodžius</li>
                                                <li>Jie yra kaip stiprintuvai</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Elementai ir Santykiai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Vanduo ir Ugnis ženklai nesusimaišo - kaip mesti ledo kubą į karštą aliejų</li>
                                                <li>Ugniai reikia oro, kad klestėtų</li>
                                                <li>Saulė ir Mėnulis taip pat yra poliariniai priešai</li>
                                                <li>Numerologijos aspektas turėtų būti žiūrimas pirmas - atminkite 4 turi nugarą atsukusią į 5</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Padėti Draugams, Skriausti Priešus:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Padėkite draugams, skriaudžiate priešus</li>
                                                <li>Daryti skaitymą priešo skaičiui/ženklui ir perspėti juos apie įvykį - manau, kad yra karminė skola</li>
                                                <li>Negalite kontroliuoti, kaip kažkas interpretuoja ar naudoja žinias, kurias jiems duodate</li>
                                                <li>Jei jūsų šeima yra priešo ženklas - karminės jungtys jau yra, bet šeima sunki patarti</li>
                                                <li>Lengviausia įtikinti žmones, kai jie yra savo priešo metais, nes jie pradeda matyti modelį</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">9 kaip Master Skaičiai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Galvokite apie 9 kaip master skaičius mokymuisi</li>
                                                <li>Jei jie praeina šią inkarnaciją, jie pakils lygmeniu</li>
                                                <li>Kai kuriuos galite stebėti realiu laiku žlugant, kai kurie yra daug stabilesni ir judės aukštyn</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Sveikata ir Detoksikacija:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Anglis padeda pašalinti toksinus - veikia gerai</li>
                                                <li>Bentonito molis ir Diatomaceous Earth (maisto klasės) taip pat padeda pašalinti sunkiuosius metalus ir toksinus iš kūno</li>
                                                <li>Rūgštinimas skrandžio gali būti puikus virusų žudymui žarnyne - pusė šaukštelio obuolių acto su vandeniu</li>
                                                <li>Kurkuma gydo bet kokias uždegimo problemas, bet dauguma uždegimų prasideda žarnyne</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">5 Energija - Tamsioji Pusė:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>5 energija turi neįtikėtinai stiprų ryšį su mirtimi ir destabilizacija</li>
                                                <li>5PY gali padaryti jus keliauti iš šios plokštumos</li>
                                                <li>Jei 5 yra kūrimas (gyvybė), tai turi būti naikinimas (mirtis) kitoje pusėje</li>
                                                <li>Arba Atgimimo arba Atnaujinimo energija - visi eina ranka su pokyčiu</li>
                                                <li>14/5 yra daug stabilesnis nei 5 ir 23/5 - tikrai geriau žaidžia su 11 energija</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Rašymas ir Magija:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Rašymas raštu ant popieriaus su rašikliu leidžia jūsų ego/i išreikšti save (daugiau asmenybės rašte) = jūsų magija smogia skaitytoją stipriau</li>
                                                <li>Rašymas jūsų parašo ant kontrakto raštu yra užkeikimas ir prakeikimas yra užmestas, jei pažeidžiama</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Divinacijos Sistemos:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Runes naudojami taip pat kaip tarot - jų vertė yra tokia pati kaip kortų kaladė</li>
                                                <li>Manau, kad visi turi divinacijos sistemą, kuri geriausiai veikia jiems, remiantis jų protėvių kilme</li>
                                                <li>Magija yra visur, bet sistema, kurią naudojate, REMIANTIS JŪSŲ PROTĖVIŲ KILME, duos optimalius rezultatus</li>
                                                <li>Lengviausias būdas supykdyti dvasias, kurios juos valdo, yra praktikuoti be leidimo ar ryšio</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">28 Kiaulės ir Finansai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Niekada nepasitikėkite 28 Kiaule su finansais</li>
                                                <li>Visos godžios kiaulės žino, kaip daryti, yra vartoti</li>
                                                <li>Tai tik apie 28 kiaules</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Saturnas ir Saulė:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>SATURN valdo mūsų matricą, bet SAULĖ valdo sol ra sistemą</li>
                                                <li>Saturnas anksčiau buvo SAULĖ techniškai taip pat</li>
                                                <li>Siela = sol = saulės sistema</li>
                                                <li>Siela priklauso matricai</li>
                                                <li>Jei matrica būtų sunaikinta su viskuo joje, dvasia liktų</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Žemė ir Širdis:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Žemė = Širdis</li>
                                                <li>Kaip viduje, taip ir lauke</li>
                                                <li>Kiek planetų turi saulę viduje? Tai atsakymas</li>
                                                <li>Žemės branduolys yra Saulė/SŪNUS arba širdis - taip pat turi pulsą ir magnetinį polį, kaip širdis</li>
                                                <li>Žemė, Saulė ir Saturnas visi puikiai tinka vienas kitam</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Karma ir Inkarnacijos:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Viskas pagrįsta karma</li>
                                                <li>Turite galvoti sielos lygmeniu</li>
                                                <li>Kaip pasirenkate tėvus - remiantis tuo, kas reikalinga jūsų sielos patirčiai</li>
                                                <li>Jūs nuspręstate tarp gyvenimų</li>
                                                <li>Mes pasirašome būti šio pasaulio dalimi</li>
                                                <li>Žmonės, gimę su negaliais - tai karma, ignoruotos gyvenimo pamokos</li>
                                                <li>Visi ligos prasideda išoriniuose kūnuose - jei ignoruojate juos, jie pasireiškia fiziniame</li>
                                                <li>Siela, kuri nusipelno neįgalaus kūno, pasirinktų apgyvendinti tą deformuotą kūną</li>
                                                <li>Siela nori daryti teisingą dalyką - mokėti karminę skolą</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Vardai ir Galia:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Dalyko vardas yra dalykas - jie turi neįtikėtiną svarbą</li>
                                                <li>Žinant dalyko vardą, suteikia jums galios prieš tą dalyką</li>
                                                <li>Visada intuityviai reikalavau vadinti žmones jų duotu vardu, nepriklausomai nuo to, ką jie naudoja ar pravardės</li>
                                                <li>Mergautinė pavardė arba tėvo duotas vardas tik identifikuoja klaną, iš kurio kilęs</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">9 kaip Portalai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>9 dažniausiai yra portalai (jie yra veidrodžiai/geri veidrodžiuoti)</li>
                                                <li>Jei esate 9LP, labai mažai tikėtina, kad esate portalas</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Master Skaičiai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Master Skaičiai nuolat testuojami gyvenime</li>
                                                <li>Jei meluojame arba pažeidžiame taisykles - mokame už tai</li>
                                                <li>Master Skaičiai turi ypatingas dovanas, kol jie atitinka savo vibraciją</li>
                                                <li>Kai kurie 11 užsikabins savo traumose ir negali/negyvena iki savo pilno potencialo</li>
                                                <li>Tai taikoma visiems master skaičiams</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Besieliai Žmonės:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Dauguma besieliai individai būtų "bijoti" dalykų kaip GG33, nes jie tiesiog negali suprasti informacijos</li>
                                                <li>Jie atakuotų tokius dalykus</li>
                                                <li>Jie nekenčia tų, kurie turi sielas, ir tai bus akivaizdu</li>
                                                <li>Jie čia, kad juos laikytų eilėje</li>
                                                <li>Žmonės be sielų turi keistus veidus</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Vaikų Turėjimas Priešo Metais:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Turėti vaikų priešo metais yra kodėl daug moterų miršta jaunai</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Tatuiruotės:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Jei gaunate tatuiruotę, turite pagalvoti, kaip tai paveiks jūsų kūną</li>
                                                <li>Jei gaunate savo ženklo tatuiruotę, tai reiškia, kad kiekvienais priešo metais gausite tiek daugiau smūgių</li>
                                                <li>Geriausia vieta tatuiruotei - ranka (arm pirmoji balsė A, tattoo pirmoji balsė A)</li>
                                                <li>Jei esate Vandenys, geriausia vieta yra blauzda (calf pirmoji balsė A)</li>
                                                <li>Kiaulės neturėtų gauti tatuiruotės - vienintelis ženklas, kuris neturi T, A arba O raidžių tatuiruotės žodyje</li>
                                                <li>9 neturėtų gauti tatuiruotės - 9 pirmoji balsė I, nėra I raidžių tatuiruotės žodyje</li>
                                                <li>Kiekvienas astrologijos ženklas turi vietą: Avinas - galva, Jautis - kaklas, Dvyniai - rankos, Vėžys - krūtinė, Liūtas - nugaros apačia, Mergelė - pilvo sritis, Svarstyklės - nugaros, Skorpionas - privati sritis, Šaulys - šlaunys, Ožiaragis - keliai, Vandenys - blauzdos, Žuvys - pėdos</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">2022 Tigro Metai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>1914 - Pirmasis Pasaulinis Karas prasidėjo Tigro metais (6 universalūs metai)</li>
                                                <li>1950 - Korėja - Amerika įsitraukė, Kinija pradėjo puolimą (Tigro metai)</li>
                                                <li>1986 - Černobylio katastrofa Ukrainoje (Tigro metai, 6 universalūs metai)</li>
                                                <li>2022 - Tikėtina karas - ne tik dėl Tigro metų, bet ir dėl 6 universalaus meto</li>
                                                <li>Karas sudaro 6, o 6 energijoje turėsite daugiau karo</li>
                                                <li>Beždžionėms - nesiimkite nereikalingų rizikų, jie greičiausiai atsivers</li>
                                                <li>Beždžionėms - nesusituokite, neturėkite vaikų Tigro metais</li>
                                                <li>Tigrai - geriausias metai raumenims kurti, geriausias metai būti agresyvesniems</li>
                                                <li>Intelektiniai siekiai nebus pirmame plane šiais metais</li>
                                                <li>Tigrai turi unikalų skirtumą - gyvena ilgiausiai ir miršta jauniausiai</li>
                                                <li>Tigro moterys yra alfa savo būdu - dauguma čempionių moterų bodybuilderių yra Tigrai</li>
                                                <li>7 dienos šiais metais yra tiek daug svarbesnės, nes reikia dėvėti mąstymo kepurę</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Amerikos Ekonomika:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Amerika yra Beždžionė - tikėtina, kad Amerikos ekonomika eis į pragarą</li>
                                                <li>Tikėtina, kad tai įvyks po Olimpinių žaidynių</li>
                                                <li>Amerika yra 7 metų cikle, pereinant į 8 metų ciklą po priešo - tai susiję su finansais</li>
                                                <li>Kriptovaliutos ne šiais metais - nors kriptovaliutos yra ateitis, bet ne šiais metais</li>
                                                <li>Auksas gali būti gera prekė defliacijos atveju</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Beždžionės Valstijos JAV:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Arkansas, Connecticut, Louisiana, Wisconsin, South Carolina, New York, Virginia, New Hampshire, Michigan, Maryland</li>
                                                <li>Jei esate Amerikoje (Beždžionės šalis) ir Beždžionės valstijoje ir esate Beždžionė - tai trigubas smūgis</li>
                                                <li>Kazino šiose valstijose gali duoti pinigus šiais metais</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Akcijos ir Verslas:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Raskite 10 įmonių, įkurtų Beždžionės metais - trumpai jų akcijas, 7-8 pataikys</li>
                                                <li>Ieškokite CEO, gimusių Beždžionės metais - trumpai jų akcijas</li>
                                                <li>Kitais metais bus Katės metai - ieškosime Gaidžių CEO ir Gaidžių įmonių</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Plaukų Kirpimas:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Beždžionėms - nukirpkite plaukus prieš Tigro metus (Jaučio metais)</li>
                                                <li>Kai kirpate plaukus, įspaudžiate naują energiją</li>
                                                <li>Įspaudžiant paskutinį kirpimą Jaučio metais prieš Tigro metus - turite tą energiją</li>
                                                <li>Kai kuriuo metu turėsite nukirpti plaukus Beždžionės metais - tai greičiausiai jus atitolins</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Priešo Metai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Geriausias dalykas priešo metais - būti atsargiems</li>
                                                <li>Kartais matrica, jei negali jus gauti asmeniniu lygmeniu, eis po jūsų šeimos arba gaus jus per jūsų draugus</li>
                                                <li>Jei esate vyras, karščiausia mergina ateis prie jūsų ir pasiūlys vienos nakties santykius</li>
                                                <li>Jei esate moteris, gausite paaukštinimą persikelti kažkur, kur mokės daugiau</li>
                                                <li>Tai sunku atsisakyti, bet turėtumėte - taip matrica jus nustato pralaimėjimui</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Vakarietiško ir Kinų Zodiako Derinimas:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Pavyzdys: Ožiaragis (10-asis ženklas) ir Gyvatė (6-asis ženklas) = 10+6 = 16 = 1+6 = 7</li>
                                                <li>Lebron James: Ožiaragis (10) ir Žiurkė (1) = 11</li>
                                                <li>Rat Cancer: Vėžys (4) ir Žiurkė (1) = 5 - turės 5 charakteristikas, bus gerai atrodantys</li>
                                                <li>Tai dar vienas įrankis įrankių dėžėje - taip derinate numerologiją su astrologija</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Užkeikimų Nutraukimas:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Yra būdas nutraukti užkeikimą arba prakeikimą - atvirkščiai, karminis ciklas turi būti uždarytas</li>
                                                <li>Bet turite žinoti, kokios magijos buvo padaryta</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Portalai ir Pasauliniai Karai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Manau, kad portalas buvo atidarytas per pasaulinius karus</li>
                                                <li>Jie duoda mums dalykus, tada jie turi dalykus 1000 kartų geresnius</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Fizinė Sveikata:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Yra vitaminas, kuris padidina regėjimą - galite rasti iHerb</li>
                                                <li>Haritaki ir Lion's Mane padeda</li>
                                                <li>Vizualizuokite ir medituokite, praktikuokite stiprinant tą kankorėžinę liauką</li>
                                                <li>Ne visi pastatyti vienodai - kai kurie žmonės turi "išvalyti savo šventyklą"</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Sapnai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Sapnas pirmoji balsė E - E yra 5-oji raidė</li>
                                                <li>Jūs esate atviraus proto ir keliaujate į kitą sritį</li>
                                                <li>Sritis pirmoji balsė taip pat E</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">5 ir 11 Kombinacija:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>11 ir 5 yra labai atviri apskritai, ir kombinacija tiesiogine prasme turi juos "gyvenantys ant laukinės pusės"</li>
                                                <li>Daug nereikalingų rizikų ir veiksmų, pagrįstų emocijomis</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">38 vs 29:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>38 yra daug materialistiškesni - jie geriausiai subalansuoja dvasinį su materialiu</li>
                                                <li>Tai stabilesnė energija nei 29</li>
                                                <li>29 yra meilės ir šviesos žmonės - neturi to balanso</li>
                                                <li>Neigti tamsos egzistavimą yra pavojinga ir pavers jus grobiu</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Trianguliacijos Ciklai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Pavyzdys: Katė yra 4-asis ženklas, ateina į (1(Žiurkė, Gaidys**), 4(Katė), 7(Arklys)) trikampį</li>
                                                <li>Kai Katė tampa 33 metų, jis/ji bus Žiurkės metais</li>
                                                <li>Žiurkės metai ateina (3,6,9) metų cikle Katės - Katė kaip 9, 21(3), 33, 45(9), 57(3), 69(6), 81(9), 93(3), 105(6) metų Žiurkės metais</li>
                                                <li>Priešų ženklai negali būti skaičiuojami trikampyje</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">100 Metų Ciklas:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Eikite atgal kas 100 metų - visada bus ankstesnis ženklas trikampyje</li>
                                                <li>2007 Kiaulės metai, tada atgal 100 metų yra 1907 Ožkos metai, tada atgal 100 metų yra 1807 Katės metai ir taip toliau</li>
                                                <li>Sunku sugadinti, kai žinote matematiką</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Baimė ir Mirties Nebijojimas:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Šiuo metu, jei bijome mirties, mes nepakankamai išsivystėme</li>
                                                <li>Baimė yra žemiausio lygio vibracija</li>
                                                <li>Baimė iš esmės yra demonų fabrikas</li>
                                                <li>Mes žinome, kad po mirties yra gyvenimas - bijoti mirti yra bijoti savo prigimties</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Religijos Tekstai:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Manau, kad svarbu, jei studijuojate bet kokius religinius tekstus, studijuoti visus religinius tekstus</li>
                                                <li>Biblija tik pasako, kas būtina išgelbėjimui - tai viskas</li>
                                                <li>Biblija kilusi iš Korano ir Toros</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Atsiskyrimo Įstatymas:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Atsiskyrimo įstatymas prieš pritraukimo įstatymą</li>
                                                <li>Turime sumažinti svarbą pirmiausia savo tikslams - kitaip priešingybė to, ką manifestuojate, materializuosis</li>
                                                <li>Tai taip pat apie Matricą, nors žodis niekada nenaudojamas</li>
                                                <li>Neigiamas materializuojasi daug lengviau nei teigiamas, nes užaugome su juo</li>
                                                <li>Kai dedame daugiau svarbos ir troškimo, tai suaktyvina priešingų įstatymą</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Kinų Kalendorius:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Kinų kalendorius yra grynas mėnulio x saulės ciklų skaičiavimas - panašiai kaip daug kitų praeities civilizacijų</li>
                                                <li>Prieš Cezarą buvo tik 10 mėnesių kalendoriuje</li>
                                                <li>Buvo 9 planetos, jei įtraukėte Plutoną - buvo "prarasta planeta", kurią Svarstyklės turėtų sekti</li>
                                            </ul>
                                            
                                            <p className="font-semibold text-teal-200 mt-3">Žiurkė ir Šuo:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                                <li>Žiurkė 1-asis ženklas, Šuo 11-asis ženklas - Draugai</li>
                                            </ul>
                                        </div>
                                        
                                        <p><span className="font-semibold">Šalies įspaustos energijos analizė:</span> 
                                        Pažiūrėkite į šalies naujausią konstituciją ir taip pat jos įkūrimo datą. 
                                        Pvz., Rusijos naujausia konstitucija yra Ožkos metai, o ji taip pat turi stiprią Ožkos energijos istoriją. 
                                        Studijuokite šalies istoriją, rasite daug modelių. Taip pat atsižvelkite į dabartinį šalies lyderį, 
                                        jis turės stiprų poveikį energijai.</p>
                                        <p><span className="font-semibold">Pabudinti Pinealinę Liauką:</span> 
                                        Miegoti visiškame tamsyje, vitaminas D yra geras receptas pabudinti pinealinę liauką.</p>
                                        <p><span className="font-semibold">Mėnulio Fazės:</span> 
                                        Nėra svarbiausias aspektas, į kurį reikia sutelkti dėmesį. 
                                        Sekti savo numerologiją bus galingiau. Tas pats su turtų kūrimu.</p>
                                        <p><span className="font-semibold">22 Gali Turėti Blogą Pusę:</span> 
                                        Tai turėtų būti tikėtina. Ne gera idėja miegoti per daug 22 dieną, taip pat 8 dieną. 
                                        Galite turėti bjaurias esybes, sukeliančias baimę jūsų viduje, kad jos galėtų maitintis ta energija jūsų miegu. 
                                        Geriausias būdas susidoroti su tuo yra nepergalvoti. Jei norite jas išvyti, darykite tai.</p>
                                        <p><span className="font-semibold">Saturnas Taure:</span> 
                                        Tauras yra natūralus bankininko ženklas. Viską, ką darote, darykite lėtai, negalite skubėti, 
                                        tiesiog statykite, statykite, statykite.</p>
                                        <p><span className="font-semibold">11 Neigiamas Aspektas:</span> Teroras.</p>
                                        <p><span className="font-semibold">Karminiai ir Genetiniai Modeliai Šeimose:</span> 
                                        Pvz., Panašūs gyvenimo keliai toje pačioje šeimoje.</p>
                                        <p><span className="font-semibold">Master Skaičiai:</span> 
                                        Žmonės sako, kad turi daug master skaičių aplink, bet jie yra ten pasodinti, 
                                        nes kartais tie master skaičiai yra mieguisti. Master skaičius, kuris nėra pabudęs, gali būti pavojingas. 
                                        Kartais turite duoti jiems šiek tiek stūmimo, kad pabudtų.</p>
                                        <p><span className="font-semibold">22-oji Diena:</span> 
                                        22-oji yra tokia stipri energija, kad ji iš tikrųjų veikia dienas aplink ją. 
                                        21-oji ir 23-oji. Jūs pajusite tą įtaką nuo 22-osios, jei gimėte 21 d. 
                                        Jūs vis tiek statote ant 22, net jei tai priešų energija.</p>
                                        <p><span className="font-semibold">Šeimos Karmiškai Susietos:</span> 
                                        Galite pasakyti, kad turite sielos šeimą. Kartų atžvilgiu galite matyti modelius, 
                                        kurie atsiranda. Jei pažiūrėsite į Rothschild. Patriarchas Mayer Amschel Rothschild gimė 1744. 
                                        Jis turėjo penkis sūnus, trys buvo Tauras. Jis juos išsiuntė statyti bankus visoje Europoje. 
                                        Tauras yra bankininko ženklas. Jis naudojo astrologiją, kad sukurtų šeimos galią. 
                                        Modernusis Rothschild patriarchas taip pat yra Tauras.</p>
                                        <p><span className="font-semibold">"Elitas":</span> 
                                        Iki 13 metų jie gyvena normalų gyvenimą. Kai jie tampa 13, jie juos atskiria ir 
                                        nuveda į naktinę mokyklą ir mokomi, kaip viskas tikrai yra.</p>
                                        <p><span className="font-semibold">Košmarai:</span> 
                                        Ne būtinai susiję su karminėmis skolomis. Priklauso nuo to, apie ką tai, 
                                        jei turite košmarus apie tikrą šeimą, jų prisiminimus, tai gali būti tam tikra karma. 
                                        Yra tam tikros esybės, kurios gali prisirišti prie tam tikrų šeimų, 
                                        todėl turite pažiūrėti į sapno detales.</p>
                                        <p><span className="font-semibold">Kartų Prakeikimai:</span> 
                                        Tai yra dalykas. Net elitas susiduria su tuo. 1300-aisiais jie sudarė sandėrį, 
                                        kad manifestuotų juodąją marą, išnaikindami 1/3 Europos, leisdami jiems sukaupti daug galios. 
                                        Bet tai reiškia, kad jie taip pat turi sudaryti sandėrį su esybe, su kuria sudarė sandėrį, 
                                        kad gautų šią galią. Jie turi sumokėti tą skolą.</p>
                                        <p><span className="font-semibold">Laiko Kelionės:</span> 
                                        Galite keliauti į praeitį, ne į ateitį. Nes ateitis yra melas. 
                                        Ir dabartis yra pre-sent (pateikta iš anksto). Taip pat daug laiko keliautojų linkę būti aukšti. 
                                        Žiūrint į kažką kaip Keanu Reeves, 4LP. Bet koks filmas, kuriame buvo Keanu Reeves, 
                                        tai yra patvirtinimas, tai svarbu, galite ką nors iš to paimti. 
                                        Ir jis yra Drakonas, tai taip pat turi vaidmenį.</p>
                                        <p><span className="font-semibold">Praeities Gyvenimai:</span> 
                                        Turėsite naudoti skirtingus šaltinius ir metodus, kad pasakytumėte praeities gyvenimus, 
                                        bus sunku pasakyti, kuris yra klaidingas arba teisingas. 
                                        Nėra mokslinio metodo rasti savo praeities gyvenimą. Vandens ženklai, 
                                        jei juos įdėsite į depravacijos baką. Jie gali patekti į savo praeities gyvenimus.</p>
                                        <p><span className="font-semibold">Akashic Records:</span> 
                                        Praeityje Akashic Records buvo kaip internetas. Bet vietoj to, 
                                        mes galėjome prieiti prie to viduje, per telepatiją. 
                                        Kadangi šis gebėjimas, kuris kadaise buvo vidinis, dabar yra išorinis, 
                                        tai vėliau turės pasekmių žmonijai.</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Numerology and Chinese Astrology in History */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="history"
                            title="🔍 Numerologija ir Kinų Astrologija Istorijoje"
                            isOpen={expandedSections['history'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Numerologija Kinų Astrologija Istorijoje History')}
                        >
                            <div className="bg-rose-900/30 border border-rose-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    Numerologija ir Kinų Astrologija gali būti naudojamos iššifruoti istoriją. 
                                    Tai dažnai trūkstama grandis, kuri gali patvirtinti arba paneigti teoriją ar paaiškinimą 
                                    dėl istorijos dalies.
                                </p>
                                <div className="bg-rose-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-rose-300 mb-2">Kinų Astrologijos Santykiai Istorijoje:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                                        <li><span className="font-semibold">Ten, kur yra Jautis, dažniausiai yra Žiurkė</span> (ir atvirkščiai)</li>
                                        <li>Žiurkė nėra didelė viešumoje, bet mėgsta kontroliuoti užkulisiuose</li>
                                        <li>Arklys yra Žiurkės priešas - Arklys gali atskleisti, kas vyksta užkulisiuose</li>
                                        <li>Beždžionė yra Žiurkės draugas - gali dirbti kartu</li>
                                    </ul>
                                </div>
                                <div className="bg-rose-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-rose-300 mb-2">Numerologijos Pavyzdžiai:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                                        <li><span className="font-semibold">11</span> - dažnai susijęs su svarbiais įvykiais (pvz., 9/11, 110 aukštų bokštai)</li>
                                        <li><span className="font-semibold">5</span> - susijęs su Pentagonu (5 kraštinės, 5 aukštai, 5 žiedai)</li>
                                        <li><span className="font-semibold">33</span> - master number, gali reikšti užbaigimą arba aukščiausią išraišką</li>
                                        <li><span className="font-semibold">7</span> - genius protas, gali atskleisti paslaptis</li>
                                    </ul>
                                </div>
                                <p className="text-xs italic text-white/70">
                                    Pastaba: Numerologija ir Kinų Astrologija gali būti naudojamos analizuojant istorinius įvykius 
                                    ir asmenis, tačiau reikia atsargiai interpretuoti informaciją.
                                </p>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Astrological Houses Introduction */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="astrological-houses"
                            title="🏠 Astrologijos Namai - Įvadas"
                            isOpen={expandedSections['astrological-houses'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Astrologijos Namai Houses')}
                        >
                            <div className="bg-violet-900/30 border border-violet-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    Astrologijoje yra <span className="font-semibold text-violet-300">12 namų</span>. 
                                    Įsivaizduokite, kad namai yra kaip 12 skirtingų kambarių dideliame name. 
                                    Kiekvienas kambarys turi skirtingą temą ir paskirtį.
                                </p>
                                <p>
                                    Pavyzdžiui, vienas kambarys skirtas jums pačiems, kitas - jūsų vaikams, 
                                    dar kitas - jūsų tėvams ir t.t.
                                </p>
                                <p>
                                    Taip pat kiekvienas iš 12 astrologijos namų valdo skirtingus jūsų gyvenimo sritis.
                                </p>
                                <p>
                                    Pavyzdžiui:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><span className="font-semibold">1-asis namas</span> valdo jūsų save</li>
                                    <li><span className="font-semibold">5-asis namas</span> valdo jūsų vaikus</li>
                                    <li><span className="font-semibold">4-asis namas</span> valdo jūsų motiną ir t.t.</li>
                                </ul>
                                <p>
                                    Namai numeruojami nuo 1 iki 12, pradedant nuo kylančio ženklo ir eidami prieš laikrodžio rodyklę.
                                </p>
                                <div className="bg-violet-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-violet-300 mb-1">Svarbu:</p>
                                    <p className="text-xs">
                                        Kylantis ženklas = Ascedentas = Pirmasis namas. Šie terminai naudojami pakaitomis.
                                    </p>
                                </div>
                                <p>
                                    Namai jums pasako, kur planetos ir zodiako ženklai veikia jūsų gyvenimą.
                                </p>
                                <div className="bg-violet-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-violet-300 mb-2">Pavyzdys: Venera 1-ame name</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                                        <li><span className="font-semibold">1-asis namas</span> = Save, išvaizda, kūnas</li>
                                        <li><span className="font-semibold">Venera</span> = žavesys, patrauklumas, grožis, harmonija, muzika</li>
                                    </ul>
                                    <p className="text-xs mt-2 italic">
                                        Venera jūsų 1-ame name reiškia, kad turite žavingą ir patrauklią asmenybę. 
                                        Jūs esate traukiami grožio ir harmonijos sau ir kitiems. 
                                        Galite turėti talentą menui ar muzikai, arba gebėjimą priversti žmones jaustis gerai.
                                    </p>
                                </div>
                                
                                <div className="border-t border-violet-500/30 pt-4 mt-4">
                                    <p className="font-semibold text-violet-300 mb-3">Pirmųjų 6 Namų Reikšmės (Vedinė Astrologija):</p>
                                    <div className="space-y-4">
                                        <div className="bg-violet-950/40 rounded p-3">
                                            <p className="font-semibold text-violet-300 mb-1">1-asis Namas (Ascedentas / Kylantis Ženklas):</p>
                                            <p className="text-xs mb-2">
                                                Asmenybė, charakteris, fizinės savybės, fizinis kūnas, sveikata, bendra stiprybė. 
                                                Tai svarbiausias namas horoskope - gyvenimo vartai. Rodo, kaip asmuo pristatosi pasauliui, 
                                                kaip jis žiūri į gyvenimą ir kokia jo pagrindinė prigimtis.
                                            </p>
                                            <p className="text-xs text-violet-200 italic">Kūno dalys: galva, viršutinė veido dalis</p>
                                        </div>
                                        
                                        <div className="bg-violet-950/40 rounded p-3">
                                            <p className="font-semibold text-violet-300 mb-1">2-asis Namas:</p>
                                            <p className="text-xs mb-2">
                                                Turtas, turtai, šeima, kalba, vertybės ir savęs vertė. Rodo, kaip asmuo uždirba pinigus, 
                                                kokie ištekliai yra arba trūksta, kaip jis susijęs su šeima, ką jis vertina gyvenime ir 
                                                kaip jis jaučiasi apie save.
                                            </p>
                                            <p className="text-xs text-violet-200 italic">Kūno dalys: akys, burna, veidas, balsas</p>
                                        </div>
                                        
                                        <div className="bg-violet-950/40 rounded p-3">
                                            <p className="font-semibold text-violet-300 mb-1">3-asis Namas:</p>
                                            <p className="text-xs mb-2">
                                                Komunikacija, broliai/seserys, kaimynai, trumpos kelionės, įgūdžiai ir drąsa. Rodo, kaip 
                                                asmuo sąveikauja su artimiausia aplinka, kaip jis komunikuoja, kaip jis sutaria su 
                                                broliais/seserimis ir kaimynais, kaip keliauja, kokius įgūdžius turi ir koks drąsus.
                                            </p>
                                            <p className="text-xs text-violet-200 italic">Kūno dalys: ausys, pečiai, rankos, plaučiai</p>
                                        </div>
                                        
                                        <div className="bg-violet-950/40 rounded p-3">
                                            <p className="font-semibold text-violet-300 mb-1">4-asis Namas:</p>
                                            <p className="text-xs mb-2">
                                                Namai, motina, emocijos, komfortas ir saugumas. Rodo, kaip asmuo jaučiasi namuose, 
                                                kaip jis susijęs su motina ar motiniškomis figūromis, kaip jis išreiškia emocijas, 
                                                kokio komforto ir saugumo ieško ar teikia, kokios jo šaknys ir pagrindai.
                                            </p>
                                            <p className="text-xs text-violet-200 italic">Kūno dalys: krūtinė, krūtys, širdis (iš dalies)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Vedic Astrology Planetary Meanings */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="vedic-planets"
                            title="🔮 Vedinės Astrologijos Planetų Reikšmės"
                            isOpen={expandedSections['vedic-planets'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Vedinės Astrologijos Planetų Reikšmės Vedic Planets')}
                        >
                            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    Kiekviena mūsų gyvenimo detalė gali būti iššifruota naudojant Vedinę Astrologiją. 
                                    Planetų padėtys horoskope gali nurodyti konkrečius gyvenimo įvykius.
                                </p>
                                <div>
                                    <p className="font-semibold text-indigo-300 mb-2">Planetų Reikšmės:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li><span className="font-semibold">Mercury (Merkurijus)</span> = Automobilis, Kelionės</li>
                                        <li><span className="font-semibold">Mars (Marsas)</span> = Ataka, Smurtas</li>
                                        <li><span className="font-semibold">Aries (Avinas)</span> = Galva</li>
                                    </ul>
                                </div>
                                <div className="bg-indigo-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-indigo-300 mb-1">Pavyzdys:</p>
                                    <p className="text-xs italic">
                                        Prezidentas JFK buvo nušautas galvoje, važiuodamas prezidento korte. 
                                        JFK horoskope Merkurijus ir Marsas buvo kartu Avinyje. 
                                        Merkurijus (automobilis) sujungtas su Marsu (ataka, kulkos) Avinyje (galva) 
                                        paaiškina, kodėl jis buvo nušautas galvoje automobilyje.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Zodiac Energy in Branding */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="zodiac-branding"
                            title="💎 Zodiako Energija Prekių Ženkluose"
                            isOpen={expandedSections['zodiac-branding'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Zodiako Energija Prekių Ženkluose Branding')}
                        >
                            <div className="bg-amber-900/30 border border-amber-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    ROLEX yra labiausiai atpažįstamas prabangos laikrodžių prekės ženklas. 
                                    Astrologijoje LEO valdo prabangą ir premium prekių ženklus.
                                </p>
                                <p>
                                    Atkreipkite dėmesį, kaip <span className="font-semibold text-amber-300">R(OLE)X</span> turi 
                                    <span className="font-semibold text-amber-300"> LEO</span> savyje?
                                </p>
                                <p className="italic">
                                    LEO (Liūtas vadinamas džiunglių karaliumi ne be priežasties)
                                </p>
                                <p>
                                    Tai vienas iš daugelio būdų, kaip galite įterpti zodiako energiją į savo prekės ženklo 
                                    pavadinimą sėkmei!
                                </p>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Empty Houses */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="empty-houses"
                            title="🏠 Ką Reiškia Tušti Namai? 🤔"
                            isOpen={expandedSections['empty-houses'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Tušti Namai Empty Houses')}
                        >
                            <div className="bg-teal-900/30 border border-teal-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    Tušti namai yra gana dažni. Yra 9 planetos ir 12 namų, todėl tikrai turėsite keletą tuščių namų.
                                </p>
                                <p>
                                    Namo reikšmė išlieka ta pati, nesvarbu ar jis tuščias, ar jame yra planeta.
                                </p>
                                <p>
                                    Tačiau būdas, kaip interpretuojate šiuos namus, skirsis.
                                </p>
                                <p>
                                    Kaip minėta anksčiau, kiekvienas namas valdo skirtingus jūsų gyvenimo aspektus, 
                                    tokius kaip meilė, vaikai, karjera, finansai ir kt.
                                </p>
                                <div className="bg-teal-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-teal-300 mb-1">Pavyzdys:</p>
                                    <p className="text-xs">
                                        Jei Mėnulis yra jūsų 5-ame name, jis pirmiausia veikia jūsų meilę, 
                                        romantiką ir vaikus. Jei jūsų 5-asis namas tuščias, jūsų meilės ir 
                                        romantinio gyvenimo formavimą pirmiausia formuoja 5-ojo namo valdovas 
                                        ir planetos, kurios aspektuoja 5-ąjį namą.
                                    </p>
                                </div>
                                <p className="font-semibold text-teal-300">
                                    Net su tuščiais namais galite gauti vertingų įžvalgų, nagrinėdami tuščio 
                                    namo valdovą ir jo ryšius su kitomis planetomis jūsų horoskope!
                                </p>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Cosmic Clock */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="cosmic-clock"
                            title="⏰ Kosminis Laikrodis"
                            isOpen={expandedSections['cosmic-clock'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Kosminis Laikrodis Cosmic Clock')}
                        >
                            <div className="bg-cyan-900/30 border border-cyan-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-2">
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li><span className="font-semibold text-cyan-300">Kasdieninis Ciklas</span> = Mėnulis</li>
                                    <li><span className="font-semibold text-cyan-300">Mėnesinis Ciklas</span> = Saulė</li>
                                    <li><span className="font-semibold text-cyan-300">Metinis Ciklas</span> = Jupiteris</li>
                                </ul>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Crystal Programming */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="crystal-programming"
                            title="💎 Kristalų Programavimas"
                            isOpen={expandedSections['crystal-programming'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Kristalų Programavimas Crystal Programming')}
                        >
                            <div className="bg-pink-900/30 border border-pink-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                <div>
                                    <p className="font-semibold text-pink-300 text-base mb-2">
                                        VISI KRISTALAI TURI BŪTI PROGRAMUOJAMI PRIEŠ NAUDOJIMĄ!
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-2">
                                        <li><span className="font-semibold">Suderinkite jį su savo energija</span></li>
                                        <li><span className="font-semibold">Kalbėkite su juo!</span> Pasakykite, ko norite iš jo</li>
                                        <li>Jūsų akmuo yra kaip augalas</li>
                                        <li>Jūsų žodžiai yra vibracijos</li>
                                        <li>Stiprinkite savo aurą ir energiją su gamta</li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-pink-500/30 pt-4">
                                    <p className="font-semibold text-pink-300 mb-2">🏛️ Kristalų Sargai: Elitas ir Dieviškumas</p>
                                    <p>
                                        Elitas ir faraonai senovės Egipte turėjo ypatingą susidomėjimą kristalais. 
                                        Jie puošėsi kristalų papuošalais, kruopščiai pagamintais iš brangiųjų metalų ir 
                                        brangakmenių. Kristalai buvo matomi kaip galios, apsaugos ir dieviškumo simboliai. 
                                        Faraonai buvo palaidami su kristalais, tikėdami, kad šie brangakmeniai ves jų 
                                        sielas pomirtiniame gyvenime, užtikrindami sklandų perėjimą ir amžiną dvasinę apsaugą.
                                    </p>
                                </div>
                                
                                <div className="border-t border-pink-500/30 pt-4">
                                    <p className="font-semibold text-pink-300 mb-2">✨ Piritas: Spindintis Manifestacijos Kubas</p>
                                    <p>
                                        Piritas, dar žinomas kaip "Kvailio Auksas", yra kristalas, turintis unikalų ryšį su 
                                        šventąja geometrija, ypač kubu. Kubas yra šventa geometrinė forma, reprezentuojanti 
                                        stabilumą, pagrindą ir įžeminimo energiją. Senovės egiptiečiai atpažino pirito 
                                        panašumą į tobulą kubą ir priskyrė galingas savybes šiam auksiniam brangakmeniui. 
                                        Jie žinojo, kad piritas gali padėti manifestuoti savo troškimus, atnešti gausą ir 
                                        skatinti aiškų mąstymą bei veiksmą.
                                    </p>
                                </div>
                                
                                <div className="border-t border-pink-500/30 pt-4">
                                    <p className="font-semibold text-pink-300 mb-2">🛡️ Hematitas: Apsauga nuo Energijos Vampyrų</p>
                                    <p className="mb-3">
                                        Jaučiatės išsekę nuo energijos vampyrų? Hematitas - galingas šios dienos kristalas!
                                    </p>
                                    <p className="font-semibold text-pink-300 mb-2">7 Nuostabūs Hematito Naudos:</p>
                                    <ol className="list-decimal list-inside space-y-2 ml-2">
                                        <li><span className="font-semibold">Apsaugo nuo negatyvumo:</span> Atmuša neigiamas energijas, saugodamas jūsų brangias energijos atsargas.</li>
                                        <li><span className="font-semibold">Įžeminimas ir stabilumas:</span> Suteikia tvirtą pagrindą, laikydamas jus įžemintus ir emocionaliai stabilius.</li>
                                        <li><span className="font-semibold">Pagerina susikaupimą ir koncentraciją:</span> Aštrina protą, padeda susikaupti į tai, kas svarbu.</li>
                                        <li><span className="font-semibold">Didina pasitikėjimą savimi:</span> Suteikia jėgų stovėti tvirtai, skatina pasitikėjimą savimi ir vidinę stiprybę.</li>
                                        <li><span className="font-semibold">Subalansuoja emocijas:</span> Atneša emocinę harmoniją, palaikydamas per gyvenimo pakilimus ir nuosmukius.</li>
                                        <li><span className="font-semibold">Skatina drąsą:</span> Įskiepija drąsą ir atsparumą, padeda drąsiai susidurti su iššūkiais.</li>
                                        <li><span className="font-semibold">Skatina gyvybingumą ir energiją:</span> Atgaivina jūsų dvasią, suteikdamas jėgų, kurių reikia klestėti.</li>
                                    </ol>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Moon Cycles for Manifestation */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="moon-cycles"
                            title="🌙 Mėnulio Ciklų Galia Manifestacijai (1 dalis)"
                            isOpen={expandedSections['moon-cycles'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Mėnulio Ciklų Galia Manifestacijai Moon Cycles')}
                        >
                            <div className="bg-slate-900/30 border border-slate-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                <div>
                                    <p className="font-semibold text-slate-300 mb-2">🌒 Augantis Mėnulis: Laikas Pradėti ir Augti</p>
                                    <p className="mb-2">
                                        Auganti fazė yra tada, kai mėnulis pereina nuo naujo mėnulio iki pilno mėnulio, 
                                        palaipsniui didėdamas šviesumoje.
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-semibold">Simbolika:</span> Ši fazė simbolizuoja augimą, 
                                        plėtrą ir kaupimą, todėl idealiai tinka pradėti naujus dalykus, kuriems reikia augimo ir vystymosi.
                                    </p>
                                    <p className="font-semibold text-slate-300 mb-1">Rekomenduojamos Veiklos:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Atidaryti banko sąskaitą arba pradėti investuoti</li>
                                        <li>Pradėti veiklas, susijusias su kaupimu ir augimu</li>
                                        <li>Prisaugti svorio arba pradėti naują projektą, nes tai atitinka mėnulio energiją, 
                                            kuri palaiko vaisingesnius pastangas</li>
                                    </ul>
                                </div>
                                <div className="border-t border-slate-500/30 pt-4">
                                    <p className="font-semibold text-slate-300 mb-2">🌘 Mažėjantis Mėnulis: Laikas Atleisti ir Paleisti</p>
                                    <p className="mb-2">
                                        Mažėjanti fazė yra tada, kai mėnulis pereina nuo pilno mėnulio iki naujo mėnulio, 
                                        reprezentuojant laikotarpį sumažėjimo, atleidimo ir paleidimo.
                                    </p>
                                    <p className="font-semibold text-slate-300 mb-1">Rekomenduojamos Veiklos:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Nutraukti ryšius su tuo, kas jums nebetarnauja</li>
                                        <li>Pradėti kelionę, kad išsilaisvintumėte nuo priklausomybės</li>
                                        <li>Pradėti pokyčius, kad numestumėte svorio arba nutrauktumėte toksiškus santykius, 
                                            nes mėnulio energija palaiko atleidimą ir paleidimą</li>
                                    </ul>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Detailed Western Zodiac Sign Information */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="astrology-101"
                            title="⭐ Astrologijos 101 - Detalūs Zodiako Ženklų Aprašymai"
                            isOpen={expandedSections['astrology-101'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Astrologijos 101 Zodiako Ženklų Aprašymai')}
                        >
                            <div className="bg-pink-900/30 border border-pink-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-6 max-h-[1000px] overflow-y-auto">
                                
                                {/* Aries */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♈ Avinas (Aries) - The Ram</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Avinai Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Pasitikėjimas</li>
                                            <li>Atminties kūrimas</li>
                                            <li>Protingumas</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Avinai yra natūralūs gimę lyderiai astrologinio zodiako</li>
                                            <li>Neįtikėtinai geri pradedant projektus ir idėjas, kad jos taptų realybe</li>
                                            <li>Gimsta su daug negailestingos vaikiškos energijos</li>
                                            <li>Pastebėsite, kaip jie senėja kaip geras vynas su vaikiškais veidais net iki senatvės</li>
                                            <li>Nėra puikūs baigiant dalykus - dažnai vadinami imperatoriumi arba imperatore zodiako</li>
                                            <li>Gali pradėti "karą", bet reikės savo karių pagalbos baigti darbą</li>
                                            <li>Raktas = pradėti ir baigti</li>
                                            <li>Avinai turi jaunus kūnus, bet yra labai linkę į migrenos galvos skausmus</li>
                                            <li>Taip pat susituoks remiantis ekonomika ir dažnai gailisi vėliau</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Jei supykdysite AVINĄ, jie greitai nutrauks ryšius! 
                                        Avinai garsūs staigiais judesiais su mažai arba jokiu perspėjimu, panašiai kaip tikras vaikas.</p>
                                    </div>
                                </div>

                                {/* Taurus */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♉ Jautis (Taurus) - The Bull</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Jaučiai Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Pinigai</li>
                                            <li>Prabanga</li>
                                            <li>Ištikimybė</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Jaučiai yra geriausi draugai zodiako</li>
                                            <li>Draugystės, kurias jie sukuria per metus, dažniausiai trunka ilgą laiką</li>
                                            <li>Jaučiai yra labai apskaičiuoti savo gyvenime</li>
                                            <li>Dažnai praleidžia laiką žiūrėdami į dalykus iš investicijų grąžos požiūrio</li>
                                            <li>Jei atrodo, kad dalykai turi daugiau neigiamos vertės nei teigiamos, Jautis tiesiog atsikratys mažos investicijos taško</li>
                                            <li>Jaučiai rūpinasi tik žmonėmis/dalykais, kurie turi vertę ir gali prisidėti prie pinigų, sėkmės ir laimės jų gyvenimams</li>
                                            <li>Puikūs draugai - jei jie laimi gyvenime, taip pat ir jūs</li>
                                            <li>Turintys didžiulius širdis ir giliai rūpinasi tais, kuriais tikrai rūpinasi, o tai nėra daug</li>
                                            <li>Tie, kurie priartėja prie Jaučio, pažįsta ypatingą besąlyginę meilę</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Jei supykdysite JAUTĮ, jie jūsų paskals savo ragais. 
                                        Jie retai kada atleidžia ir niekada nepamiršta.</p>
                                    </div>
                                </div>

                                {/* Gemini */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♊ Dvyniai (Gemini) - The Twins</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Dvyniai Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Turėti tikslą</li>
                                            <li>Būti mėgstamiems</li>
                                            <li>Turėti su kuo kalbėti</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Dvyniai yra kalbėtojai zodiako</li>
                                            <li>Jie yra tie, kurie dirba 3 darbus, kalba telefonu visą dieną ir rūko cigaretes pertraukose</li>
                                            <li>Jiems reikia nuolatinio proto stimuliavimo, kitaip jų pasaulis atrodo, kad griūna ir subyrėja</li>
                                            <li>Jų protas veikia kaip kompiuteris su 12 atidarytų kortelių - visada galvoja milijoną dalykų vienu metu</li>
                                            <li>Niekada nebus nuobodu būti aplink Dvynius - jie visada rodo šou, net kai nesistengia, 
                                            nes tai kažkas, kas tiesiog natūraliai ateina</li>
                                            <li>Gyvena per kitų patvirtinimą, kas sukelia kai kurias problemas jų gyvenime</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Dėl Dvynių poreikio nuolatiniams sąveikoms su kitais, 
                                        tai gali labai lengvai nuvesti juos sunaikinimo keliu, jei jie nėra savęs sąmoningi ir atsargūs. 
                                        Daugelis kreipiasi į alkoholį/narkotikus, jei nepadaro savo kasdienio gyvenimo narkotiku.</p>
                                    </div>
                                </div>

                                {/* Cancer */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♋ Vėžys (Cancer) - The Crab</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Vėžiai Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Šeima</li>
                                            <li>Pats sau</li>
                                            <li>Saugumas</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Vėžiai yra mamos zodiako</li>
                                            <li>Meilė, kurią Vėžiai turi viduje, giliai teka jų venose</li>
                                            <li>Jie yra tie žmonės, kurie padarytų bet ką iki bet kokių ribų tam, ką myli</li>
                                            <li>Jie yra "ride or die" - jei esate jų blogoje pusėje, jie tiesiog "die", ne "ride", 
                                            nes darys viską, ką gali, kad jus sugriautų</li>
                                            <li>Gerųjų prigimties dėka jie apsisaugo nuo darant dalykus, kurie yra per "blogi"</li>
                                            <li>Vėžiai myli meilę - pastebėsite Vėžius susituokiančius jaunai/turintys vaikus jaunai</li>
                                            <li>Linkę matyti Vėžius stresuojančius daug dažniau nei bet kurį kitą ženklą</li>
                                            <li>Vėžiai nerimauja pakankamai visiems ženklams kartu - dažnai nerimauja apie dalykus, 
                                            kurie tikrai neturi vertės/daug reikšmės</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Kaip jų zodiakas - vėžys, jie gali būti labai rūsčūs.</p>
                                    </div>
                                </div>

                                {/* Leo */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♌ Liūtas (Leo) - The Lion</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Liūtai Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Gerai atrodyti</li>
                                            <li>Turėti draugus</li>
                                            <li>Būti vertinamiems</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Liūtai yra ego zodiako</li>
                                            <li>Mėgsta būti dėmesio centre tiek, kiek mėgsta išleisti visus pinigus savo banko sąskaitoje</li>
                                            <li>Mėgsta gerai atrodyti ir mėgsta gerai atrodančius žmones</li>
                                            <li>Liūtai visada pasiruošę gerai praleisti laiką ir nekenčia, kai dalykai tampa įtempti/per rimti</li>
                                            <li>Jų "oh well, darysiu bet ką" požiūriai dažnai juos įveda į bėdą gyvenime, bet spėkite ką... Liūtai nerūpi</li>
                                            <li>Darys bet ką, kada nori</li>
                                            <li>Jūsų nuomonės apie Liūto veiksmus neturės jokio poveikio jiems</li>
                                            <li>Liūtui reikia šiek tiek laiko, kol nuspręs, kad nori apsistoti ir įsipareigoti vienam žmogui</li>
                                            <li>Jie nori linksmintis - neduok Dieve Liūtui nuobodu - Liūtas bus medžioklėje vieną minutę į nuobodulį, 
                                            jie negali to pakęsti</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Liūtai neims atsarginio sėdynės dėl pagarbos - atsitraukite.</p>
                                    </div>
                                </div>

                                {/* Virgo */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♍ Mergelė (Virgo) - The Virgin</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Mergelės Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Švarumas</li>
                                            <li>Privati erdvė</li>
                                            <li>Disciplina</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Mergelės yra švariausi zodiako</li>
                                            <li>Jei kvėpuojate blogai arba neturite švaraus namo, Mergelė nėra draugas, kurio jums reikia, 
                                            nes jie tikriausiai jūsų nekenčia</li>
                                            <li>Viskas, kas nėra tinkamai prižiūrima, Mergelės visada teis ir būs susižeidę</li>
                                            <li>Mergelės yra labai kritiškos prigimties - net jei jie jums sako, kur reikia išvalyti gyvenimą, 
                                            tai tiesiog reiškia, kad jiems pakankamai rūpi, kad iš viso su jumis kalbėtųsi</li>
                                            <li>Jei jiems nerūpi, jie nesivargins nieko sakyti</li>
                                            <li>Mergelės turi išmokti atleisti ir pasitikėti savo intuicija</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Mergelės yra perfekcionistės - jei žinote Mergelę, 
                                        girkite juos ir leiskite jiems žinoti, kad jie daro puikiai. 
                                        Jie per daug griežti sau.</p>
                                    </div>
                                </div>

                                {/* Libra */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♎ Svarstyklės (Libra) - The Balance</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Svarstyklės Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Žaisti teisingai</li>
                                            <li>Reikiamai apsirengti</li>
                                            <li>Būti išklausytiems</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Svarstyklės yra teisėjai ir pagrindiniai kampiniai visuomenės lyderiai</li>
                                            <li>Svarstyklės dažniausiai nesuprantamos ir dažnai veikia pagal tai, kaip jų šeima juos mato</li>
                                            <li>Svarstyklės yra labai turtingos/dažnai mirs turtingos</li>
                                            <li>Problema, kurią turi Svarstyklės - jos yra labai karminės</li>
                                            <li>Pirmas dalykas, kurį pastebite matydami Svarstykių simbolį - svarstyklės</li>
                                            <li>Kai Svarstyklės padeda per daug žmonių nemokamai, jų karma išeina iš balanso</li>
                                            <li>Kai Svarstyklės skaudina per daug žmonių, tas pats įvyksta</li>
                                            <li>Svarstyklės turi būti labai atsargios, kam padeda gyvenime</li>
                                            <li>Padedant žmonėms, kurie nėra draugai ar šeima be vertės mainų, kenkia Svarstyklei daugiau</li>
                                            <li>Kai kažkas padaro Svarstyklei neteisingai, tai taip pat neigiama karma jiems, jei neatsako</li>
                                            <li>Svarstyklės yra labai nesuprantamos ir daugelis skaitytojų dabar pradeda matyti kodėl</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Svarstyklės yra įgudę melagiai - jos yra sklandžios. (LI)e - (LI)bra.</p>
                                    </div>
                                </div>

                                {/* Scorpio */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♏ Skorpionas (Scorpio) - The Scorpion</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Skorpionai Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Kerštas</li>
                                            <li>Humoras</li>
                                            <li>Seksas</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Skorpionai yra tamsaus humoro zodiako</li>
                                            <li>Jų tamsūs protai ir jautrumo trūkumas padaro juos taikiniu tikrame pasaulyje</li>
                                            <li>Skorpionai myli bet ką/bet ką, kas yra paslaptinga ir neįprastai skirtinga</li>
                                            <li>Jų protai veikia kitaip nei dauguma - jiems reikia tik tylos, sekso ir kažko, 
                                            kas nekenčia ir mato pasaulį taip pat absurdiškai kaip jie</li>
                                            <li>Gyvena paslaptims ir nešios kiekvieną paslaptį iki mirties</li>
                                            <li>Jei pakankamai juos erzinate, jie išleis savo pykčio rath, kurį slepia nuo pasaulio 
                                            po savo negailestingai šaltu, bet šiltu žvilgsniu</li>
                                            <li>Skorpionas gali suvilioti bet ką bet kada</li>
                                            <li>Jie yra vieni juokingiausių zodiako, nors visi, kurie jų nepažįsta, sako, kad jie nuobodūs</li>
                                            <li>Jei manote, kad Skorpionas yra nuobodus, jie tikriausiai tiesiog jūsų nemėgsta</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Skorpiono nuodai yra nestabilūs ir jie visada ateina dėl keršto.</p>
                                    </div>
                                </div>

                                {/* Sagittarius */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♐ Šaulys (Sagittarius) - The Archer</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Šauliai Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Linksmintis</li>
                                            <li>Optimizmas</li>
                                            <li>Kelionės</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Šauliai yra tyrinėtojai ir patarėjai zodiako</li>
                                            <li>Jei ieškote kažko, kas bus labai optimistiškas, kai dalykai blogai, Šaulys yra jūsų žmogus</li>
                                            <li>Jei ieškote kažko, kas bus per daug sąžiningas, kai jūsų klausiate asmeninio klausimo, 
                                            Šaulys tikrai yra žmogus, kurio ieškote</li>
                                            <li>Šauliai yra keliautojai ir iš tikrųjų turi likti judant, kad jaustųsi laimingi</li>
                                            <li>Daryti pavedimus ir išeiti iš namų yra labai svarbu jų energijai, 
                                            ypač jei jie neturi galimybės keliauti į tolimas žemes</li>
                                            <li>Šauliai turi būti atsargūs su per daug darymu, nes Šaulio energija reiškia perteklių</li>
                                            <li>Ką tik Šaulys daro, jie turi tendenciją per daug daryti</li>
                                            <li>Jie taip pat daro puikius trenerius ir lyderius dėl šios tikslios priežasties</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Šauliai per daug daro dalykus. Perteklius nėra produktyvus. 
                                        Kelionės padeda su Šaulio sveikata/gerove.</p>
                                    </div>
                                </div>

                                {/* Capricorn */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♑ Ožiaragis (Capricorn) - The Goat</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Ožiaragiai Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Pinigai</li>
                                            <li>Protingumas</li>
                                            <li>Pasiekimai</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Ožiaragiai yra pinigų kūrėjai zodiako</li>
                                            <li>Vienintelis dalykas, apie kurį šie žmonės galvoja pabudę - pinigai</li>
                                            <li>Jie valgytų pinigus pusryčiams, pietums ir vakarienei, jei jų kūnai to neatsisakytų</li>
                                            <li>Jie rūpinasi savimi, savo šeima ir artimiausiais draugais</li>
                                            <li>Visada laiko tvirtą ratą, rūpinasi savo reikalais ir renka tiek pinigų, kiek gali gauti</li>
                                            <li>Dirba sunkiai ir uždirba viską, kas jiems ateina</li>
                                            <li>Jei nekalbate apie pinigus, Ožiaragis tikrai nenori kalbėti</li>
                                            <li>Jei norite tokio draugo, kuris bus tiesus, teisingas ir sąžiningas, 
                                            Ožiaragio draugas yra draugas jums</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Jie atrodo bejausmiai - jie neieškos būdo apsimesti, kad jums patinka, 
                                        niekada neturėsite abejonių. Kai jie jums patinka, jie jus patikrino, 
                                        perėjo per visą sąrašą pliusų ir minusų... Jie pasirinko jus dėl priežasties.</p>
                                    </div>
                                </div>

                                {/* Aquarius */}
                                <div className="border-b border-pink-500/30 pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♒ Vandenys (Aquarius) - The Water Bearer</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Vandenys Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Lygybė</li>
                                            <li>Pokytis</li>
                                            <li>Draugystė</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Vandenys yra ryšių zodiakas</li>
                                            <li>Šis ženklas yra populiariausias, t.y. "cool kids", nes esame Vandenio amžiuje, 
                                            todėl jie yra palankūs Matrix</li>
                                            <li>Tai reiškia, kad jie turės sėkmės su pinigais, geriausius ryšius su kitais 
                                            ir puikiai pasirodys daugelyje sričių tiesiog dėl Vandenio amžiaus</li>
                                            <li>Kainą, kurią jie moka už savo populiarumą ir pinigus, Matrix subalansuoja juos 
                                            ir jie retai kada pasiseka santykių srityje</li>
                                            <li>Dauguma Vandenių, kuriuos sutinkate, yra vieniši ir nors daugeliu atvejų 
                                            tai yra iš "pasirinkimo", jiems sunku mylėti bet ką daugiau nei save</li>
                                            <li>Tai nepadaro jų blogo žmogaus - jie tiesiog turi kitokį mąstymą</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Vandenys mėgsta kalbėti apie save. 
                                        Nekalbėkite per daug apie save arba jie tikrai suabejos, ar jūs iš viso domitės.</p>
                                    </div>
                                </div>

                                {/* Pisces */}
                                <div className="pb-4">
                                    <h5 className="text-pink-300 font-bold mb-2 text-base">♓ Žuvys (Pisces) - The Fish</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-pink-200">Ką Žuvys Rūpi:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Mokymas</li>
                                            <li>Sapnavimas</li>
                                            <li>Dvasingumas</li>
                                        </ul>
                                        <p className="font-semibold text-pink-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Žuvys yra sapnuotojai zodiako</li>
                                            <li>Ne tik jos yra sapnuojančios, bet jos taip pat yra galingiausios sapnų pasaulyje</li>
                                            <li>Galia, kurią šis zodiakas turi sapnų būsenoje, sunku suprasti kitiems zodiakams</li>
                                            <li>Žuvys gali gauti pranešimus ir pristatyti juos, būdamos astralinėje srityje</li>
                                            <li>Žuvys žinoma kaip zodiako politikas</li>
                                            <li>Kaip žuvų būrys, tai buvo Žuvių energijos eros metu, 
                                            kai tokie dalykai kaip religija ir demokratija pradėjo klestėti</li>
                                            <li>Pastebėkite žuvies simbolį daugelyje krikščionių transporto priemonių</li>
                                            <li>Žuvys mėgsta taisyti žmones ir keisti juos - tai taip pat jų didžiausia silpnybė, 
                                            nes jie nesiduoda lengvai dėl kažko ir per daug tiesūs net susitiks su žemesne lyga</li>
                                        </ul>
                                        <p className="font-semibold text-red-400 mt-2">⚠️ ĮSPĖJIMAS:</p>
                                        <p className="ml-2">Nenusiteikite kankininku. 
                                        Neištikimybės/Sukčiavimo rizika yra didelė Žuvims. 
                                        "Gerti kaip žuvis" yra citata Žuviai. 
                                        Būkite atsargūs, ką darote, būdami apsvaigę.</p>
                                    </div>
                                </div>

                            </div>
                            </div>
                        </AccordionSection>
                    </motion.div>
                )}

                {/* Chinese Zodiac Tab */}
                {((activeTab === 'chinese' || searchQuery.trim()) && categoryHasMatches('Kinų Zodiakas', 'kinų zodiakas žiurkė jautis tigras drakonas gyvatė arklys ožka beždžionė gaidys šuo kiaulė')) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Kinų Zodiakas</h3>
                        
                        {/* Element Relationships */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="element-relationships"
                            title="🌊🔥💨🌍 Elementų Santykiai"
                            isOpen={expandedSections['element-relationships'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Elementų Santykiai Elements')}
                        >
                            <div className="bg-amber-900/30 border border-amber-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                
                                <div>
                                    <p className="font-semibold text-amber-300 mb-2">Poliariniai Priešai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>Oras ir Žemė yra poliariniai priešai</li>
                                        <li>Ugnis ir Vanduo yra poliariniai priešai</li>
                                    </ul>
                                </div>

                                <div className="border-t border-amber-500/30 pt-3">
                                    <p className="font-semibold text-amber-300 mb-2">Oro (Air) Santykiai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>Oras gali užgesinti arba sustiprinti ugnį</li>
                                        <li>Oras gali perpjauti žemę arba nieko jai nepadaryti</li>
                                        <li>Oras gali sustiprinti vandenį arba jį nuraminti</li>
                                        <li>Oras susiduria su oru arba dirba kartu, kad sustiprintų</li>
                                        <li>Oras ir Ugnis klesti vienas nuo kito - Ugnis, vedanti Orą, yra susitelkusi galinga ugnis</li>
                                    </ul>
                                </div>

                                <div className="border-t border-amber-500/30 pt-3">
                                    <p className="font-semibold text-amber-300 mb-2">Žemės (Earth) Santykiai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>Žemė sugeria vandenį</li>
                                        <li>Žemė gali būti paversta lava/magma ugnimi arba gali užgesinti ugnį</li>
                                        <li>Žemė susiduria su žeme</li>
                                        <li>Žemė techniškai negali paliesti oro</li>
                                    </ul>
                                </div>

                                <div className="border-t border-amber-500/30 pt-3">
                                    <p className="font-semibold text-amber-300 mb-2">Vandens (Water) Santykiai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>Vanduo eroduoja arba susilpnina žemę</li>
                                        <li>Vanduo visiškai užgesina ugnį arba sukuria miglą/rūką</li>
                                        <li>Vanduo ir Oras yra H2O santykis - tas pats, bet priešingas nei Oro ir Ugnies santykis. Abu turi panašumų</li>
                                    </ul>
                                </div>

                                <div className="border-t border-amber-500/30 pt-3">
                                    <p className="font-semibold text-amber-300 mb-2">Ugnies (Fire) Santykiai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>Ugnis yra užgesinama vandens arba miglos efekto</li>
                                        <li>Ugnis gali būti paversta magma su žeme arba užgesinta</li>
                                        <li>Ugnis sustiprina ugnį</li>
                                        <li>Ugnis ir Oras klesti vienas nuo kito - Ugnis, vedanti Orą, yra susitelkusi galinga ugnis</li>
                                    </ul>
                                </div>

                                <div className="border-t border-amber-500/30 pt-3">
                                    <p className="font-semibold text-amber-300 mb-2">Kinų Elementai:</p>
                                    <p className="text-xs mb-2">
                                        Kinų elementai: Ugnis, Metalas, Medis ir Vanduo. 
                                        Galite taikyti tas pačias mechanikas kaip ir aukščiau aprašytiems santykiams.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Four Pillars of Chinese Astrology */}
                        <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-4 mb-6">
                            <h4 className="text-blue-400 font-bold mb-3">🏛️ Keturi Kinų Astrologijos Stulpai</h4>
                            <div className="text-sm text-white/90 space-y-4">
                                
                                <div>
                                    <p className="font-semibold text-blue-300 mb-2">1. Metai (Year Pillar):</p>
                                    <div className="bg-blue-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>1. Žiurkė (Rat)</p>
                                        <p>2. Jautis (Ox)</p>
                                        <p>3. Tigras (Tiger)</p>
                                        <p>4. Katė (Cat)</p>
                                        <p>5. Drakonas (Dragon)</p>
                                        <p>6. Gyvatė (Snake)</p>
                                        <p>7. Arklys (Horse)</p>
                                        <p>8. Ožka (Goat) - 8 yra pinigų skaičius</p>
                                        <p>9. Beždžionė (Monkey)</p>
                                        <p>10. Gaidys (Rooster)</p>
                                        <p>11. Šuo (Dog) - Atletiškas ir emocingas</p>
                                        <p>12. Kiaulė (Pig)</p>
                                        <p className="mt-2 italic">Skaičius prieš ženklą turi didelę įtaką pačiam ženklui.</p>
                                    </div>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">2. Mėnuo (Month Pillar):</p>
                                    <div className="bg-blue-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>1. Jautis - Sausio 7 - Vasario 6</p>
                                        <p>2. Tigras - Vasario 7 - Kovo 6</p>
                                        <p>3. Katė - Kovo 7 - Balandžio 6</p>
                                        <p>4. Drakonas - Balandžio 7 - Gegužės 6</p>
                                        <p>5. Gyvatė - Gegužės 7 - Birželio 6</p>
                                        <p>6. Arklys - Birželio 7 - Liepos 6</p>
                                        <p>7. Ožka - Liepos 7 - Rugpjūčio 6</p>
                                        <p>8. Beždžionė - Rugpjūčio 7 - Rugsėjo 6 (8-asis mėnuo, 8 yra galios skaičius)</p>
                                        <p>9. Gaidys - Rugsėjo 7 - Spalio 6</p>
                                        <p>10. Šuo - Spalio 7 - Lapkričio 6</p>
                                        <p>11. Kiaulė - Lapkričio 7 - Gruodžio 6</p>
                                        <p>12. Žiurkė - Gruodžio 7 - Sausio 6</p>
                                        <p className="mt-2 font-semibold">Pavyzdys:</p>
                                        <p>Lebron James, gimęs 1984 m. (Žiurkės metai), taip pat gimė Žiurkės mėnesį (gruodis). 
                                        Birželis yra Arklys mėnuo, kuris yra Žiurkės priešas. 
                                        NBA finalai visada žaidžiami birželį - todėl Lebron kovoja NBA finaluose.</p>
                                    </div>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">3. Laikas (Time Pillar):</p>
                                    <div className="bg-blue-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>1-3 val. - Jautis</p>
                                        <p>3-5 val. - Tigras</p>
                                        <p>5-7 val. - Katė</p>
                                        <p>7-9 val. - Drakonas</p>
                                        <p>9-11 val. - Gyvatė</p>
                                        <p>11 val. - 13 val. - Arklys</p>
                                        <p>13-15 val. - Ožka</p>
                                        <p>15-17 val. - Beždžionė</p>
                                        <p>17-19 val. - Gaidys</p>
                                        <p>19-21 val. - Šuo</p>
                                        <p>21-23 val. - Kiaulė</p>
                                        <p>23 val. - 1 val. - Žiurkė</p>
                                        <p className="mt-2 font-semibold">Pavyzdys:</p>
                                        <p>Jei gimėte Gyvatės laiku (9-11 val.), negerai lošti 9-11 val. vakare (Kiaulės laikas), 
                                        nes Gyvatė ir Kiaulė yra priešai. 
                                        Gyvatės draugai yra Jautis ir Gaidys, todėl Jaučio arba Gaidžio laikas būtų naudingi.</p>
                                    </div>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">4. Apvaisinimas (Conception Pillar):</p>
                                    <div className="bg-blue-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>Kai esate apvaisinti, turi energiją. Jei gimėte gruodį, lapkritį, spalį, 
                                        daugeliu atvejų būsite apvaisinti tame pačiame gyvūno ženkle, kur gimėte (9 mėnesiai atgal).</p>
                                        <p className="mt-2">Jei gimėte rugsėjį, rugpjūtį, tikrai liepą ir anksčiau, 
                                        visada būsite vienu ženklu priekyje.</p>
                                        <p className="mt-2 font-semibold">Pavyzdys:</p>
                                        <p>Jei gimėte 1985 m. liepą (Jaučio metai), buvote apvaisinti Žiurkės metais. 
                                        Tai turi specifinę energiją.</p>
                                        <p className="mt-2 italic">Visada skaičiuokite 9 mėnesius atgal, nebent esate per anksti gimę.</p>
                                    </div>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">Priešai (Enemies):</p>
                                    <div className="bg-blue-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>• Arklys ir Žiurkė</p>
                                        <p>• Jautis ir Ožka</p>
                                        <p>• Tigras ir Beždžionė</p>
                                        <p>• Katė ir Gaidys</p>
                                        <p>• Šuo ir Drakonas</p>
                                        <p>• Gyvatė ir Kiaulė</p>
                                    </div>
                                </div>

                                <div className="border-t border-blue-500/30 pt-3">
                                    <p className="font-semibold text-blue-300 mb-2">Draugai (Friends):</p>
                                    <div className="bg-blue-950/40 rounded p-3 space-y-1 text-xs">
                                        <p>• Žiurkė, Beždžionė, Drakonas</p>
                                        <p>• Jautis, Gyvatė, Gaidys</p>
                                        <p>• Ožka, Kiaulė, Katė</p>
                                        <p>• Arklys, Šuo, Tigras</p>
                                        <p className="mt-2 font-semibold">Sielos Draugai:</p>
                                        <p>Žiurkė ir Jautis yra sielos draugai - vienintelis toks santykis visoje Kinų Astrologijoje.</p>
                                    </div>
                                </div>

                            </div>
                            </div>
                        </AccordionSection>

                        {/* Important Information Box */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="chinese-new-year"
                            title="⚠️ Svarbu: Kinų Naujieji Metai"
                            isOpen={expandedSections['chinese-new-year'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Kinų Naujieji Metai Chinese New Year žiurkė Rat metai')}
                            contentText="kinų naujieji metai chinese new year žiurkė rat metai data"
                        >
                            <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-2">
                                <p>
                                    Kinų Naujieji Metai ne visada prasideda sausio 1 d., bet svyruoja tarp vėlyvo sausio ir vasario mėnesio. 
                                    Asmenims, kurių gimtadieniai patenka į šiuos mėnesius, svarbu patikrinti tikslią Kinų Naujųjų Metų pradžios datą 
                                    savo gimimo metais, kad tiksliai nustatytų savo zodiako ženklą.
                                </p>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* The Great Race Story */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="great-race"
                            title="📖 Didžioji Lenktynių Istorija"
                            isOpen={expandedSections['great-race'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Didžioji Lenktynių Istorija Great Race žiurkė Rat Jautis Ox lenktynės')}
                            contentText="žiurkė rat jautis ox lenktynės istorija pirmasis ženklas finišas"
                        >
                            <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    Jade Emperor nusprendė sukurti kalendorių ir pasirinko 12 gyvūnų per didžiąsias lenktynes.
                                </p>
                                <p>
                                    Rat, būdamas mažas, įtikino gerąširdį Ox, kad leistų jam važiuoti ant galvos lenktynių metu. 
                                    Artėdami prie finišo, Rat nušoko nuo Ox galvos ir perėjo pirmas, tapdamas pirmuoju zodiako gyvūnu, 
                                    o Ox - antruoju.
                                </p>
                                <p>
                                    Tiger atėjo trečias, o po jo Rabbit, kuris šokinėjo per akmenis ir naudojo rąstą plaukti per upę.
                                </p>
                                <p>
                                    Dragon atvyko penktas, paaiškindamas nustebusiam Jade Emperor, kad sustojo, kad atneštų lietų 
                                    žemės būtybėms - kilnus darbas, kuris patiko Emperor.
                                </p>
                                <p>
                                    Kai Horse ruošėsi pereiti finišo liniją, Snake, kuri buvo prisirišusi, išsirietė iš jos kanopos, 
                                    išgąsdindama Horse. Taip Snake tapo šeštuoju gyvūnu, o Horse - septintuoju.
                                </p>
                                <p>
                                    Goat, Monkey ir Rooster dirbo kartu, kad atvyktų toliau. Rooster rado plaustą, o Monkey ir Goat 
                                    traukė ir vilkė, dirbdami kartu, kad pasiektų krantą. Jade Emperor buvo patenkintas jų komandos 
                                    darbu ir paskyrė Goat kaip aštuntą būtybę, Monkey - devintą, o Rooster - dešimtą.
                                </p>
                                <p>
                                    Dog buvo vienuoliktoji būtybė, kuri perėjo finišo liniją. Nors ji buvo geras plaukikas, praleido 
                                    laiką žaidžiant ir mėgaujantis vandeniu. Galiausiai Pig atvyko ir tapo dvyliktuoju bei paskutiniu 
                                    zodiako gyvūnu. Ji alkano lenktynių metu, sustojo pavalgyti ir tada užmigo.
                                </p>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Chinese Astrology No No's */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="chinese-no-nos"
                            title="🚫 Kinų Astrologijos Ne Ne"
                            isOpen={expandedSections['chinese-no-nos'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Kinų Astrologijos Ne Ne No No')}
                        >
                            <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <div>
                                    <p className="font-semibold text-red-300 mb-1">Gyvūnai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Drakonai niekada neturėtų turėti šuns</li>
                                        <li>Gaidžiai niekada neturėtų turėti katės</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-semibold text-red-300 mb-1">Maistas:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Jautis - vengti ožkos produktų</li>
                                        <li>Ožka - vengti karvės produktų</li>
                                        <li>Katė - vengti viščiukų produktų</li>
                                        <li>Gyvatė - vengti kiaulės produktų</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-semibold text-red-300 mb-1">Santuoka:</p>
                                    <p>Niekada nesusituokite su savo priešo ženklu</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-red-300 mb-1">Priešo Metai "Ne Ne":</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Nesituokite</li>
                                        <li>Neturėkite vaiko</li>
                                        <li>Pradėti naujų dalykų nėra jūsų geriausiu interesu</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-semibold text-red-300 mb-1">Patarimai Pirkant Automobilį:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Nepirkite automobilio iš įmonės, įkurtos jūsų priešo metais</li>
                                        <li className="text-white/70 text-xs italic ml-4">Pvz: Jei esate Gyvatė, Chevrolet buvo įkurtas 1911 m. (Kiaulės metai), todėl niekada nevairuokite Chevrolet</li>
                                        <li>Nepirkite automobilio, pagaminto jūsų priešo metais</li>
                                        <li className="text-white/70 text-xs italic ml-4">Pvz: Jei esate Gyvatė, nepirkite 2019 m. Audi, nes 2019 m. buvo Kiaulės metai</li>
                                    </ul>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Feng Shui Wealth Corner */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="feng-shui"
                            title="💰 Feng Shui: Turto Kampas (Xun)"
                            isOpen={expandedSections['feng-shui'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Feng Shui Turto Kampas Xun')}
                        >
                            <div className="bg-green-900/30 border border-green-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <p>
                                    <span className="font-semibold text-green-300">Kaip naudoti:</span> Paimkite pinigų katę, 
                                    įdėkite $8 dolerių ir padėkite ją savo turto kampe.
                                </p>
                                <p>
                                    Feng Shui, Turto Kampas, žinomas kaip <span className="font-semibold">Xun</span>, yra svarbi 
                                    jūsų namų zona, kuri pritraukia turtą ir klestėjimą.
                                </p>
                                <p>
                                    Norėdami išnaudoti jo potencialą, padėkite laimingą katę šiame kampe. 
                                    <span className="font-semibold text-green-300"> Norėdami rasti turto kampą:</span> stovėkite 
                                    prie įėjimo ir pažiūrėkite į tolimiausią kairįjį kampą.
                                </p>
                                <p>
                                    Tolimiausias kairysis šios tinklelio zona reprezentuoja Xun poziciją. Jei sunku ją rasti, 
                                    taip pat galite rasti tolimiausią kairįjį miegamojo arba namų biuro kampą ir ten padėti 
                                    laimingą katę. Taip jūs kviečiate gerą sėkmę ir finansinę gausą į savo gyvenimą.
                                </p>
                                <div className="bg-green-950/40 rounded p-3 mt-3">
                                    <p className="font-semibold text-green-300 mb-2">Bagua Diagrama - 8 Pozicijos:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                        <div><span className="font-semibold">Li (Pietūs):</span> Šlovė, Reputacija</div>
                                        <div><span className="font-semibold">Kun (PV):</span> Santykiai, Meilė</div>
                                        <div><span className="font-semibold">Dui (Vakarai):</span> Kūrybiškumas, Vaikai</div>
                                        <div><span className="font-semibold">Qian (ŠV):</span> Naudingi Žmonės, Kelionės</div>
                                        <div><span className="font-semibold">Kan (Šiaurė):</span> Karjera, Gyvenimo Kelias</div>
                                        <div><span className="font-semibold">Gen (ŠR):</span> Žinios, Išmintis</div>
                                        <div><span className="font-semibold">Zhen (Rytai):</span> Pagrindas, Šeima</div>
                                        <div className="bg-purple-900/40 rounded p-1"><span className="font-semibold text-purple-300">Xun (PR):</span> Gausa, Klestėjimas, <span className="text-yellow-300">TURTAS</span></div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>

                        {/* Relationships Information Box */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="zodiac-relationships"
                            title="🔗 Zodiako Santykiai"
                            isOpen={expandedSections['zodiac-relationships'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Zodiako Santykiai Relationships žiurkė Rat Tigras Drakonas Gyvatė Arklys Ožka Beždžionė Gaidys Šuo Kiaulė Katė Jautis priešai draugai')}
                            contentText="žiurkė rat tigras drakonas gyvatė arklys ožka beždžionė gaidys šuo kiaulė katė jautis santykiai priešai draugai trinės"
                        >
                            <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-3">
                                <div>
                                    <p className="font-semibold text-red-300 mb-1">Priešai (Enemy Signs):</p>
                                    <p className="mb-2">Priešingas ženklas ratu yra jūsų priešas.</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                                        <div>🐭 Žiurkė ↔ 🐴 Arklys</div>
                                        <div>🐂 Jautis ↔ 🐐 Ožka</div>
                                        <div>🐅 Tigras ↔ 🐵 Beždžionė</div>
                                        <div>🐱 Katė ↔ 🐓 Gaidys</div>
                                        <div>🐉 Drakonas ↔ 🐕 Šuo</div>
                                        <div>🐍 Gyvatė ↔ 🐷 Kiaulė</div>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-green-300 mb-1">Draugai (Trines):</p>
                                    <p className="mb-2">Kiekvienas 4-as ženklas ratu yra jūsų draugas (trine).</p>
                                    <p className="mb-2 text-yellow-300 italic">Specialus: Žiurkė yra sielos draugas su Jautimi, be savo trine.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <div>🐭 Žiurkė - 🐵 Beždžionė - 🐉 Drakonas</div>
                                        <div>🐷 Kiaulė - 🐱 Katė - 🐐 Ožka</div>
                                        <div>🐴 Arklys - 🐅 Tigras - 🐕 Šuo</div>
                                        <div>🐍 Gyvatė - 🐓 Gaidys - 🐂 Jautis</div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Rat and Ox: The Matrix Couple */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="rat-ox-matrix"
                            title="🐭🐂 Žiurkė ir Jautis: Matrix Poros"
                            isOpen={expandedSections['rat-ox-matrix'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Žiurkė Jautis Matrix Poros Rat Ox')}
                        >
                            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-4">
                                <div>
                                    <p className="font-semibold text-indigo-300 mb-2">Žiurkės (Rat) Charakteristikos:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li><span className="font-semibold">1-asis ženklas</span>, bet <span className="font-semibold">12-asis mėnuo</span> - paskutinis mėnuo</li>
                                        <li><span className="font-semibold">Sudėtingas ženklas</span> - pirmasis ženklas, bet šiek tiek bailus</li>
                                        <li><span className="font-semibold">Negali susidurti tiesiogiai</span> - negali konfrontuoti tiesiogiai</li>
                                        <li><span className="font-semibold">Mažiausiai nukentėjęs nuo karmos</span> - Karma turi Ra ir kitą a</li>
                                        <li><span className="font-semibold">Žiurkė turi R, 18, 9</span> - skirtingai nei skaičius 1, kuris stipriai nukenčia nuo 9 energijos</li>
                                        <li><span className="font-semibold">Didžiausios problemos:</span> Arkliai (priešai), šeima (juos laiko juodais avinais, kol nepersikrausto ir neturi savo šeimos)</li>
                                        <li><span className="font-semibold">Blogiausia būtų turėti Arklio vaiką</span></li>
                                        <li>Žiurkė nėra stipriausias ženklas, bet turi galingus draugus</li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-indigo-500/30 pt-3">
                                    <p className="font-semibold text-indigo-300 mb-2">Žiurkės Draugai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li><span className="font-semibold">Jautis</span> - galingas derinys, Matrix pora</li>
                                        <li><span className="font-semibold">Drakonas</span> - galingas ženklas, nors retai matomas individualiame lygmenyje</li>
                                        <li><span className="font-semibold">Ožka (8-asis ženklas)</span> - traukiasi prie galios, net jei patys jos neturi. Ožka eina paskui autentišką galią</li>
                                        <li><span className="font-semibold">Beždžionė</span> - vienas galingiausių ženklų. Galingiausi patarėjai prezidentams Trump, Obama, Biden yra Beždžionės. Beždžionė yra 9-asis ženklas, ne natūralūs lyderiai. Beždžionė yra rugpjūčio mėnesyje (8-asis mėnuo), 8 yra galios skaičius. JAV įkurta Beždžionės metais</li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-indigo-500/30 pt-3">
                                    <p className="font-semibold text-indigo-300 mb-2">Jaučio (Ox) Charakteristikos:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li><span className="font-semibold">2-asis ženklas</span>, bet <span className="font-semibold">1-asis mėnuo</span></li>
                                        <li><span className="font-semibold">Vienas tvirčiausių ženklų</span></li>
                                        <li><span className="font-semibold">Kai duodi Jaučiui colį, jis paima mylią</span> - gali būti diktatoriški, kai gauna galią</li>
                                        <li>Galite matyti tai su Jaučio draugais, bosais. Net situacijose su maža galia, tai patenka jiems į galvą</li>
                                        <li><span className="font-semibold">Feminizmas seka daug Jaučio savybių</span> - galios, kurios stovi už feminizmo, nori užimti stalą. Jie nenori, kad visi būtų vienodai prie stalo</li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-indigo-500/30 pt-3">
                                    <p className="font-semibold text-indigo-300 mb-2">Matrix Raidė:</p>
                                    <p className="text-xs mb-2">
                                        Matrix raidėse yra <span className="font-semibold">a, t, r</span> - reiškia Rat (Žiurkė). 
                                        Tada yra <span className="font-semibold">X</span> - reiškia Ox (Jautis). 
                                        Matrix pora - vienintelis ženklas su tokiu santykiu.
                                    </p>
                                </div>
                                
                                <div className="border-t border-indigo-500/30 pt-3">
                                    <p className="font-semibold text-indigo-300 mb-2">Anglų Kalba - Magiška Kalba:</p>
                                    <p className="text-xs mb-2">
                                        Anglų kalba yra magiška kalba, pasaulinė kalba. Tai jungiamoji kalba, pasirinkta elito 
                                        prieš kitas nuo 1600-ųjų, kad būtų naudojama visame pasaulyje.
                                    </p>
                                    <p className="text-xs">
                                        Anglų kalba turi balsę <span className="font-semibold">e</span>, randamą žodžiuose 
                                        "energy" (energija) ir "Spelling" (rašyba).
                                    </p>
                                </div>
                                
                                <div className="border-t border-indigo-500/30 pt-3">
                                    <p className="font-semibold text-indigo-300 mb-2">Istorinės Galios Struktūros:</p>
                                    <div className="bg-indigo-950/40 rounded p-3 space-y-2">
                                        <div>
                                            <p className="font-semibold text-indigo-200 mb-1">2020 - Žiurkės Metai:</p>
                                            <p className="text-xs">
                                                Didžioji apgaulė, didysis atstatymas (Great Reset)
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-indigo-200 mb-1">2021 - Jaučio Metai:</p>
                                            <p className="text-xs">
                                                Konsolidavimas kontrolės. Pripratinimas prie to. Kai Jautis, kaip Hitleris ar Napoleonas, 
                                                nužudo milijonus žmonių, tai gali būti laikoma atstatymu. Kas vyksta dabar, 2021, Jaučio metais, 
                                                yra atstatymas - milijonai, potencialiai milijardai, mirs. Naikina kraujotakas. Ne iš karto, 
                                                gali būti per dešimtmetį.
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-indigo-200 mb-1">2022 - Tigro Metai:</p>
                                            <p className="text-xs">
                                                Tigro metai turi potencialą pakeisti galios struktūrą pasaulyje. 
                                                <span className="font-semibold"> 222 m. e. m.</span> - Romos imperatorius nužudytas 11 dieną, 
                                                berniukas imperatorius karūnuotas jo vietoje. Jo motina užima Romą. 
                                                222 yra moterų skaičius. Per 13 metų imperija beveik žlugo. 
                                                Tai vadinama <span className="font-semibold">3-jo amžiaus krize</span> - 
                                                politinis nestabilumas, maras, infliacija ir kt.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-indigo-500/30 pt-3">
                                    <p className="font-semibold text-indigo-300 mb-2">Gyvūnų Žiurkės Instinktai:</p>
                                    <p className="text-xs">
                                        Žvelgiant į gyvūnus žiurkes, visada bus kova dėl išgyvenimo, bet kai jos persikrausto, 
                                        jų natūralūs išgyvenimo instinktai įsigali.
                                    </p>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* 1 LP and Ox Faults and Advice */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="1-lp-ox-faults"
                            title="⚠️ 1 Gyvenimo Kelias ir Jaučio Trūkumai bei Patarimai"
                            isOpen={expandedSections['1-lp-ox-faults'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('1 Gyvenimo Kelias Jaučio Trūkumai Patarimai')}
                        >
                            <div className="bg-rose-900/30 border border-rose-500/40 rounded-lg p-4">
                            <div className="text-sm text-white/90 space-y-4">
                                <div>
                                    <p className="font-semibold text-rose-300 mb-2">1 Gyvenimo Kelias (1 LP) Trūkumai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>Vyrai ir moterys mąsto kaip vyrai</li>
                                        <li>Norėti daryti dalykus savo būdu</li>
                                        <li>Mėgsta duoti patarimus</li>
                                        <li>Gali išvengti karminio skolingo daugiau nei kiti</li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-rose-500/30 pt-3">
                                    <p className="font-semibold text-rose-300 mb-2">Jaučio (Ox) Trūkumai:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li>Gali būti tiesioginiai diktatoriai ir patyčiautojai</li>
                                        <li>Lėtai priima sprendimus</li>
                                        <li>Pavojingi, kai pyksta/įsižeidžia</li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-rose-500/30 pt-3">
                                    <p className="font-semibold text-rose-300 mb-2">Patarimai 1 Gyvenimo Keliui:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li><span className="font-semibold">Didelė agresyvumas</span> - būkite atsargūs</li>
                                        <li>Mokytis sunkiais būdais</li>
                                        <li>Nepriima patarimų gerai</li>
                                        <li>Gali būti alkoholikai</li>
                                    </ul>
                                </div>
                                
                                <div className="border-t border-rose-500/30 pt-3">
                                    <p className="font-semibold text-rose-300 mb-2">Patarimai Jaučiui:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                        <li><span className="font-semibold">Paimkite vieną laiką, kai pykstate</span> - atsitraukite ir atsipalaiduokite</li>
                                        <li><span className="font-semibold">Apsupti save Žiurkės energija</span> - Žiurkė yra Jaučio sielos draugas ir gali padeda subalansuoti energiją</li>
                                    </ul>
                                </div>
                            </div>
                            </div>
                        </AccordionSection>
                        
                        {/* Detailed Chinese Zodiac Sign Information */}
                        <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                            id="detailed-chinese-signs"
                            title="🐉 Detalūs Kinų Zodiako Ženklų Aprašymai"
                            isOpen={expandedSections['detailed-chinese-signs'] ?? false}
                            onToggle={toggleSection}
                            searchQuery={searchQuery}
                            expandedSearchTerms={expandedSearchTerms}
                            searchMatch={matchesSearch('Detalūs Kinų Zodiako Ženklų Aprašymai Chinese Zodiac žiurkė Rat Tigras Drakonas Gyvatė Arklys Ožka Beždžionė Gaidys Šuo Kiaulė Katė Jautis')}
                            contentText="žiurkė rat pirmasis ženklas 12 mėnuo bailus negali konfrontuoti mažiausiai nukentėjęs nuo karmos draugai drakonas beždžionė jautis priešai arklys protingi maitinasi žiniomis geri tėvai manipuliatoriai matrix vanduo izraelis mossad tigras drakonas gyvatė arklys ožka beždžionė gaidys šuo kiaulė katė jautis kinų zodiakas ženklai charakteristikos draugai priešai fizinės charakteristikos dantys aukšti liekni"
                        >
                            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-lg p-4">
                                <div className="text-sm text-white/90 space-y-6 max-h-[1000px] overflow-y-auto">
                                
                                {/* Rat */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐭 Žiurkė (Rat)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Draugai:</p>
                                        <p>Geriausiai dera su Drakonais ir Beždžionėmis, bet turi sielos draugo santykį su Jaučiu.</p>
                                        <p className="font-semibold text-indigo-200 mt-2">Fizinės Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Kartais turi du priekinius dantis, išsikišusius</li>
                                            <li>Didelis procentas yra aukšti ir liekni</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Labai protingi - maitinasi žiniomis</li>
                                            <li>Jei aplink Žiurkę yra labai išmanančių žmonių, tai tie, su kuriais Žiurkė nori būti</li>
                                            <li>Troškia žinių kaip narkomanas heroino</li>
                                            <li>Labai geri tėvai - galbūt geriausi tėvai</li>
                                            <li>Vienas iš jų atperkamųjų savybių - padarys bet ką savo vaikams</li>
                                            <li>Kalbant apie savo tėvus, šiek tiek kitoks - Žiurkės linkusios būti šeimos juodosiomis avimis</li>
                                            <li>Daro dalykus savo būdu, nėra labai į šeimos susitikimus</li>
                                            <li>Vieni pirmųjų palieka namus - kuo greičiau</li>
                                            <li>Geriausi manipuliatoriai planetoje - labai gerai įkalba žmones</li>
                                            <li>Labai gerai įveda žmones į situacijas, kurios jiems naudingos</li>
                                            <li>Nebūtinai kovotojai - dažniausiai gauna kitus žmones kovoti už juos</li>
                                            <li>Žiurkė turi tris galingiausius ženklus kaip draugus - Drakonas (galingiausias), Jautis, Beždžionė</li>
                                            <li>Žiurkė manipuliuoja kitais, kad padarytų nešvarius darbus</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Pavyzdžiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Izraelis, įkurtas 1948 m. (Žiurkės metai) - geriausi draugai su Amerika (Beždžionės metai)</li>
                                            <li>Mossad, įkurtas 1949 m. (Jaučio metai) - apsaugo Izraelį 24/7</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Vanduo ir Matrix:</p>
                                        <p className="ml-2">Žiurkė susijusi su vandeniu per patį Matrix. Vanduo yra Matrix kraujas. 
                                        Negalite parašyti žodžių "water" arba "matrix" be žodžio "Rat".</p>
                                        <p className="font-semibold text-indigo-200 mt-2">Priešai:</p>
                                        <p className="ml-2">Arklys yra Žiurkės priešas - labai sudėtingas santykis.</p>
                                    </div>
                                </div>

                                {/* Ox */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐂 Jautis (Ox)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Diktatoriai, kai gauna valdžią - žiūrėkite istoriją: Saddam Hussein, Hitler, Napoleon</li>
                                            <li>Netiki derybomis - tiki stipriomis taktikomis</li>
                                            <li>Fiziškai - šiek tiek didesni, ne raumeningi, bet labai stiprūs - kaip sargybinis naktiniame klube</li>
                                            <li>Moterys gali būti lieknos, bet retai rasite liekną Jaučio vyrą, nebent jis yra 1 arba 11</li>
                                            <li>Kai pyksta - tiesiog palikite juos vienus, leiskite atvėsti patiems</li>
                                            <li>Gebėjimas - gimę Jaučio metais labai gerai skaito žmonių kūno kalbą</li>
                                            <li>Panašus į Vakarietiško Zodiako Taurą - daug panašių savybių</li>
                                            <li>Gali užtrukti priimti sprendimą, bet kai jau ten, labai sunku pakeisti jų nuomonę</li>
                                            <li>Geriausiai dera su Gyvatėmis ir Gaidžiais</li>
                                            <li>Žiurkės-Jaučio santykiuose visada pastebėsite, kad Jautis visada gina Žiurkę</li>
                                            <li>Jautis visada daro Žiurkės nešvarius darbus</li>
                                            <li>Jaučiai nėra labai religingi - jei taip, tai dėl numerologijos</li>
                                            <li>Labai ištikimi - Loyal pirmoji balsė O</li>
                                            <li>Gaidys yra labiausiai ištikimas ženklas - dvi O</li>
                                            <li>Nėra bailiai - Hitler Pirmajame Pasauliniame kare buvo fronto linijoje</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Jaučio ir Ožkos Poliarumas:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Jaučio poliarumas su priešingu ženklu - Ožka</li>
                                            <li>Ožka = 8-asis ženklas, 8 yra galios skaičius, taip pat susijęs su taika ir klestėjimu</li>
                                            <li>Ožkos iš esmės traukia prie galios, galbūt todėl, kad tai yra tai, ko jos neturi - jos traukia prie jos</li>
                                            <li>Ožkos geriausiai daro žudydamos žmones malonumu, ne jėga</li>
                                            <li>Retais atvejais gausite anomalijas - kažkas kaip Benito Mussolini</li>
                                            <li>Jis buvo negailestingas diktatorius, gimęs Ožkos metais</li>
                                            <li>Dauguma diktatorių istorijoje yra Jaučiai, bet išimtis įrodo taisyklę</li>
                                            <li>Ekstremali tamsioji arba neigiamoji ženklo pusė kai kuriais atvejais gali atrodyti kaip priešingybės savybės</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Jaučio Santykis su Galia:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Jautis pats turi sudėtingą ir galbūt neigiamą santykį su galia</li>
                                            <li>Daugeliu atvejų, kad ir kaip stiprus Jautis arba kaip sunkiai jie dirba, kad gautų savo galią, jie linkę ją piktnaudžiauti</li>
                                            <li>Tai tiesiog įtaisyta į sistemą</li>
                                            <li>Žinome, kad Žiurkės susijusios su matrica - sielos draugai matricos</li>
                                            <li>Kai jos išeina iš linijos, matrica jas grąžina į liniją</li>
                                            <li>Jaučiai yra labiausiai matricos sielos draugai</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Aleksandras Didysis - Apšviestas Diktatorius:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Aleksandras Didysis (gimęs Pelloje, LIEPOS 356 m. pr. m. e. - mirė BABILONE, BIRŽELIO 323 m. pr. m. e.)</li>
                                            <li>Iš esmės užkariavo didžiąją dalį žinomo pasaulio</li>
                                            <li>Nenuostabu, kad Jautis norėtų užkariauti viską - Jaučiai yra natūralūs diktatoriai</li>
                                            <li>Bet Aleksandras nebuvo komunistas - jis nepriverstė tautų ir žemių, kurias užkariavo, asimiliuotis į vieną kultūrą</li>
                                            <li>Iš esmės leido jiems išlaikyti individualias kultūras ir papročius, nors valdė geležiniu kumščiu</li>
                                            <li>Aleksandras Didysis buvo <span className="font-semibold">Apšviesto Diktatoriaus Archetipas Matricoje</span></li>
                                            <li>Nors jis buvo Jautis - jis taip pat gimė LIEPOS mėnesį - Ožkos mėnuo</li>
                                            <li>Taigi jis turėjo YIN ir YANG</li>
                                            <li>Taip pat sakoma, kad jis mirė 33 metų amžiaus, ir kad jis nusiliejo ašarą, kai suprato, kad nėra žemių užkariauti</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Istoriniai Pavyzdžiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Saddam Hussein (1937, Jaučio metai) - valdė Iraką Geležiniu Kumščiu</li>
                                            <li>Hitler (1889, Jaučio metai) - sugriovė Veimaro Respubliką (Ožkos metai)</li>
                                            <li>Hitler perėmė valdžią 1933 m. (Gaidžio metai)</li>
                                            <li>Hitler dominavo Europą 1941 m. (Gyvatės metai)</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Tiger */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐅 Tigras (Tiger)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Dovanos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Jaunystės šaltinis - Leonardo di Caprio neatrodo virš 40, Tom Cruise neatrodo, kad gimė 1962 m.</li>
                                            <li>Tigrai gimsta su jaunystės šaltiniu - žmonės, gimę Tigro metais, senėja kaip vynas</li>
                                            <li>45 metų Tigro moteris gatvėje gali turėti geresnį kūną nei dauguma 25 metų moterų</li>
                                            <li>Kūnai dažniausiai labai atletiški iki raumeningo sudėjimo</li>
                                            <li>Šiek tiek maištingi</li>
                                            <li>Unikalus skirtumas - gyvena ilgiausiai ir miršta jauniausiai</li>
                                            <li>Kūnai tiesiog nesugenda kaip kitų ženklų</li>
                                            <li>Vienintelis kitas ženklas, turintis kažką panašaus - Drakonas</li>
                                            <li>Galite pridėti Arklys į mišinį, bet niekas panašaus kaip Tigras</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Silpnybės:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Vienas dalykas, kurio trūksta - protingumas</li>
                                            <li>Kvailiausias ženklas - blogiausia dalis, kad visi jie galvoja, kad yra protingi</li>
                                            <li>Nieko blogiau nei kvailas žmogus, galvojęs, kad yra protingas</li>
                                            <li>Jei Tigras turi 7 energiją arba gimė Gyvatės mėnesį, turi kitą energiją aplink</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Tigro Motinos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Liūtai augina vaikus gaujose - turi daug gerų motinystės instinktų</li>
                                            <li>Motinos liūtės nėra tokios pat - laiko vaiką apie 6 mėnesius ir tiek</li>
                                            <li>Daug Tigro moterų nebūtinai turi motinystės instinktus</li>
                                            <li>Tigro motina gali gerti, rūkyti su savo vaikais</li>
                                            <li>Jei Tigro motina turi 6 energiją, tikrai žinos, kaip būti gerai mama, nes numerologija vyrauja</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Kriminalas ir Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Labai geri nusikaltėliai - Tigras turi daug 3 energijos</li>
                                            <li>Geriausiai dera su Šunimis ir Arkliais</li>
                                            <li>Tigrai geriausiai dera su Tigrais - kai du Tigrai kartu, gali susidoroti vienas su kitu</li>
                                            <li>Tigro moterys turi daug vyriškos energijos - daug Tigro moterų duos jums</li>
                                            <li>Tigro moteris tiesiogiai smogs jums į žandą</li>
                                            <li>Galvoja kaip vyrai - ji nėra būtinai laiminga santykiuose</li>
                                            <li>Ji laimingesnė, kai medžioja - ji mėgsta būti medžioklėje dėl partnerio, bet kai ji santykiuose, nuobodu</li>
                                            <li>Gali būti bodybuilding tipo - labai geri sportininkai</li>
                                            <li>Dvi geriausios visų laikų moterų bodybuilderės buvo Tigrai</li>
                                            <li>Daug Tigro moterų yra kariuomenėje - vyriškos karjeros</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Laimė:</p>
                                        <p className="ml-2">Tigrai, negimę Amerikoje, yra labai laimingi tam tikra prasme. 
                                        Jei esate Tigras, gimęs JK, sekasi gana gerai - tai Tigro šalis. 
                                        Amerika maištavo prieš JK. Tigras yra 3-asis ženklas. 3 yra laimės skaičius.</p>
                                        <p className="font-semibold text-indigo-200 mt-2">Priešai:</p>
                                        <p className="ml-2">Tigras ir Beždžionė yra priešai.</p>
                                    </div>
                                </div>

                                {/* Cat */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐱 Katė (Cat)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Didžiausia Dovana:</p>
                                        <p className="ml-2">Psichologijos dovana - jie yra psichologijos meistrai. 
                                        Nereikia eiti į mokyklą - gimsta su tuo. Štai kodėl katė visada yra lange - gyvūnas. 
                                        Daug Katės žmonių sako, kad mėgsta sėdėti prie langų.</p>
                                        <p className="font-semibold text-indigo-200 mt-2">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Gimę Katės metais darys dalykus tyčia, kad pamatytų, kaip kažkas reaguos į situaciją</li>
                                            <li>Iš visų ženklų labiausiai savanaudžiai - galite prijaukinti šunį, bet neprijaukinsite katės</li>
                                            <li>Nėra didžiausi komandos žaidėjai</li>
                                            <li>Michael Jordan kartą surinko 69 taškus žaidime - gimęs Katės metais</li>
                                            <li>Treneris jam pasakė: "Michael, komandoje nėra 'aš'" - Michael atsakė: "bet 'aš' yra 'laimė' žodyje"</li>
                                            <li>Gimę Katės metais gali būti labai savanaudžiai</li>
                                            <li>Turintys labai gerus refleksus</li>
                                            <li>Nebūtinai provokuoja, bet nori išsiaiškinti, kaip jūs veikiate</li>
                                            <li>Mažiausiai tikėtina, kad patikės numerologija ir astrologija</li>
                                            <li>Katės taip priklauso nuo psichologijos, kad kai kažkas naudoja numerologiją, gali išsigąsti</li>
                                            <li>Katė yra 4-asis ženklas - 4 mažiausiai tikėtina, kad patikės numerologija ir astrologija</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Ekstremali Neigiamoji Pusė:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Katė ekstremali neigiamoji pusė tiesiog puosels viską, ką mato</li>
                                            <li>Tai paprastai raudona vėliava - kas nori būti aplink laukinę Katę</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Vienas iš dviejų ženklų, kurie geriausiai dera su savo ženklu - kitas yra Tigras</li>
                                            <li>Tikiu, kad Katės-Katės santykis yra geriausias tarp individualių ženklų</li>
                                            <li>Katės yra triadoje su Kiaule ir Ožka</li>
                                            <li>Ožka ir Kiaulė dera geriau viena su kita nei su Katė</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Ekstremali Neigiamoji Pusė:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Katė ekstremali neigiamoji pusė tiesiog puosels viską, ką mato</li>
                                            <li>Tai paprastai raudona vėliava - kas nori būti aplink laukinę Katę</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Priešai:</p>
                                        <p className="ml-2">Katės priešas yra Gaidys. Daug žmonių nesupranta, nes Katė ir Gaidys yra labai seksualiai traukiami vienas kito. 
                                        Katės neturėtų būti aplink Gaidžius, Gaidžiai neturėtų būti aplink Katės - jie yra priešai dėl priežasties.</p>
                                    </div>
                                </div>

                                {/* Dragon */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐉 Drakonas (Dragon)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Gimę Drakono metais yra labiausiai garbingas ženklas - jei sako, kad darys, reiškia</li>
                                            <li>95% atvejų - jei nežinote daug apie žmogų ir vienintelis dalykas, ką žinote, yra tai, kad jis Drakonas, turite tai</li>
                                            <li>Drakonai veržiasi lyderystės ir autoriteto - dauguma žmonių nesekės kitų, bet sekės Drakoną</li>
                                            <li>Drakonas turi autoriteto aurą - žmonės visada sekės Drakoną, kur dauguma atvejų niekada nesekė nieko kito</li>
                                            <li>Galingiausias ženklas</li>
                                            <li>Vladimiras Putinas, gimęs 1952 m. (Drakono metai), tapo Rusijos prezidentu 2000 m. (Drakono metai)</li>
                                            <li>Buvo perrinktas 2012 m. (Drakono metai)</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Kaip Susidoroti su Drakonu:</p>
                                        <p className="ml-2">Geriausias būdas susidoroti su Drakonu - įdėti idėją į jo galvą ir priversti jį galvoti, kad jis tai sugalvojo. 
                                        Štai kodėl toks žmogus kaip Vladimiras Putinas yra toks pavojingas - ne tik Drakonas, bet ir 7 (protingiausias skaičius).</p>
                                        <p className="font-semibold text-indigo-200 mt-2">Fizinis:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Fiziškai labai stiprūs, net moterys</li>
                                            <li>Tim Duncan, gimęs 1976 m. (Drakono metai), vis dar žaidė puikiai NBA 2016 m. - 40 metų</li>
                                            <li>Drakonų kūnai nesugenda - vienintelis ženklas, turintis geresnį kūną - Tigras</li>
                                            <li>Drakonas gali nebūti toks raumeningas kaip Tigras, bet taip pat stiprus</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Drakono Moterys:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Drakono moterys šiek tiek kitokios - Drakono moterys galvoja kaip vyrai</li>
                                            <li>Nori būti namų galva - nori dėvėti kelnės santykiuose</li>
                                            <li>Daugeliu atvejų daug vyrų negali susidoroti su tuo</li>
                                            <li>Beždžionės vyras gali, bet daugeliu atvejų vyrai negali susidoroti su Drakono moterimi, sakanti, ką daryti</li>
                                            <li>Roseanne Barr, gimusi Drakono metais - serialas "Roseanne" prasidėjo 1988 m. (Drakono metai)</li>
                                            <li>Jos partneris John Goodman buvo Drakonas, prodiuseris buvo Drakonas</li>
                                            <li>Roseanne turėjo keturis vyru - nepavyko, nes joks vyras negalėjo susidoroti su ja</li>
                                            <li>Po to rado moterį - labai svarbu, nes daugeliu atvejų Drakono moterys negali rasti vyrų, kurie gali susidoroti su jomis, 
                                            todėl kartais eina tuo keliu</li>
                                            <li>Kai matote Drakono moterį, kuri yra LGBT, tai dėl ekstremalaus vyriškos energijos kiekio jose, 
                                            ne būtinai dėl bet kokios politinės nesąmonės</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">ĮSPĖJIMAS - Šunys:</p>
                                        <p className="ml-2 font-semibold text-red-400">Drakonai turi laikytis toli nuo šunų. 
                                        Ne tik žmonės, gimę Šuns metais, bet patys šunys.</p>
                                        <p className="ml-2 mt-1">Jei esate aplink šunį ir esate Drakonas, trys dalykai visada įvyks:</p>
                                        <ol className="list-decimal list-inside space-y-1 ml-4">
                                            <li>Daug dalykų, kuriuos laikote bloga sėkme</li>
                                            <li>Sveikatos problemos - gauna šunį ir tada suserga</li>
                                            <li>Jei nėra sveikatos problemų, pradeda prarasti daug pinigų</li>
                                        </ol>
                                        <p className="ml-2 mt-2">Jerry Sandusky buvo Beždžionė ir buvo asistentas treneris Joe Paterno, kuris buvo Tigras, 
                                        Pensilvanijos valstijos universitete, truko 30 metų, jokių problemų. 
                                        Tada paaiškėjo, kad Jerry Sandusky buvo pedofilas, ir dėl to jo vyriausiasis treneris Joe Paterno nukentėjo - 
                                        manau, kad jis mirė dėl to. 30 metų vėliau Beždžionė naikina Tigro gyvenimą.</p>
                                        <p className="ml-2 mt-2">Jei turite šunį aplink, kažkada pateksite - kalbėjau su daug žmonių, 
                                        gimusiomis Drakono metais arba mėnesiais, kurie buvo persekiojami šunų arba bijo šunų.</p>
                                        <p className="font-semibold text-indigo-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Geriausiai dera su Beždžionėmis ir Žiurkėmis</li>
                                            <li>Geriau dera su Beždžione nei su Žiurke - Žiurkė yra šiek tiek manipuliacinė, 
                                            kai Drakonas tai supranta, bus problemų</li>
                                            <li>5-asis ženklas - gali būti labai seksualūs</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Snake */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐍 Gyvatė (Snake)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Mokosi sunkiai - galvoja, kad gali apgauti visus, nulaužti visus kodus</li>
                                            <li>Taip užsispyrę, kad visada nori daryti savo būdu, kartais tai jiems kainuoja</li>
                                            <li>Duoda patarimus, bet jų nepriima</li>
                                            <li>Gebėjimas - Išmintis</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Santykiai:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Geriausiai dera su Jaučiais ir Gaidžiais</li>
                                            <li>Gyvatės draugai yra Jautis ir Gaidys</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Horse */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐴 Arklys (Horse)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Priešai:</p>
                                        <p className="ml-2">Arklys ir Žiurkė yra priešai - labai sudėtingas santykis. 
                                        Pavyzdys sporte - Kobe ir Shaq nekenčia vienas kito. 
                                        Arklys-Žiurkės santykis toks turbulentiškas, kad net gyvūnų karalystėje, 
                                        jei Žiurkė prasiskverbia į arklio tvartą, arkliai visiškai išprotėja.</p>
                                    </div>
                                </div>

                                {/* Goat */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐐 Ožka (Goat)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>8-asis ženklas - 8 yra pinigų skaičius</li>
                                            <li>Bill Gates yra vienas turtingiausių gyvų, gimęs 8 dieną</li>
                                            <li>Ožkos linkusios traukti prie galios, net jei jos patys jos neturi</li>
                                            <li>Ožka paprastai eina po autentiškos galios</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Monkey */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐵 Beždžionė (Monkey)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>9-asis ženklas - ne natūralūs lyderiai</li>
                                            <li>Vienas galingiausių patarėjų Prezidentams Trump, Obama, Biden yra Beždžionės</li>
                                            <li>JAV įkurta Beždžionės metais</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Rooster */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐓 Gaidys (Rooster)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Labiausiai ištikimas ženklas - dvi O balsės</li>
                                            <li>Geriausiai dera su Jaučiais ir Gyvatėmis</li>
                                            <li>Gaidžiai paprastai yra agresyvesni - Gaidžiai puola dalykus, daugiau tiesiogiai</li>
                                        </ul>
                                        <p className="font-semibold text-indigo-200 mt-2">Ekstremali Neigiamoji Pusė:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>Jei matote Gaidį, kuris visiškai apie psichologiją, visiškai apie žaidimus su protu ir būti klastingas</li>
                                            <li>Tai tikriausiai raudona vėliava</li>
                                            <li>Tai priskiriama energijos neigiamai pusei</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Dog */}
                                <div className="border-b border-indigo-500/30 pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐕 Šuo (Dog)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>11-asis ženklas - 11 yra emocijų skaičius</li>
                                            <li>Atletiškas ir emocingas</li>
                                            <li>Fotografinė atmintis</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Pig */}
                                <div className="pb-4">
                                    <h5 className="text-indigo-300 font-bold mb-2 text-base">🐷 Kiaulė (Pig)</h5>
                                    <div className="space-y-2 text-xs">
                                        <p className="font-semibold text-indigo-200">Charakteristikos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>12-asis ženklas</li>
                                            <li>Gali eiti į kazino ir laimėti pinigus</li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                            </div>
                        </AccordionSection>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {zodiacAnimals.map(animal => {
                                const custom = getItemData('chinese', animal);
                                const defaultData = { 
                                    description: '',
                                    lyingType: zodiacLyingTypes[animal] || '',
                                    strongSide: zodiacStrongSides[animal] || '',
                                    dislike: zodiacDislikes[animal] || ''
                                };
                                const displayData = {
                                    description: custom?.description || defaultData.description,
                                    lyingType: custom?.lyingType !== undefined ? custom.lyingType : defaultData.lyingType,
                                    strongSide: custom?.strongSide !== undefined ? custom.strongSide : defaultData.strongSide,
                                    dislike: custom?.dislike !== undefined ? custom.dislike : defaultData.dislike
                                };
                                const isEditing = editingItem === `chinese_${animal}`;

                                return (
                                    <motion.div
                                        key={animal}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{zodiacEmojis[animal]}</span>
                                                <h4 className="text-lg font-bold text-yellow-400">
                                                    {zodiacTranslations[animal]}
                                                </h4>
                                            </div>
                                            {!isEditing && (
                                                <button
                                                    onClick={() => startEditing('chinese', animal, defaultData)}
                                                    className="text-purple-300 hover:text-purple-100 text-sm"
                                                >
                                                    {t.edit}
                                                </button>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Aprašymas:</label>
                                                    <textarea
                                                        value={editData.description || ''}
                                                        onChange={(e) => handleTextInput('description', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        rows="6"
                                                        placeholder={t.placeholder.enterDescription}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Kaip meluoja:</label>
                                                    <input
                                                        type="text"
                                                        value={editData.lyingType || ''}
                                                        onChange={(e) => handleTextInput('lyingType', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        placeholder={t.placeholder.lyingType}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Stipriosios Pusės:</label>
                                                    <input
                                                        type="text"
                                                        value={editData.strongSide || ''}
                                                        onChange={(e) => handleTextInput('strongSide', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        placeholder={t.placeholder.strongSide}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Kas nepatinka:</label>
                                                    <input
                                                        type="text"
                                                        value={editData.dislike || ''}
                                                        onChange={(e) => handleTextInput('dislike', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        placeholder={t.placeholder.dislike}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveItemData('chinese', animal, editData)}
                                                        className="flex-1 px-3 py-2 bg-green-500/60 hover:bg-green-500/80 text-white rounded-lg text-sm font-semibold"
                                                    >
                                                        {t.save}
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="flex-1 px-3 py-2 bg-red-500/60 hover:bg-red-500/80 text-white rounded-lg text-sm font-semibold"
                                                    >
                                                        {t.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-white/80 space-y-3">
                                                {displayData.description && (
                                                    <div>
                                                        <p className="whitespace-pre-wrap">{displayData.description}</p>
                                                    </div>
                                                )}
                                                
                                                {displayData.lyingType && (
                                                    <div>
                                                        <span className="text-orange-300 font-semibold text-xs">Kaip meluoja: </span>
                                                        <span className="text-white/70">{displayData.lyingType}</span>
                                                    </div>
                                                )}
                                                {displayData.strongSide && (
                                                    <div>
                                                        <span className="text-green-300 font-semibold text-xs">Stipriosios Pusės: </span>
                                                        <span className="text-white/70">{displayData.strongSide}</span>
                                                    </div>
                                                )}
                                                {displayData.dislike && (
                                                    <div>
                                                        <span className="text-red-300 font-semibold text-xs">Kas nepatinka: </span>
                                                        <span className="text-white/70">{displayData.dislike}</span>
                                                    </div>
                                                )}
                                                
                                                {/* Relationships Section */}
                                                <div className="border-t border-purple-400/20 pt-3 mt-3">
                                                    <div className="space-y-2">
                                                        {enemySigns[animal] && (
                                                            <div>
                                                                <span className="text-red-300 font-semibold text-xs">Priešas: </span>
                                                                <span className="text-white/70">
                                                                    {zodiacEmojis[enemySigns[animal]]} {zodiacTranslations[enemySigns[animal]]}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {trineGroups[animal] && trineGroups[animal].length > 0 && (
                                                            <div>
                                                                <span className="text-green-300 font-semibold text-xs">Draugai (Trine): </span>
                                                                <span className="text-white/70">
                                                                    {trineGroups[animal].map((friend, idx) => (
                                                                        <span key={friend}>
                                                                            {idx > 0 && ', '}
                                                                            {zodiacEmojis[friend]} {zodiacTranslations[friend]}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {specialRelationships[animal] && specialRelationships[animal].length > 0 && (
                                                            <div>
                                                                <span className="text-yellow-300 font-semibold text-xs">Sielos Draugas: </span>
                                                                <span className="text-white/70">
                                                                    {specialRelationships[animal].map((soulmate, idx) => (
                                                                        <span key={soulmate}>
                                                                            {idx > 0 && ', '}
                                                                            {zodiacEmojis[soulmate]} {zodiacTranslations[soulmate]}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {!displayData.description && (
                                                    <p className="text-white/50 italic text-xs">
                                                        {t.noDescription}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Colors Tab */}
                {((activeTab === 'colors' || searchQuery.trim()) && categoryHasMatches('Spalvų Numerologija', 'spalvos spalvų numerologija raudona mėlyna žalia geltona')) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Spalvų Numerologija</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { name: 'Red', translation: 'Raudona', value: 9, emoji: '🔴' },
                                { name: 'Black', translation: 'Juoda', value: 11, emoji: '⚫' },
                                { name: 'White', translation: 'Balta', value: 11, emoji: '⚪' },
                                { name: 'Blue', translation: 'Mėlyna', value: 4, emoji: '🔵' },
                                { name: 'Green', translation: 'Žalia', value: 4, emoji: '🟢' },
                                { name: 'Yellow', translation: 'Geltona', value: 11, emoji: '🟡' },
                                { name: 'Purple', translation: 'Violetinė', value: 7, emoji: '🟣' },
                                { name: 'Orange', translation: 'Oranžinė', value: 33, emoji: '🟠' },
                                { name: 'Gold', translation: 'Auksinė', value: 11, emoji: '🟨' },
                                { name: 'Grey', translation: 'Pilka', value: 28, emoji: '⚪' },
                                { name: 'Pink', translation: 'Rožinė', value: 5, emoji: '🩷' }
                            ].map(color => {
                                const custom = getItemData('color', color.name);
                                const defaultData = { description: '', value: color.value };
                                const displayData = custom || defaultData;
                                const isEditing = editingItem === `color_${color.name}`;

                                return (
                                    <motion.div
                                        key={color.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-purple-900/20 rounded-lg p-4 border border-purple-400/20"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{color.emoji}</span>
                                                <div>
                                                    <h4 className="text-lg font-bold text-yellow-400">
                                                        {color.translation}
                                                    </h4>
                                                    <p className="text-sm text-white/60">Skaičius: {displayData.value || color.value}</p>
                                                </div>
                                            </div>
                                            {!isEditing && (
                                                <button
                                                    onClick={() => startEditing('color', color.name, defaultData)}
                                                    className="text-purple-300 hover:text-purple-100 text-sm"
                                                >
                                                    {t.edit}
                                                </button>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Skaičius:</label>
                                                    <input
                                                        type="number"
                                                        value={editData.value !== undefined ? editData.value : color.value}
                                                        onChange={(e) => handleTextInput('value', parseInt(e.target.value) || color.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-white/80 text-sm mb-1 block">Aprašymas:</label>
                                                    <textarea
                                                        value={editData.description || ''}
                                                        onChange={(e) => handleTextInput('description', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-400/30 text-white text-sm"
                                                        rows="6"
                                                        placeholder={t.placeholder.enterDescription}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveItemData('color', color.name, editData)}
                                                        className="flex-1 px-3 py-2 bg-green-500/60 hover:bg-green-500/80 text-white rounded-lg text-sm font-semibold"
                                                    >
                                                        {t.save}
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="flex-1 px-3 py-2 bg-red-500/60 hover:bg-red-500/80 text-white rounded-lg text-sm font-semibold"
                                                    >
                                                        {t.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-white/80">
                                                <p className="whitespace-pre-wrap">
                                                    {displayData.description || t.noDescription}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
                
                {/* Practical Numerology Tips */}
                <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                    id="practical-tips"
                    title="💡 Praktinės Numerologijos Patarimai"
                    isOpen={expandedSections['practical-tips'] ?? false}
                    onToggle={toggleSection}
                    searchQuery={searchQuery}
                    expandedSearchTerms={expandedSearchTerms}
                    searchMatch={matchesSearch('Praktinės Patarimai Tips Practical Numerology')}
                    contentText="praktiniai patarimai numerologija kaip naudoti skaičius gyvenime kasdienybė"
                >
                    <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-lg p-4">
                        <div className="text-sm text-white/90 space-y-4">
                            <div>
                                <p className="font-semibold text-emerald-300 mb-2">Kasdienės Skaičių Energijos:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                    <li><span className="font-semibold">Geros dienos svarbiems sprendimams:</span> 1, 8, 11, 22, 28</li>
                                    <li><span className="font-semibold">Vengti svarbių sprendimų:</span> 4, 7, 13 (jei atsitinka)</li>
                                    <li><span className="font-semibold">Finansinės operacijos:</span> 8, 17, 26 - geros dienos</li>
                                    <li><span className="font-semibold">Kūrybinis darbas:</span> 3, 5, 9 - geros dienos</li>
                                    <li><span className="font-semibold">Mokymasis ir studijos:</span> 2, 6, 11 - geros dienos</li>
                                </ul>
                            </div>
                            
                            <div className="border-t border-emerald-500/30 pt-3">
                                <p className="font-semibold text-emerald-300 mb-2">Skaičių Kombinacijos Telefone:</p>
                                <p className="text-xs mb-2">
                                    Jei matote pasikartojančius skaičius telefone (pvz., 11:11, 22:22, 3:33), 
                                    tai gali būti <span className="font-semibold">synchronizacija su jūsų skaičių energija</span>.
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                    <li><span className="font-semibold">11:11</span> - Master skaičius, dvasinis žingsnis</li>
                                    <li><span className="font-semibold">22:22</span> - Master skaičius, praktinis žingsnis</li>
                                    <li><span className="font-semibold">3:33</span> - Kūrybiškumas ir komunikacija</li>
                                    <li><span className="font-semibold">4:44</span> - Stabilumas ir struktūra</li>
                                    <li><span className="font-semibold">5:55</span> - Pokyčiai ir laisvė</li>
                                </ul>
                            </div>
                            
                            <div className="border-t border-emerald-500/30 pt-3">
                                <p className="font-semibold text-emerald-300 mb-2">Vardų ir Pavardžių Keitimas:</p>
                                <p className="text-xs mb-2">
                                    Keičiant vardą arba pavardę, <span className="font-semibold">nauji skaičiai pakeičia jūsų energiją</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Tai gali pakeisti jūsų <span className="font-semibold">Destiny Number (Likimo Skaičių)</span> ir 
                                    <span className="font-semibold">Personality Number (Asmenybės Skaičių)</span>.
                                </p>
                                <p className="text-xs">
                                    Apskaičiuokite naują skaičių prieš keisdami, kad žinotumėte, kokią energiją pritrauksite.
                                </p>
                            </div>
                            
                            <div className="border-t border-emerald-500/30 pt-3">
                                <p className="font-semibold text-emerald-300 mb-2">Skaičių Energijos Namuose:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                    <li><span className="font-semibold">Adreso numeris:</span> Pridėkite visus skaičius iki vieno skaitmens</li>
                                    <li><span className="font-semibold">Buto numeris:</span> Atskiras skaičius, turintis savo energiją</li>
                                    <li><span className="font-semibold">Pašto kodas:</span> Gali turėti įtakos jūsų gyvenimo sričiai</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </AccordionSection>
                
                {/* Chinese Zodiac Hour Animals Guide */}
                <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                    id="hour-animals-guide"
                    title="⏰ Valandų Gyvūnų Vadovas"
                    isOpen={expandedSections['hour-animals-guide'] ?? false}
                    onToggle={toggleSection}
                    searchQuery={searchQuery}
                    expandedSearchTerms={expandedSearchTerms}
                    searchMatch={matchesSearch('Valandų Gyvūnai Hour Animals Valandos')}
                    contentText="valandų gyvūnai kinų zodiakas valandos 23 1 3 5 7 9 11 13 15 17 19 21"
                >
                    <div className="bg-cyan-900/30 border border-cyan-500/40 rounded-lg p-4">
                        <div className="text-sm text-white/90 space-y-4">
                            <div>
                                <p className="font-semibold text-cyan-300 mb-2">Valandų Gyvūnų Sistema:</p>
                                <p className="text-xs mb-2">
                                    Kiekviena <span className="font-semibold">2 valandų laikotarpis</span> yra susijęs su konkretaus gyvūno energija.
                                </p>
                                <p className="text-xs mb-2">
                                    Jūsų <span className="font-semibold">gimimo valanda</span> nustato jūsų valandų gyvūną, 
                                    kuris turi įtakos jūsų asmenybei ir suderinamumui su kitais.
                                </p>
                            </div>
                            
                            <div className="border-t border-cyan-500/30 pt-3">
                                <p className="font-semibold text-cyan-300 mb-2">Valandų Gyvūnų Sąrašas:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐭 Žiurkė (Rat):</span> 23:00 - 01:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐂 Jautis (Ox):</span> 01:00 - 03:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐅 Tigras (Tiger):</span> 03:00 - 05:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐱 Katė (Cat):</span> 05:00 - 07:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐉 Drakonas (Dragon):</span> 07:00 - 09:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐍 Gyvatė (Snake):</span> 09:00 - 11:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐴 Arklys (Horse):</span> 11:00 - 13:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐐 Ožka (Goat):</span> 13:00 - 15:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐵 Beždžionė (Monkey):</span> 15:00 - 17:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐓 Gaidys (Rooster):</span> 17:00 - 19:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐕 Šuo (Dog):</span> 19:00 - 21:00
                                    </div>
                                    <div className="bg-cyan-950/40 rounded p-2">
                                        <span className="font-semibold">🐷 Kiaulė (Pig):</span> 21:00 - 23:00
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t border-cyan-500/30 pt-3">
                                <p className="font-semibold text-cyan-300 mb-2">Valandų Gyvūnų Reikšmė:</p>
                                <p className="text-xs mb-2">
                                    Jūsų valandų gyvūnas atskleidžia <span className="font-semibold">jūsų vidinę asmenybę</span> 
                                    ir kaip jūs elgiatės <span className="font-semibold">privačiai</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Jūsų <span className="font-semibold">metų gyvūnas</span> (iš gimimo metų) rodo, 
                                    kaip kiti mato jus viešai.
                                </p>
                                <p className="text-xs">
                                    <span className="font-semibold">Draugiškos valandos</span> - geros dienos svarbiems susitikimams. 
                                    <span className="font-semibold">Priešiškos valandos</span> - vengti konfliktų ir svarbių sprendimų.
                                </p>
                            </div>
                        </div>
                    </div>
                </AccordionSection>
                
                {/* Number Combinations */}
                <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                    id="number-combinations"
                    title="🔢 Skaičių Kombinacijos ir Jų Reikšmės"
                    isOpen={expandedSections['number-combinations'] ?? false}
                    onToggle={toggleSection}
                    searchQuery={searchQuery}
                    expandedSearchTerms={expandedSearchTerms}
                    searchMatch={matchesSearch('Skaičių Kombinacijos Combinations Reikšmės')}
                    contentText="skaičių kombinacijos reikšmės numerologija 11 22 33 master skaičiai"
                >
                    <div className="bg-rose-900/30 border border-rose-500/40 rounded-lg p-4">
                        <div className="text-sm text-white/90 space-y-4">
                            <div>
                                <p className="font-semibold text-rose-300 mb-2">Master Skaičių Kombinacijos:</p>
                                <ul className="list-disc list-inside space-y-2 ml-2 text-xs">
                                    <li>
                                        <span className="font-semibold">11 + 22 = 33:</span> Aukščiausia dvasinė ir praktinė energija. 
                                        Derinys intuicijos ir materialinio pasiekimo.
                                    </li>
                                    <li>
                                        <span className="font-semibold">11 + 11 = 22:</span> Dviguba intuicija, 
                                        bet reikia praktinio pritaikymo.
                                    </li>
                                    <li>
                                        <span className="font-semibold">22 + 22 = 44:</span> Super praktinė energija, 
                                        bet gali būti per daug struktūros.
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="border-t border-rose-500/30 pt-3">
                                <p className="font-semibold text-rose-300 mb-2">Gyvenimo Kelio ir Dienos Deriniai:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                    <li><span className="font-semibold">LP 1 + Diena 1:</span> Labai stipri lyderystės energija</li>
                                    <li><span className="font-semibold">LP 8 + Diena 8:</span> Maksimali materialinė galia</li>
                                    <li><span className="font-semibold">LP 11 + Diena 11:</span> Ekstremali dvasinė energija</li>
                                    <li><span className="font-semibold">LP 3 + Diena 5:</span> Kūrybiškumas ir laisvė</li>
                                    <li><span className="font-semibold">LP 7 + Diena 7:</span> Gylis ir misticizmas</li>
                                </ul>
                            </div>
                            
                            <div className="border-t border-rose-500/30 pt-3">
                                <p className="font-semibold text-rose-300 mb-2">Skaičių Priešpriešos:</p>
                                <p className="text-xs mb-2">
                                    Kai turite <span className="font-semibold">priešingus skaičius</span> (pvz., LP 1 ir Destiny 2), 
                                    tai sukuria <span className="font-semibold">vidinį konfliktą</span>, bet taip pat suteikia 
                                    <span className="font-semibold">balansą</span>.
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                                    <li><span className="font-semibold">1 vs 2:</span> Lyderystė vs bendradarbiavimas</li>
                                    <li><span className="font-semibold">3 vs 4:</span> Kūrybiškumas vs struktūra</li>
                                    <li><span className="font-semibold">5 vs 6:</span> Laisvė vs atsakomybė</li>
                                    <li><span className="font-semibold">7 vs 8:</span> Dvasinumas vs materializmas</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </AccordionSection>
                
                {/* Monkey Year Energy and Global Economics */}
                <AccordionSection showEnglish={showEnglish} getEnglishTitle={getEnglishTitle}
                    id="monkey-energy-economics"
                    title="🐵 Beždžionės Metai ir Pasaulinė Ekonomika"
                    isOpen={expandedSections['monkey-energy-economics'] ?? false}
                    onToggle={toggleSection}
                    searchQuery={searchQuery}
                    expandedSearchTerms={expandedSearchTerms}
                    searchMatch={matchesSearch('Beždžionė Monkey Metai Ekonomika Petrodollar Petrodoleris')}
                    contentText="beždžionės metai monkey year petrodollar petrodoleris JAV Amerika Rusija valiuta doleris rublis saudi arabia"
                >
                    <div className="bg-amber-900/30 border border-amber-500/40 rounded-lg p-4">
                        <div className="text-sm text-white/90 space-y-4">
                            <div>
                                <p className="font-semibold text-amber-300 mb-2">Beždžionės Amžius (1933-2033):</p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">JAV įkurta Beždžionės metais</span>. Nuo 1933 m. sausio 1 d. 
                                    prasidėjo Beždžionės amžius, kuris tęsiasi iki <span className="font-semibold">2033 m. sausio 1 d.</span>
                                </p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">Saudo Arabija (House of Saad)</span> įkurta 1932 m., 
                                    Beždžionės metais. Jie labai naudojosi šiuo Beždžionės amžiumi.
                                </p>
                                <p className="text-xs">
                                    Kai kalba eina apie energiją, <span className="font-semibold">ypač kai tai amžius, 
                                    valdomas tos energijos, tai turi reikšmės</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Petrodolerio Sistema:</p>
                                <p className="text-xs mb-2">
                                    1944 m. buvo konferencija pasaulio elito. <span className="font-semibold">Susitarimas, 
                                    kad JAV doleris būtų pririštas prie aukso</span>. Nixonas jį nuėmė nuo aukso standarto 
                                    1971 m., <span className="font-semibold">Kiaulės metais</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">Black Friday 1869</span>, Gyvatės metais, auksas patyrė 
                                    smūgį.
                                </p>
                                <p className="text-xs mb-2">
                                    70-aisiais, <span className="font-semibold">Amerika ir Saudo Arabija sudarė susitarimą</span>. 
                                    Dvi Beždžionės šalys Beždžionės amžiuje sudarė susitarimą. 
                                    <span className="font-semibold">Petrodolerio sistema</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Saudo Arabija iš esmės yra OPEC, jie valdo didžiąją dalį pasaulio naftos. 
                                    Jie yra silpna teokratija.
                                </p>
                                <p className="text-xs mb-2">
                                    Jie sudarė susitarimą su Amerika - <span className="font-semibold">Amerika juos laiko 
                                    valdžioje, kad niekas su jais nesikištų</span>. Amerika saugo Saudo Arabijos karalių, 
                                    ne šalį - karališkąją šeimą, kuri ją valdo.
                                </p>
                                <p className="text-xs">
                                    Jie <span className="font-semibold">parduoda savo naftą tik JAV doleriais</span>. 
                                    Kai Kinija, Europa atvyksta pas juos, jie gali parduoti naftą tik JAV doleriais. 
                                    Tai verčia visus parduoti savo prekes, kad gautų JAV dolerius.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Kaip Sistema Veikia:</p>
                                <p className="text-xs mb-2">
                                    Kol ši sistema veikia, <span className="font-semibold">JAV gali turėti karinius 
                                    bazes visame pasaulyje</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Saudo Arabija turi daug dolerių, jie paima dalį tų pinigų ir <span className="font-semibold">
                                    perdirba juos į iždo vertybinius popierius</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">Amerika spausdina dolerius</span>, visi aplink juos 
                                    turi reikti šių pinigų, tie doleriai eina į Saudo Arabiją.
                                </p>
                                <p className="text-xs">
                                    Tai <span className="font-semibold">apgavystė</span>. Bet jei esate amerikietis, be šios 
                                    apgavystės, be šios tęstinės apgavystės, visas šis namelis griūva, dauguma amerikiečių 
                                    supras, kas yra tikras skurdas.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Saddam Hussein ir Priešprieša:</p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">Saddam Hussein pasakė: "Nenoriu jūsų dolerių už naftą"</span>. 
                                    Amerika jį pašalino.
                                </p>
                                <p className="text-xs mb-2">
                                    Viskas, ko reikia, yra <span className="font-semibold">nafta būtų parduodama JAV doleriais</span>.
                                </p>
                                <p className="text-xs">
                                    Pirmasis jo įsakymas buvo užtikrinti, kad <span className="font-semibold">Irako nafta būtų 
                                    parduodama JAV doleriais</span>. Tai paaiškina, kodėl Amerika yra supervalstybė.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Amerikos Įtaka Krenta:</p>
                                <p className="text-xs mb-2">
                                    Kadangi <span className="font-semibold">Amerikos įtaka krenta</span>, kitos šalys 
                                    bando Ameriką. Iranas jau parduoda savo naftą eurais, todėl jie yra <span className="font-semibold">
                                    sankcionuojami JAV</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Jie <span className="font-semibold">nukirto jų pinigų tiekimą</span>. Taip amerikiečiai 
                                    tai daro.
                                </p>
                                <p className="text-xs">
                                    Jei būtų tik Iranas, tai nebūtų didelė problema. Dabar <span className="font-semibold">Rusija 
                                    tai daro</span>. Tai buvo ypač nereikalinga.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Rusija ir Tigro Metai:</p>
                                <p className="text-xs mb-2">
                                    2013 m., <span className="font-semibold">kvailas Tigras pabėgo iš Ukrainos</span> ir 
                                    Amerika perėmė valdžios vakuumą. Amerikos vyriausybė perėmė valdžią 2014 m., 
                                    rusai turėjo karinę bazę Kryme ir negalėjo jos atsisakyti.
                                </p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">Rusijos valiuta įkurta 1992 m., Beždžionės metais</span>. 
                                    Aš kalbėjau apie tai, kaip Saudo Arabija ir Amerika dirbo kartu, kad naudotųsi viena kitai.
                                </p>
                                <p className="text-xs">
                                    Dabar Amerika puola <span className="font-semibold">valiutą, kuri buvo įkurta tame pačiame 
                                    metais, kuriame buvo Tigro metai</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Rusijos Rublis ir Sankcijos:</p>
                                <p className="text-xs mb-2">
                                    Nuo 2014 m., kai Rusija buvo uždėta sankcijų, <span className="font-semibold">Rublis 
                                    nukrito nuo 30:1 JAV dolerio iki 60:1 dolerio</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    2022 m., tiesiog prieš invaziją, <span className="font-semibold">Rusijos rublis buvo apie 80</span>. 
                                    Vėlgi, Amerikos infliacija taip pat buvo labai aukšta. Amerikiečiai uždėjo tokias aukštas 
                                    sankcijas, kad jų valiuta pakilo iki <span className="font-semibold">144</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Tai reiškia, kad <span className="font-semibold">Rusijos ekonomika negali pirkti Amerikos 
                                    ar Europos prekių</span>, jai to nereikia.
                                </p>
                                <p className="text-xs mb-2">
                                    Jei norite mano naftos, <span className="font-semibold">man reikia tik Rublių</span>. 
                                    Tai reiškia, kad Europos šalys, kurios nori šios naftos, turi keisti savo valiutą į rublius. 
                                    Tai padidina paklausą, dabar rublis yra <span className="font-semibold">96</span>.
                                </p>
                                <p className="text-xs">
                                    Jis atsikūrė, <span className="font-semibold">Putinas padarė savo valiutą vertingesnę</span>. 
                                    Tai iš tikrųjų reiškia, kad <span className="font-semibold">JAV valiuta yra mažiau paklausi 
                                    nei anksčiau</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Infliacijos Grėsmė:</p>
                                <p className="text-xs mb-2">
                                    Net rusai, kurie yra priešai, vis dar gauna mokėjimą <span className="font-semibold">Amerikos 
                                    valiuta</span>. Jie <span className="font-semibold">nukirto savo pirštą</span>. 
                                    Mes nevaldome tos pasaulio dalies.
                                </p>
                                <p className="text-xs mb-2">
                                    Dabar <span className="font-semibold">europiečiams nereikia tiek daug dolerių</span>. 
                                    Tai reiškia, kad <span className="font-semibold">infliacija labai pakils</span>. 
                                    Daug dalykų labai pakils, nebent Federalinė rezervo sistema padidins palūkanų normas, 
                                    o tai reiškia <span className="font-semibold">recesiją</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Žmonės valdžioje nieko nedaro ir mes galime būti <span className="font-semibold">hiperinfliacijos 
                                    pradžioje</span>. Amerika bus <span className="font-semibold">8 energijoje, priešo metais</span>. 
                                    Ne gerai finansiniu požiūriu.
                                </p>
                                <p className="text-xs">
                                    Rusija bando pakenkti Rusijai, bet <span className="font-semibold">Rusijos valiuta turi tą pačią 
                                    energiją kaip Amerika</span>, jie iš esmės <span className="font-semibold">perpjauna sau gerklę</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Rusijos Kariuomenė:</p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">Rusijos kariuomenė įkurta Beždžionės metais</span>.
                                </p>
                                <p className="text-xs">
                                    Visi milijardieriai, su kuriais kalbu, pasakė man, kad <span className="font-semibold">jie 
                                    nesitiki, kad doleris bankrutuos dar 10 metų</span>. Remiantis mano laikotarpiu, 
                                    kai amžius keičiasi nuo Beždžionės iki Žiurkės <span className="font-semibold">2033 m</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Karas ir Naftos Vamzdynai:</p>
                                <p className="text-xs mb-2">
                                    Pagalvokite apie šį karą. Ar žinojote, kad <span className="font-semibold">per šį karą, 
                                    kai jie žudo vienas kitą, 50,000 žmonių žuvo abiejose pusėse</span>. Bet jie 
                                    <span className="font-semibold">neliečia vamzdynų</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Rusija žino, kad jei jie <span className="font-semibold">uždarys naftą, jie pakvies 
                                    NATO į didesnį karą</span>.
                                </p>
                                <p className="text-xs">
                                    Ukrainai buvo pasakyta, kad jie gali pamiršti visą savo paramą. <span className="font-semibold">
                                    Viskas dėl pinigų, viskas dėl šou</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Federalinė Rezervo Sistema ir Istorija:</p>
                                <p className="text-xs mb-2">
                                    Antrojo pasaulinio karo metu, <span className="font-semibold">Federalinė rezervo sistema 
                                    laiko visų šalių pinigus</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Tai yra tai, ką FED daro - <span className="font-semibold">jie spausdina visų auksą</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Kai <span className="font-semibold">Naciai kariavo su Amerika ir Europa</span>, FED leido 
                                    jiems <span className="font-semibold">sulaikyti tai iš jų bankų</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">Niekada istorijoje neturėjome banko, kuris sulaikytų ką nors</span>. 
                                    Rusai turi <span className="font-semibold">$300 milijardų užšaldytų JAV</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Amerika <span className="font-semibold">užšaldė tuos pinigus</span>. Jie tai padarė vieną kartą 
                                    anksčiau, <span className="font-semibold">1979 m. su Iranu</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Jie <span className="font-semibold">laikė visus Irano pinigus</span>. Dalį Irano susitarimo 
                                    buvo, kad jie gauna visus tuos pinigus.
                                </p>
                                <p className="text-xs">
                                    Iš tų <span className="font-semibold">$120 milijardų, kuriuos Iranas gavo, Obama gavo 
                                    $20 milijardų</span>. Kodėl manote, kad <span className="font-semibold">Bidenas nori sudaryti 
                                    susitarimą su Iranu</span>?
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Sistema ir Istorija:</p>
                                <p className="text-xs mb-2">
                                    Aš stengiuosi, kad jūs suprastumėte, <span className="font-semibold">kaip ši sistema veikia</span>. 
                                    Tai <span className="font-semibold">niekada nebuvo padaryta istorijoje</span>. 
                                    Jie <span className="font-semibold">pavogė $300 milijardų iš Putino</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Galbūt jie nori <span className="font-semibold">sunaikinti JAV dolerį</span>. 
                                    Kuo mažiau žmonių naudoja JAV dolerį, tuo daugiau <span className="font-semibold">infliacija 
                                    kyla</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Aš galėjau pradėti <span className="font-semibold">1912 m., kai Titanicas nuskendo</span>.
                                </p>
                                <p className="text-xs">
                                    <span className="font-semibold">Titanicas buvo nužudymas</span>. 
                                    Kai žmonės gavo savo Federalinės rezervo sistemos, jie turėjo pakankamai pinigų 
                                    <span className="font-semibold">finansuoti karą</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Kinijos Grėsmė:</p>
                                <p className="text-xs mb-2">
                                    Rusija nėra tokia didelė žaidėja. <span className="font-semibold">Kinija galėtų 
                                    pabaigti Ameriką</span>. Jei Kinija pasakytų, kad pradės pirkti visą Rusijos naftą 
                                    <span className="font-semibold">Yuan</span>, galite <span className="font-semibold">atsisveikinti 
                                    su šiuo Amerikos gyvenimu</span>, tai paveiks visus.
                                </p>
                                <p className="text-xs">
                                    <span className="font-semibold">Atsarginkite viską</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3">
                                <p className="font-semibold text-amber-300 mb-2">Dolerio Bankrotas ir Ateitis:</p>
                                <p className="text-xs mb-2">
                                    Jei Amerika bankrutuoja, jei esate <span className="font-semibold">Europoje, JK, Kanadoje, 
                                    Meksikoje</span>, bet kas, kas pririšta prie dolerio - <span className="font-semibold">mes einame, 
                                    jūs einate</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Kai <span className="font-semibold">doleris bankrutuos</span>. Tai įvyks greičiausiai 
                                    <span className="font-semibold">2034 m</span>, tai yra greičiausiai, toliausiai tai įvyks 
                                    <span className="font-semibold">2046 m</span>. Aš ruošiuosi, tarsi tai būtų šiais metais.
                                </p>
                                <p className="text-xs mb-2">
                                    Dabar net <span className="font-semibold">Saudo Arabija svarsto susitarimą parduoti savo 
                                    naftą Yuan</span>.
                                </p>
                                <p className="text-xs mb-2">
                                    Kai <span className="font-semibold">petrodolerio sistema bus galiausiai sugadinta</span>, 
                                    JAV doleriai nebereikės. Jie bus <span className="font-semibold">grąžinti atgal į JAV</span>. 
                                    Tai yra ateitis, tai įvyks.
                                </p>
                                <p className="text-xs">
                                    <span className="font-semibold">Beždžionė daro savižudybę, puolant savo pačios energiją</span>.
                                </p>
                            </div>
                            
                            <div className="border-t border-amber-500/30 pt-3 bg-amber-950/40 rounded p-3">
                                <p className="font-semibold text-amber-300 mb-2">Kur Dėti Pinigus:</p>
                                <p className="text-xs mb-2">
                                    <span className="font-semibold">Diversifikuokite</span>: kriptovaliutos, turėkite šiek tiek 
                                    grynųjų pinigų, šiek tiek eurų, šveicarišką, <span className="font-semibold">turėkite šiek tiek 
                                    visko</span>.
                                </p>
                                <p className="text-xs">
                                    Jei mes atsisakysime savo petrodolerio sistemos, vieną dieną jūs pabudsite ir 
                                    <span className="font-semibold">jūsų JAV doleriai nieko nevertės</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}

