import { motion } from 'framer-motion';
import { numberDescriptions, reduceNumber, masterNumbers } from '../utils/numerology';

// Comprehensive number energy definitions for daily life
const numberEnergies = {
    1: {
        essence: "Lyderystė, vyriška energija, agresyvumas, iniciatyva",
        meaning: "Teigiama energija - pradžios, vadovavimas, nauji projektai",
        guidance: [
            "Paimkite vadovavimą ir pradėkite naują projektą ar iniciatyvą",
            "Būkite drąsūs ir agresyvūs sprendimuose - šiandien laikas veikti",
            "Pradėkite naują veiklą, verslą ar užsiėmimą",
            "Būkite savarankiški ir nepriklausomi",
            "Vadovaukite komandai ar grupei",
            "Pasiūlykite naujas idėjas ir sprendimus"
        ],
        donts: [
            "Venkite ginčų ir konfliktų - padidėjęs agresyvumas aplinkoje",
            "Nepasiduokite kitų spaudimui - laikykitės savo kelio",
            "Venkite priklausomybės nuo kitų"
        ],
        mindset: "Būkite drąsūs, vadovaukite, pradėkite"
    },
    2: {
        essence: "Diplomatija, harmonija, jautrumas, partnerystė",
        meaning: "Neutrali/Teigiama energija - bendradarbiavimas, derinimas, kompromisai",
        guidance: [
            "Bendraukite su kitais ir kurkite harmoniją",
            "Būkite jautrūs ir empatiški kitų poreikių atžvilgiu",
            "Dirbkite komandoje ir ieškokite kompromisų",
            "Medijuokite konfliktus ir derinkite skirtingas nuomones",
            "Rūpinkitės partnerystės ir santykių",
            "Klausykite kitų ir būkite atviri bendradarbiavimui"
        ],
        donts: [
            "Venkite konfliktų ir agresyvumo",
            "Nepasiduokite per daug kitų spaudimui",
            "Venkite vienatvės - šiandien reikia bendravimo"
        ],
        mindset: "Bendraukite, derinkite, kurkite harmoniją"
    },
    3: {
        essence: "Komunikacija, vaikiška energija, kūrybiškumas, humoras",
        meaning: "Neutrali/Mišri energija - kūrybiškumas, socializacija, išraiška",
        guidance: [
            "Bendraukite ir dalinkitės humoru - žmonės bus atviresni",
            "Būkite kūrybingi ir išreikškite save meniškai",
            "Socializuokitės ir būkite linksmi",
            "Rašykite, kalbėkite, dalinkitės idėjomis",
            "Džiaukitės gyvenimu ir teikite džiaugsmą kitiems",
            "Būkite atviri naujoms idėjoms ir pokalbiams"
        ],
        donts: [
            "Venkite rimtumo ir uždarytumo",
            "Nepasiduokite per daug kritikai",
            "Venkite vienatvės - reikia socialinio kontakto"
        ],
        mindset: "Tikėkitės triukšmo, ne aiškumo"
    },
    4: {
        essence: "Tvarka, įstatymai, organizacija, darbštumas",
        meaning: "Teigiama energija - struktūra, tvarka, patikimumas",
        guidance: [
            "Dirbkite tvarkingai ir organizuotai - struktūra yra raktas",
            "Laikykitės įstatymų ir taisyklių",
            "Kurkite tvarką ir sistemą savo veikloje",
            "Statykite pamatus ir tvirtą pagrindą",
            "Dirbkite sunkiai ir nuosekliai",
            "Organizuokite savo erdvę ir laiką"
        ],
        donts: [
            "Venkite įstatymų pažeidimų - šiandien svarbu tvarka",
            "Venkite chaoso ir neorganizuotumo",
            "Neprasimaukite darbų - laikykitės plano"
        ],
        mindset: "Statykite protingai, dirbkite lėtai"
    },
    5: {
        essence: "Laisvė, pokyčiai, kelionės, seksualinė energija, grožis",
        meaning: "Teigiama energija - pokyčiai, nuotykiai, prisitaikymas",
        guidance: [
            "Keliaukite ir patirkite naujų dalykų",
            "Būkite atviri pokyčiams ir naujoms galimybėms",
            "Ieškokite nuotykių ir naujų patirčių",
            "Būkite lankstūs ir prisitaikantys",
            "Eksperimentuokite su naujomis idėjomis",
            "Būkite aktyvūs ir dinamiški"
        ],
        donts: [
            "Venkite rutinos ir monotoniškumo",
            "Nepasiduokite baimėms ir apribojimams",
            "Venkite per daug planavimo - būkite spontaniški"
        ],
        mindset: "Būkite atviri pokyčiams, keliaukite"
    },
    6: {
        essence: "Šeima, namai, rūpinimasis, šiluma, atsakingumas",
        meaning: "Teigiama energija - šeima, namai, rūpinimasis",
        guidance: [
            "Rūpinkitės šeima ir namais - puikus laikas šeimai",
            "Būkite šilti ir rūpestingi kitų atžvilgiu",
            "Kurkite harmoningą namų aplinką",
            "Globokite ir mokykite kitus",
            "Rūpinkitės artimaisiais ir draugais",
            "Kurkite saugumą ir stabilumą namuose"
        ],
        donts: [
            "Venkite egoizmo ir abejingumo",
            "Nepamirškite rūpintis savimi",
            "Venkite konfliktų šeimoje"
        ],
        mindset: "Rūpinkitės šeima, kurkite šilumą"
    },
    7: {
        essence: "Išmintis, vienatvė, analizė, dvasinumas, traumų rizika",
        meaning: "Neutrali energija - mokymasis, introspekcija, vienatvė",
        guidance: [
            "Praleiskite laiką vienas ir mokykitės",
            "Analizuokite ir tyrinėkite gilias temas",
            "Medituokite ir praktikuokite introspekciją",
            "Skaitykite ir įgykite naujų žinių",
            "Fokusuokitės į dvasinį tobulėjimą",
            "Ieškokite tiesos ir prasmės"
        ],
        donts: [
            "Venkite lošimų - sėkmė ne jūsų pusėje",
            "Venkite sporto salės ir intensyvaus fizinio aktyvumo - padidėjęs traumų rizika",
            "Venkite per daug socializacijos - reikia vienatvės",
            "Būkite atsargūs su technologijomis - gali kilti problemų"
        ],
        mindset: "Mokykitės, analizuokite, ieškokite tiesos"
    },
    8: {
        essence: "Pinigai, galia, karma, apribojimai, manifestacija",
        meaning: "Teigiama energija - finansai, galia, materialinė sėkmė",
        guidance: [
            "Fokusuokitės į finansus ir pinigus - puikus laikas pinigams",
            "Mokėkite sąskaitas 8 dieną - pinigai grįš atgal (boomerang pinigai)",
            "Loškite 8 dienomis - galutinė manifestacija ir pinigų dažnis",
            "Dirbkite su finansiniais klausimais",
            "Kurkite materialinę sėkmę ir galios struktūras",
            "Naudokite savo įtaką ir autoritetą"
        ],
        donts: [
            "Nemiegokite per daug - Matrix maitinasi 8 dienomis",
            "Venkite košmarų - Matrix maitinasi jūsų baimėmis",
            "Venkite per daug dvasinio - reikia materialinio balanso",
            "Neprasimaukite finansinių sprendimų"
        ],
        notes: [
            "8 = maitinimas (eat). Naudokite druską apsisaugoti aplink lovą, druskos lempą, violetinę spalvą (apsauginė), gemstones",
            "8 yra karmos skaičius - apribojimų ir limitacijų skaičius"
        ],
        mindset: "Fokusuokitės į pinigus, statykite galios struktūras"
    },
    9: {
        essence: "Užbaigimas, prisitaikymas, dosnumas, humanitarizmas",
        meaning: "Neutrali/Teigiama energija - užbaigimas, išlaisvinimas, dosnumas",
        guidance: [
            "Užbaikite senus projektus ir dalykus",
            "Būkite prisitaikantys ir lankstūs",
            "Atleiskite ir išlaisvinkite save nuo praeities",
            "Padėkite kitiems ir būkite dosnūs",
            "Užbaikite ciklus ir pradėkite naują",
            "Būkite humanitarūs ir empatiški"
        ],
        donts: [
            "Venkite kabinimosi prie senų dalykų",
            "Nepasiduokite egoizmui",
            "Venkite pradėti naujų projektų - geriau užbaigti senus"
        ],
        mindset: "Užbaikite, prisitaikykite, išlaisvinkite"
    },
    11: {
        essence: "Master Vizionierius, emocingumas, charizma, intuicija",
        meaning: "Master energija - emocingumas, intuicija, dvasinė galia",
        guidance: [
            "Būkite emocingi ir intuityvūs - naudokite savo intuiciją",
            "Vadovaukite dvasiniu lygmeniu",
            "Būkite charizmatiški ir įkvėpiančiai",
            "Klausykite savo vidinio balso",
            "Naudokite savo emocinę energiją konstruktyviai",
            "Būkite atviri dvasiniams patyrimams"
        ],
        donts: [
            "Venkite skrydžių lėktuvu - technologinės problemos",
            "Venkite per daug racionalumo - klausykite intuicijos",
            "Būkite atsargūs su technologijomis - gali kilti problemų",
            "Venkite emocinio terorizmo - kontroliuokite emocijas"
        ],
        notes: [
            "Padidėjęs emocingumas - būkite atsargūs su technologijomis",
            "Master skaičius - ypatinga energija, reikalauja atsargumo"
        ],
        mindset: "Klausykite intuicijos, naudokite emocinę energiją"
    },
    22: {
        essence: "Master Statytojas, naikintojas, dideli projektai",
        meaning: "Master energija - statyba, organizacija, dideli projektai",
        guidance: [
            "Statykite ir kurkite didelius projektus",
            "Organizuokite ir struktūruokite didelius uždavinius",
            "Kurkite tvirtą pagrindą ilgalaikiams tikslams",
            "Naudokite savo gebėjimą kurti ir organizuoti",
            "Statykite kažką didingo ir tvaraus"
        ],
        donts: [
            "Venkite mažų projektų - reikia didelių",
            "Neprasimaukite statybos - planuokite gerai",
            "Venkite naikinimo energijos - fokusuokitės į kūrybą"
        ],
        mindset: "Statykite, statykite, statykite"
    },
    28: {
        essence: "Pinigų energija, materialinė sėkmė",
        meaning: "Teigiama energija - pinigai, materialinė sėkmė",
        guidance: [
            "Fokusuokitės į pinigus - 'Get that bag'",
            "Dirbkite su finansiniais klausimais",
            "Kurkite materialinę sėkmę"
        ],
        mindset: "Gaukite tą krepšelį"
    },
    33: {
        essence: "Master Mokytojas, įtaka, humanitarizmas",
        meaning: "Master energija - mokymas, įtaka, tarnavimas",
        guidance: [
            "Naudokite savo įtaką ir mokykite kitus",
            "Būkite humanitarūs ir dosnūs",
            "Vadovaukite per pavyzdį",
            "Tarnaukite kitiems aukščiausiu lygiu",
            "Palikite teigiamą įtaką pasauliui"
        ],
        mindset: "Mokykite, įtarkite, tarnaukite"
    }
};

// Get number energy info
const getNumberEnergy = (num) => {
    const reduced = reduceNumber(num);
    return numberEnergies[reduced] || numberEnergies[num] || {
        essence: "Nežinoma energija",
        meaning: "Neutrali energija",
        guidance: [],
        donts: [],
        mindset: "Stebėkite ir prisitaikykite"
    };
};

// Generate combined energy summary
const generateCombinedSummary = (dayEnergy, fullEnergy) => {
    const summaries = [];
    
    // Check for complementary energies
    if (dayEnergy.essence.includes('komunikacija') && fullEnergy.essence.includes('tvarka')) {
        summaries.push("Šiandien energijos siūlo balansuotą ir logišką požiūrį su pagarba pagrindinėms taisyklėms, bet rinkos/gyvenimo situacijos gali būti mišrios ir kintančios, rodantys lėtą judėjimą, nebent paveiktos išorinių veiksnių.");
    } else if (dayEnergy.essence.includes('pinigai') || fullEnergy.essence.includes('pinigai')) {
        summaries.push("Šiandien energijos fokusuojasi į finansus ir materialinę sėkmę. Puikus laikas dirbti su pinigais, mokėti sąskaitas ir kurti finansinę gerovę.");
    } else if (dayEnergy.essence.includes('komunikacija') || fullEnergy.essence.includes('komunikacija')) {
        summaries.push("Šiandien energijos skatina komunikaciją ir socializaciją. Tikėkitės daugiau bendravimo, pokalbių ir socialinių sąveikų.");
    } else if (dayEnergy.essence.includes('tvarka') || fullEnergy.essence.includes('tvarka')) {
        summaries.push("Šiandien energijos skatina tvarką, organizaciją ir struktūrą. Puikus laikas organizuoti, planuoti ir kurti tvirtą pagrindą.");
    } else if (dayEnergy.essence.includes('vienatvė') || fullEnergy.essence.includes('vienatvė')) {
        summaries.push("Šiandien energijos skatina vienatvę, mokymąsi ir introspekciją. Laikas analizuoti, mokytis ir ieškoti gilesnės prasmės.");
    } else {
        summaries.push(`Šiandien energijos siūlo ${dayEnergy.meaning.toLowerCase()} dienos energiją su ${fullEnergy.meaning.toLowerCase()} pilnos energijos. Kombinuota energija siūlo balansuotą požiūrį su pagarba pagrindinėms taisyklėms ir energijoms.`);
    }
    
    return summaries.join(' ');
};

export default function DayRecommendations({ dayNum, fullNum, date }) {
    if (!dayNum || !fullNum) return null;
    
    const dayReduced = reduceNumber(dayNum);
    const fullReduced = reduceNumber(fullNum);
    
    const dayEnergy = getNumberEnergy(dayNum);
    const fullEnergy = getNumberEnergy(fullNum);
    
    const combinedSummary = generateCombinedSummary(dayEnergy, fullEnergy);
    
    // Format date for display
    let dateDisplay = '';
    if (date) {
        try {
            const [year, month, day] = date.split('-');
            const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            const weekdays = ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis', 'Šeštadienis'];
            const months = ['Sausio', 'Vasario', 'Kovo', 'Balandžio', 'Gegužės', 'Birželio', 'Liepos', 'Rugpjūčio', 'Rugsėjo', 'Spalio', 'Lapkričio', 'Gruodžio'];
            dateDisplay = `${weekdays[dateObj.getDay()]} — ${months[dateObj.getMonth()]} ${day}, ${year}`;
        } catch (e) {
            dateDisplay = date;
        }
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-3 sm:mt-4 backdrop-blur-xl bg-black/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl shadow-purple-500/30 border border-purple-500/20"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 26, 0.6) 0%, rgba(26, 10, 46, 0.5) 50%, rgba(15, 52, 96, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(138, 43, 226, 0.2), inset 0 0 100px rgba(138, 43, 226, 0.1)'
            }}
        >
            {dateDisplay && (
                <div className="text-center mb-4 pb-3 border-b border-purple-500/30">
                    <p className="text-sm sm:text-base text-white/80">{dateDisplay}</p>
                </div>
            )}
            
            <div className="space-y-5 sm:space-y-6">
                {/* Primary Energy (Full Number) */}
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🔮</span>
                        <h4 className="text-base sm:text-lg font-bold text-purple-300">
                            Pagrindinė Energija (Pilnas Skaičius): {fullNum} = {fullReduced}
                        </h4>
                    </div>
                    
                    <div className="space-y-2 text-xs sm:text-sm">
                        <p className="text-white/90">
                            <span className="font-semibold text-purple-200">Reikšmė:</span> {fullEnergy.meaning}
                        </p>
                        <p className="text-white/90">
                            <span className="font-semibold text-purple-200">Esmė:</span> {fullEnergy.essence}
                        </p>
                        
                        {fullEnergy.guidance.length > 0 && (
                            <div className="mt-3">
                                <p className="font-semibold text-purple-200 mb-2">Vadovas:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                                    {fullEnergy.guidance.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {fullEnergy.donts && fullEnergy.donts.length > 0 && (
                            <div className="mt-3">
                                <p className="font-semibold text-red-300 mb-2">Ko Venkti:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                                    {fullEnergy.donts.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="mt-3 pt-2 border-t border-purple-500/20">
                            <p className="font-semibold text-purple-200">🧠 Protinė Užuomina:</p>
                            <p className="text-white/90 italic">"{fullEnergy.mindset}"</p>
                        </div>
                    </div>
                </div>
                
                {/* Day of Month Energy */}
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🗓️</span>
                        <h4 className="text-base sm:text-lg font-bold text-blue-300">
                            Mėnesio Dienos Energija: {dayNum} = {dayReduced}
                        </h4>
                    </div>
                    
                    <div className="space-y-2 text-xs sm:text-sm">
                        <p className="text-white/90">
                            <span className="font-semibold text-blue-200">Reikšmė:</span> {dayEnergy.meaning}
                        </p>
                        <p className="text-white/90">
                            <span className="font-semibold text-blue-200">Esmė:</span> {dayEnergy.essence}
                        </p>
                        
                        {dayEnergy.guidance.length > 0 && (
                            <div className="mt-3">
                                <p className="font-semibold text-blue-200 mb-2">Vadovas:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                                    {dayEnergy.guidance.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {dayEnergy.donts && dayEnergy.donts.length > 0 && (
                            <div className="mt-3">
                                <p className="font-semibold text-red-300 mb-2">Ko Venkti:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2 text-white/80">
                                    {dayEnergy.donts.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="mt-3 pt-2 border-t border-blue-500/20">
                            <p className="font-semibold text-blue-200">🧠 Protinė Užuomina:</p>
                            <p className="text-white/90 italic">"{dayEnergy.mindset}"</p>
                        </div>
                    </div>
                </div>
                
                {/* Combined Energy Summary */}
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🤝</span>
                        <h4 className="text-base sm:text-lg font-bold text-cyan-300">
                            Kombinuotos Energijos Santrauka
                        </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                        {combinedSummary}
                    </p>
                </div>
                
                {/* Special Notes */}
                {(dayEnergy.notes || fullEnergy.notes) && (
                    <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                        <h4 className="text-sm sm:text-base font-bold text-yellow-300 mb-2 flex items-center gap-2">
                            <span>💡</span> Ypatingos Pastabos:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-white/80 ml-2">
                            {dayEnergy.notes && dayEnergy.notes.map((note, index) => (
                                <li key={`day-${index}`}>{note}</li>
                            ))}
                            {fullEnergy.notes && fullEnergy.notes.map((note, index) => (
                                <li key={`full-${index}`}>{note}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
