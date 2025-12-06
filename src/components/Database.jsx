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

                    </motion.div>
                )}

                {/* Western Zodiac Tab */}
                {(activeTab === 'western' || searchQuery.trim()) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Vakarietiškas Zodiakas</h3>
                        
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
                {(activeTab === 'chinese' || searchQuery.trim()) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Kinų Zodiakas</h3>
                        
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

                    </motion.div>
                )}
            </div>
        </div>
    );
}
