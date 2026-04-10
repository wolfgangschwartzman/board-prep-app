const defaultSchedule = window.BOARDS_BLUEPRINT_DATA;
let schedule = loadScheduleData(defaultSchedule);

const state = {
  selectedDate: getInitialDate(),
  selectedMonth: null,
  filterType: "All",
  calendarExpanded: false,
  examsCollapsed: true,
  topicsCollapsed: true,
  reviewPromptIndex: 0,
  csvImport: null,
  planEditor: null,
  storage: loadStorage(),
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const examTargets = [
  { id: "comlex", label: "COMLEX Level 1", date: "2026-06-11" },
  { id: "step", label: "USMLE Step 1", date: "2026-06-20" },
];

const themeOptions = [
  { id: "sandstone", label: "Sandstone" },
  { id: "sage", label: "Sage" },
  { id: "coast", label: "Coast" },
  { id: "blush", label: "Blush" },
  { id: "midnight", label: "Midnight" },
];

const systemPalette = {
  "OMM-heavy": { color: "#8b5e3c", soft: "#efe2d1" },
  "Psych/Derm/Heme Onc": { color: "#a4475f", soft: "#f6dbe3" },
  "Biochem/Immuno/Genetics": { color: "#53744f", soft: "#e1eddb" },
  "Neuro (Optho/ENT)": { color: "#5b4ea1", soft: "#e6e0fb" },
  "Repro/Endo": { color: "#bf6b53", soft: "#f6dfd7" },
  "Cardio/Pulm": { color: "#2e6e8d", soft: "#d7ebf5" },
  "GI/GU/Renal": { color: "#3f7b5c", soft: "#dcefe5" },
  MSK: { color: "#8a6a29", soft: "#f4e7c3" },
  "Mixed/COMLEX": { color: "#4a647b", soft: "#dce7ef" },
  "Step Sprint": { color: "#17696a", soft: "#d5efee" },
  "Real Exam": { color: "#b34d3f", soft: "#f5ddd8" },
  "Review/Anki": { color: "#6a5d8f", soft: "#e6e0f2" },
};

const weakTopicTagRules = [
  { tag: "Cardio", patterns: [/\bcardio\b/i, /\bcardiac\b/i, /\bmurmur/i, /\bheart\b/i, /\barrhythm/i, /\becg\b/i, /\bekg\b/i, /\bvalv/i, /\bchf\b/i, /\bhypertension\b/i, /\bischemi/i, /\bangina\b/i, /\bheart failure\b/i, /\bendocard/i] },
  { tag: "Pulm", patterns: [/\bpulm\b/i, /\brespir/i, /\basthma\b/i, /\bcopd\b/i, /\blung\b/i, /\bpft\b/i, /\bhypox/i, /\bventilat/i, /\bpe\b/i, /\bpneum/i, /\bpleur/i] },
  { tag: "Renal", patterns: [/\brenal\b/i, /\baki\b/i, /\bckd\b/i, /\bneph/i, /\bglomer/i, /\bacid[- ]base\b/i, /\belectrolyte/i, /\bhyperkal/i, /\bhyponat/i, /\bmetabolic acidosis\b/i, /\bmetabolic alkalosis\b/i] },
  { tag: "GI", patterns: [/\bgi\b/i, /\bgastro/i, /\bhepat/i, /\bbiliary\b/i, /\bpancre/i, /\bjaundice\b/i, /\bdiarrhea\b/i, /\bconstipat/i, /\bcirrhos/i, /\bibd\b/i, /\bceliac\b/i, /\bmalabsorp/i] },
  { tag: "GU", patterns: [/\bgu\b/i, /\burinar/i, /\bpyelo\b/i, /\buti\b/i, /\btestic/i, /\bhematuria\b/i, /\bdysuria\b/i, /\bprostate\b/i, /\bnephrol/i, /\bstone\b/i] },
  { tag: "Neuro", patterns: [/\bneuro\b/i, /\bseiz/i, /\bstroke\b/i, /\bcranial nerve/i, /\bbrain\b/i, /\bheadache\b/i, /\bweakness\b/i, /\bmyasthen/i, /\bparkinson/i, /\bneuropath/i, /\btract\b/i, /\bms\b/i] },
  { tag: "Psych", patterns: [/\bpsych\b/i, /\bdepress/i, /\banxiety\b/i, /\bbipolar\b/i, /\bschizo/i, /\bmania\b/i, /\bssri\b/i, /\bantipsych/i, /\bpersonality disorder\b/i, /\bsubstance use\b/i] },
  { tag: "Micro", patterns: [/\bmicro\b/i, /\bbacter/i, /\bvirus/i, /\bfung/i, /\bparasite/i, /\bgram[- ]/i, /\bspore\b/i, /\bprotozo/i, /\bhelminth/i] },
  { tag: "Pharm", patterns: [/\bpharm\b/i, /\bdrug\b/i, /\bmedication\b/i, /\btox/i, /\bside effect/i, /\bmechanism\b/i, /\bcontraind/i, /\bagonist\b/i, /\bantagonist\b/i] },
  { tag: "Path", patterns: [/\bpath\b/i, /\bpathology\b/i, /\bnecrosis\b/i, /\binflamm/i, /\bgranuloma\b/i, /\bneoplas/i] },
  { tag: "Phys", patterns: [/\bphys\b/i, /\bphysiology\b/i, /\bfeedback\b/i, /\breceptor\b/i, /\bcompliance\b/i, /\bflow\b/i] },
  { tag: "Biochem", patterns: [/\bbiochem\b/i, /\bmetabolism\b/i, /\bglycogen\b/i, /\bvitamin\b/i, /\benzyme\b/i, /\burea cycle\b/i, /\btca\b/i, /\bglycolysis\b/i, /\bgluconeogenesis\b/i] },
  { tag: "Immuno", patterns: [/\bimmun/i, /\bhypersensitivity\b/i, /\bantibody\b/i, /\bcomplement\b/i, /\bt cell\b/i, /\bb cell\b/i, /\bmhc\b/i, /\bcytokine\b/i] },
  { tag: "Genetics", patterns: [/\bgenetic/i, /\bchromosome\b/i, /\btrinucleotide\b/i, /\binheritance\b/i, /\bautosomal\b/i, /\bx-linked\b/i, /\bimprinting\b/i, /\bmosaic/i] },
  { tag: "Endo", patterns: [/\bendo\b/i, /\bthyroid\b/i, /\bdiabetes\b/i, /\badrenal\b/i, /\binsulin\b/i, /\bpituitar/i, /\bparathyroid\b/i, /\bmen\b/i, /\bcushing/i, /\baddison/i] },
  { tag: "Repro", patterns: [/\brepro\b/i, /\bobgyn\b/i, /\bpregnan/i, /\bovar/i, /\buter/i, /\bmenstrual\b/i, /\bplacenta\b/i, /\bcontracept/i, /\bectopic\b/i, /\bpreeclamps/i] },
  { tag: "Heme/Onc", patterns: [/\bheme\b/i, /\bonc\b/i, /\banemia\b/i, /\bleuk/i, /\blymph/i, /\bhemoglobin\b/i, /\bhemat/i, /\bhemol/i, /\bcoag/i, /\bplatelet/i, /\brbc\b/i, /\bwbc\b/i, /\bthrombo/i, /\bbleeding\b/i, /\bclot/i, /\btransfusion\b/i, /\bpt\b/i, /\bptt\b/i, /\binr\b/i, /\bferritin\b/i, /\bsickle\b/i] },
  { tag: "MSK", patterns: [/\bmsk\b/i, /\bmusculoskeletal\b/i, /\bfracture\b/i, /\barthr/i, /\bbone\b/i, /\bjoint\b/i, /\bback pain\b/i, /\bosteo/i, /\bmyopathy\b/i, /\bcompartment syndrome\b/i] },
  { tag: "Derm", patterns: [/\bderm\b/i, /\brush\b/i, /\bskin\b/i, /\bbulla/i, /\bvesicle\b/i, /\bmelan/i, /\bpapule\b/i, /\bplaque\b/i] },
  { tag: "OMM", patterns: [/\bomm\b/i, /\bomt\b/i, /\bomt technique\b/i, /\bosteopathic\b/i, /\bcounterstrain\b/i, /\bstill'?s?\b/i, /\bmuscle energy\b/i, /\bmyofascial release\b/i, /\bblt\b/i, /\bbalanced ligamentous tension\b/i, /\bart\b/i, /\bsoft tissue\b/i, /\bhvla\b/i, /\bhigh[- ]velocity low[- ]amplitude\b/i, /\bfpr\b/i, /\bfacilitated positional release\b/i, /\blymphatic pump\b/i, /\brib raising\b/i, /\bsuboccipital release\b/i, /\bchapman'?s?\b/i, /\bchapman point\b/i, /\bviscerosomatic\b/i, /\bsympathetic level\b/i, /\bparasympathetic\b/i, /\bsacral\b/i, /\binnominate\b/i, /\bcranial\b/i, /\bvault hold\b/i, /\bcondylar decompression\b/i, /\bthoracic inlet\b/i] },
  { tag: "Ethics", patterns: [/\bethic/i, /\bconsent\b/i, /\bconfidential/i, /\bprofessionalism\b/i, /\bcapacity\b/i, /\bautonomy\b/i, /\bbeneficence\b/i, /\bnonmaleficence\b/i, /\bjustice\b/i] },
  { tag: "Biostats", patterns: [/\bbiostat/i, /\bepidemiology\b/i, /\bsensitivity\b/i, /\bspecificity\b/i, /\bppv\b/i, /\bnpv\b/i, /\brelative risk\b/i, /\bodds ratio\b/i, /\bincidence\b/i, /\bprevalence\b/i, /\bhazard ratio\b/i] },
  { tag: "Anatomy", patterns: [/\banatomy\b/i, /\bbrachial/i, /\binnervation\b/i, /\bnerve root\b/i, /\bplexus\b/i, /\bdermatome\b/i, /\bforamen\b/i, /\bmuscle origin\b/i, /\bmuscle insertion\b/i] },
  { tag: "Ophtho/ENT", patterns: [/\boptho\b/i, /\bophtho\b/i, /\bophthalm/i, /\bretina\b/i, /\bglaucoma\b/i, /\bcataract\b/i, /\bvisual field\b/i, /\bent\b/i, /\botitis\b/i, /\bhearing\b/i, /\bvertigo\b/i, /\bsinus/i] },
  { tag: "Public Health", patterns: [/\bpublic health\b/i, /\bpreventive\b/i, /\bscreening\b/i, /\bvaccine\b/i, /\boccupational\b/i, /\benvironmental\b/i] },
];

const firstAidReferencesByDate = {
  "2026-04-06": "No FA pages",
  "2026-04-07": "Heme/Onc 409-422",
  "2026-04-08": "Heme/Onc 423-436",
  "2026-04-09": "Heme/Onc 437-448 + Psych 569-576",
  "2026-04-10": "Psych 577-586 + Derm 481-486",
  "2026-04-11": "Practice exam: no new FA pages",
  "2026-04-12": "Review day: missed-question review only",
  "2026-04-13": "Psych 587-594 + Derm 487-498",
  "2026-04-14": "Biochem/Genetics 31-46",
  "2026-04-15": "Biochem/Genetics 47-62",
  "2026-04-16": "Biochem/Genetics 63-78",
  "2026-04-17": "Biochem/Genetics 79-92",
  "2026-04-18": "Practice exam: no new FA pages",
  "2026-04-19": "Review day: Immunology skim 93-106",
  "2026-04-20": "Immunology 93-106",
  "2026-04-21": "No FA pages",
  "2026-04-22": "Immunology 107-120",
  "2026-04-23": "Biochem weak-points re-hit 31-40, 63-72",
  "2026-04-24": "Biochem weak-points re-hit 73-92",
  "2026-04-25": "Travel/light: Derm rapid pass 481-490",
  "2026-04-26": "Neuro review 499-512",
  "2026-04-27": "Endocrine 329-344",
  "2026-04-28": "Endocrine 345-362",
  "2026-04-29": "Reproductive 629-644",
  "2026-04-30": "Reproductive 645-660",
  "2026-05-01": "Reproductive 661-668",
  "2026-05-02": "Reproductive 669-676",
  "2026-05-03": "Cardio/Pulm review 283-294, 677-686",
  "2026-05-04": "Endo rapid re-hit 329-362",
  "2026-05-05": "Cardiovascular 283-298",
  "2026-05-06": "Cardiovascular 299-314",
  "2026-05-07": "Cardiovascular 315-328 + Respiratory 677-682",
  "2026-05-08": "Practice exam: no new FA pages",
  "2026-05-09": "Practice exam/review: no new FA pages",
  "2026-05-10": "Review day: Respiratory 683-694",
  "2026-05-11": "Respiratory 695-706",
  "2026-05-12": "GI 363-378",
  "2026-05-13": "GI 379-394",
  "2026-05-14": "GI 395-408",
  "2026-05-15": "Renal 595-611",
  "2026-05-16": "Practice exam: no new FA pages",
  "2026-05-17": "Review day: Renal 612-628",
  "2026-05-18": "GI/GU/Renal weak-page re-hit 379-408, 595-628",
  "2026-05-19": "Neuro 499-516",
  "2026-05-20": "Neuro 517-534",
  "2026-05-21": "Neuro 535-552",
  "2026-05-22": "Neuro 553-568",
  "2026-05-23": "Practice exam: no new FA pages",
  "2026-05-24": "Review day: rapid neuro/optho/ENT margin review 499-568",
  "2026-05-25": "Mixed/COMLEX: Public Health 255-267",
  "2026-05-26": "Practice exam: no new FA pages",
  "2026-05-27": "MSK 449-460",
  "2026-05-28": "MSK 461-472",
  "2026-05-29": "MSK 473-480 + Derm 481-486",
  "2026-05-30": "Practice exam: no new FA pages",
  "2026-05-31": "Review day: Derm 487-498",
  "2026-06-01": "Mixed/light: Pharmacology 227-240",
  "2026-06-02": "COMSAE: no new FA pages",
  "2026-06-03": "MSK/Derm consolidation 449-498",
  "2026-06-04": "Mixed: Pharmacology 241-254",
  "2026-06-05": "Mixed: Public Health 268-279",
  "2026-06-06": "Practice exam: no new FA pages",
  "2026-06-07": "Review day: Rapid Review 707-718",
  "2026-06-08": "Mixed: Rapid Review 719-730",
  "2026-06-09": "Light day: Rapid Review 731-738",
  "2026-06-10": "Rest",
  "2026-06-11": "COMLEX",
  "2026-06-12": "Rest",
  "2026-06-13": "Practice exam: no new FA pages",
  "2026-06-14": "Review day: missed-question FA pages only",
  "2026-06-15": "Behavioral/Public Health 255-279 + Psych 569-580",
  "2026-06-16": "Biochem/Genetics 31-62",
  "2026-06-17": "Renal 595-628 + Pharm 227-240",
  "2026-06-18": "Pharm 241-254 + Psych 581-594",
  "2026-06-19": "Rest",
  "2026-06-20": "Step 1",
};

const boardsAndBeyondReferencesByDate = {
  "2026-04-09": "Coagulation disorders, platelet disorders, leukemias, lymphomas",
  "2026-04-10": "Mood disorders, anxiety, psych pharm basics, papulosquamous disorders, blistering disorders, anemia overview",
  "2026-04-11": "None before exam; after review only rewatch misses",
  "2026-04-12": "Only videos tied to UWSA misses",
  "2026-04-13": "Chemo toxicities, transfusion reactions, antidepressants/antipsychotics, high-yield derm review",
  "2026-04-14": "Enzyme kinetics, glycogen metabolism, glycolysis/gluconeogenesis, TCA, ETC",
  "2026-04-15": "Innate vs adaptive, hypersensitivity, immunodeficiencies, cytokines",
  "2026-04-16": "Inheritance patterns, trinucleotide repeats, chromosomal disorders, Hardy-Weinberg if needed",
  "2026-04-17": "Lysosomal storage diseases, peroxisomal disorders, fatty acid oxidation, glycogen storage diseases",
  "2026-04-18": "None pre-exam; only misses after",
  "2026-04-19": "Missed-topic rewatch only",
  "2026-04-20": "Vitamins, lysosomal diseases, peroxisomal diseases, urea cycle if weak",
  "2026-04-21": "None, unless you use OMM series for isolated weak points",
  "2026-04-22": "Short immunodeficiency and inheritance videos only",
  "2026-04-23": "Fatty acid oxidation, glycogen storage, complement, transplant/immunosuppressants",
  "2026-04-24": "Chromosomal disorders, tumor suppressor/oncogene basics, metabolic disease rapid pass",
  "2026-04-25": "Only short targeted rewatch of weak psych or derm topics",
  "2026-04-26": "Cranial nerves, visual pathway, eye movements, hearing loss, vertigo",
  "2026-04-27": "Pituitary disorders, adrenal insufficiency, Cushing, pheo, MEN overview",
  "2026-04-28": "Thyroid physiology/pathology, hyper/hypothyroidism, calcium/PTH disorders",
  "2026-04-29": "Diabetes pathophys, insulin/pharm, oral diabetic drugs, DKA/HHS",
  "2026-04-30": "Menstrual cycle, ovarian/testicular endocrine physiology, PCOS, MEN syndromes",
  "2026-05-01": "Contraception, pregnancy physiology, reproductive endocrine basics",
  "2026-05-02": "Endocrine rapid review, endocrine pharm summary",
  "2026-05-03": "Cardiac cycle, heart sounds/murmurs intro, lung volumes/PFT intro",
  "2026-05-04": "Whichever of pituitary/adrenal/thyroid/diabetes/repro endocrine was weakest",
  "2026-05-05": "Valvular lesions, heart failure, cardiomyopathies, heart sounds",
  "2026-05-06": "ACS/MI, antiarrhythmics, AV blocks, tachyarrhythmias, EKG basics",
  "2026-05-07": "Shock states, pressure-volume/hemodynamics, pulmonary circulation, gas exchange",
  "2026-05-08": "None except weak-miss review",
  "2026-05-09": "None except misses",
  "2026-05-10": "Only NBME misses",
  "2026-05-11": "PFT interpretation, hypoxemia, obstructive vs restrictive disease, PE, pulm HTN",
  "2026-05-12": "Hepatitis, cirrhosis, bilirubin metabolism, gallbladder/biliary disease",
  "2026-05-13": "Nephritic syndromes, renal cell/bladder pathology, stones, pelvic pathology if needed",
  "2026-05-14": "IBD/IBS, malabsorption, GI bleeding, appendicitis/diverticular disease",
  "2026-05-15": "Acid-base disorders, sodium/potassium disorders, nephrotic vs nephritic, tubular disorders",
  "2026-05-16": "None except misses",
  "2026-05-17": "Only NBME misses",
  "2026-05-18": "Renal phys + acid-base, liver/biliary, bowel pathology, GU infections if weak",
  "2026-05-19": "Spinal cord tracts, brainstem lesions, stroke localization, cortical syndromes",
  "2026-05-20": "Seizure types/drugs, Parkinson vs Huntington, tremor disorders, migraine/headache",
  "2026-05-21": "CN lesions, pupillary defects, visual field cuts, eye movement disorders, hearing/vestibular",
  "2026-05-22": "UMN vs LMN, neuropathies, myasthenia, Lambert-Eaton, muscular dystrophies",
  "2026-05-23": "None except misses",
  "2026-05-24": "Only NBME misses",
  "2026-05-25": "Biostatistics, screening/prevention, ethics/professionalism",
  "2026-05-26": "None except misses",
  "2026-05-27": "Bone pathology, fractures, upper/lower extremity injuries, compartment syndrome",
  "2026-05-28": "Low back pain, inflammatory arthritides, crystal arthropathies, connective tissue disease",
  "2026-05-29": "Bone tumors, muscle disease, rheum rapid review",
  "2026-05-30": "None except misses",
  "2026-05-31": "Only assessment misses",
  "2026-06-01": "Biostats formulas, ethics, quick weak-topic rewatch only",
  "2026-06-02": "None except misses",
  "2026-06-03": "Any missed MSK/rheum/neuromuscular videos",
  "2026-06-04": "Antidepressants/antipsychotics, derm lesions/rashes, anemias/coags, metabolism weak points",
  "2026-06-05": "Only weakest remaining sections",
  "2026-06-06": "None except misses",
  "2026-06-07": "Misses only",
  "2026-06-08": "Short weak-topic rewatch only; no new videos",
  "2026-06-09": "Biostats/ethics/one or two confidence-building weak topics only",
  "2026-06-10": "None",
  "2026-06-12": "None",
  "2026-06-13": "None except misses",
  "2026-06-14": "Misses only",
  "2026-06-15": "Metabolism, immunodeficiencies, hypersensitivity, inheritance/chromosomes",
  "2026-06-16": "Psych pharm, derm lesions, anemia/coag, endocrine/repro weak spots",
  "2026-06-17": "Lesion localization, stroke syndromes, arrhythmias/EKG, PFT/hypoxemia",
  "2026-06-18": "Renal acid-base, electrolytes, liver/GI bleed, rheum/MSK rapid pass",
  "2026-06-19": "None",
  "2026-06-20": "None",
};

const els = {
  countdownGrid: document.getElementById("countdownGrid"),
  jumpToTodayBtn: document.getElementById("jumpToTodayBtn"),
  focusModeBtn: document.getElementById("focusModeBtn"),
  exitFocusBtn: document.getElementById("exitFocusBtn"),
  plannerSection: document.getElementById("plannerSection"),
  todayTitle: document.getElementById("todayTitle"),
  todayPhaseBadge: document.getElementById("todayPhaseBadge"),
  todaySpotlight: document.getElementById("todaySpotlight"),
  performancePanel: document.getElementById("performancePanel"),
  snapshotStats: document.getElementById("snapshotStats"),
  coverageBars: document.getElementById("coverageBars"),
  reviewPromptCard: document.getElementById("reviewPromptCard"),
  nextReviewPromptBtn: document.getElementById("nextReviewPromptBtn"),
  trendCharts: document.getElementById("trendCharts"),
  calendarExpandBtn: document.getElementById("calendarExpandBtn"),
  examCollapseBtn: document.getElementById("examCollapseBtn"),
  addPracticeExamBtn: document.getElementById("addPracticeExamBtn"),
  topicsCollapseBtn: document.getElementById("topicsCollapseBtn"),
  monthSelect: document.getElementById("monthSelect"),
  typeFilter: document.getElementById("typeFilter"),
  calendarGrid: document.getElementById("calendarGrid"),
  detailTitle: document.getElementById("detailTitle"),
  detailTypeBadge: document.getElementById("detailTypeBadge"),
  detailMeta: document.getElementById("detailMeta"),
  detailPlan: document.getElementById("detailPlan"),
  customTaskInput: document.getElementById("customTaskInput"),
  addCustomTaskBtn: document.getElementById("addCustomTaskBtn"),
  carryOverBox: document.getElementById("carryOverBox"),
  completedInput: document.getElementById("completedInput"),
  energyInput: document.getElementById("energyInput"),
  confidenceInput: document.getElementById("confidenceInput"),
  weakTopicsInput: document.getElementById("weakTopicsInput"),
  weakTopicTags: document.getElementById("weakTopicTags"),
  personalNoteInput: document.getElementById("personalNoteInput"),
  addTlBlockBtn: document.getElementById("addTlBlockBtn"),
  addUwBlockBtn: document.getElementById("addUwBlockBtn"),
  pdfImportStatus: document.getElementById("pdfImportStatus"),
  pdfPasteInput: document.getElementById("pdfPasteInput"),
  pasteTlBtn: document.getElementById("pasteTlBtn"),
  pasteUwBtn: document.getElementById("pasteUwBtn"),
  blockSummary: document.getElementById("blockSummary"),
  blockTrackerList: document.getElementById("blockTrackerList"),
  carryOverDate: document.getElementById("carryOverDate"),
  carryOverBtn: document.getElementById("carryOverBtn"),
  examPreview: document.getElementById("examPreview"),
  examList: document.getElementById("examList"),
  topicsPreview: document.getElementById("topicsPreview"),
  reviewQueue: document.getElementById("reviewQueue"),
  topicTagSummary: document.getElementById("topicTagSummary"),
  backlogList: document.getElementById("backlogList"),
  exportBackupBtn: document.getElementById("exportBackupBtn"),
  importBackupBtn: document.getElementById("importBackupBtn"),
  importBackupInput: document.getElementById("importBackupInput"),
  selectScheduleCsvBtn: document.getElementById("selectScheduleCsvBtn"),
  scheduleCsvInput: document.getElementById("scheduleCsvInput"),
  scheduleImportStatus: document.getElementById("scheduleImportStatus"),
  scheduleImportMapper: document.getElementById("scheduleImportMapper"),
  applyScheduleImportBtn: document.getElementById("applyScheduleImportBtn"),
  resetScheduleBtn: document.getElementById("resetScheduleBtn"),
  backupStatus: document.getElementById("backupStatus"),
  themePicker: document.getElementById("themePicker"),
};

init();

function init() {
  state.selectedMonth = state.selectedDate.slice(0, 7);
  populateScheduleControls();
  renderThemePicker();
  applyTheme();
  bindEvents();
  syncScheduleImportUi();
  render();
}

function populateScheduleControls() {
  const months = [...new Set(schedule.map((item) => item.date.slice(0, 7)))];
  els.monthSelect.innerHTML = months
    .map((month) => {
      const date = new Date(`${month}-01T12:00:00`);
      return `<option value="${month}">${monthFormatter.format(date)}</option>`;
    })
    .join("");

  const types = [...new Set(schedule.map((item) => item.type).filter(Boolean))];
  els.typeFilter.innerHTML =
    '<option value="All">All types</option>' +
    types
      .map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`)
      .join("");

  els.carryOverDate.innerHTML = schedule
    .map(
      (item) =>
        `<option value="${item.date}">${shortDateFormatter.format(
          new Date(`${item.date}T12:00:00`)
        )} • ${escapeHtml(item.system)}</option>`
    )
    .join("");
}

function bindEvents() {
  els.monthSelect.addEventListener("change", (event) => {
    state.selectedMonth = event.target.value;
    renderCalendar();
  });

  els.typeFilter.addEventListener("change", (event) => {
    state.filterType = event.target.value;
    renderCalendar();
  });

  els.calendarExpandBtn.addEventListener("click", () => {
    state.calendarExpanded = !state.calendarExpanded;
    syncCalendarLayout();
  });

  els.examCollapseBtn.addEventListener("click", () => {
    state.examsCollapsed = !state.examsCollapsed;
    syncExamLayout();
  });
  els.addPracticeExamBtn.addEventListener("click", addPracticeExam);

  els.topicsCollapseBtn.addEventListener("click", () => {
    state.topicsCollapsed = !state.topicsCollapsed;
    syncTopicsLayout();
  });
  els.nextReviewPromptBtn.addEventListener("click", showNextReviewPrompt);

  els.jumpToTodayBtn.addEventListener("click", () => {
    const today = getInitialDate();
    state.planEditor = null;
    state.selectedDate = today;
    state.selectedMonth = today.slice(0, 7);
    render();
    scrollToPlanner();
  });

  els.focusModeBtn.addEventListener("click", () => {
    const willEnterFocus = !document.body.classList.contains("focus-mode");
    setFocusMode(willEnterFocus);
    if (willEnterFocus) {
      scrollToPlanner();
    }
  });

  els.exitFocusBtn.addEventListener("click", () => {
    setFocusMode(false);
  });

  [
    "completedInput",
    "energyInput",
    "confidenceInput",
    "weakTopicsInput",
    "personalNoteInput",
  ].forEach((key) => {
    els[key].addEventListener("input", saveCurrentEntry);
    els[key].addEventListener("change", saveCurrentEntry);
  });

  els.carryOverBtn.addEventListener("click", addCarryOver);
  els.addTlBlockBtn.addEventListener("click", () => addQuestionBlock("TrueLearn"));
  els.addUwBlockBtn.addEventListener("click", () => addQuestionBlock("UWorld"));
  els.blockTrackerList.addEventListener("input", handleBlockTrackerChange);
  els.blockTrackerList.addEventListener("change", handleBlockTrackerChange);
  els.blockTrackerList.addEventListener("click", handleBlockTrackerClick);
  els.detailPlan.addEventListener("click", handleTaskToggleClick);
  els.detailPlan.addEventListener("keydown", handlePlanEditorKeydown);
  els.addCustomTaskBtn.addEventListener("click", addCustomTask);
  els.customTaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCustomTask();
    }
  });
  els.examList.addEventListener("input", handleExamTrackerChange);
  els.examList.addEventListener("change", handleExamTrackerChange);
  els.examList.addEventListener("click", handleExamTrackerClick);
  els.reviewQueue.addEventListener("click", handleReviewQueueClick);
  els.trendCharts.addEventListener("mouseover", handleTrendPointHover);
  els.trendCharts.addEventListener("mouseout", handleTrendPointLeave);
  els.exportBackupBtn.addEventListener("click", exportBackup);
  els.importBackupBtn.addEventListener("click", () => els.importBackupInput.click());
  els.importBackupInput.addEventListener("change", importBackup);
  els.selectScheduleCsvBtn.addEventListener("click", () => els.scheduleCsvInput.click());
  els.scheduleCsvInput.addEventListener("change", handleScheduleCsvSelect);
  els.applyScheduleImportBtn.addEventListener("click", applyScheduleImport);
  els.resetScheduleBtn.addEventListener("click", resetToBuiltInSchedule);
  els.themePicker.addEventListener("click", handleThemePickerClick);
  els.pasteTlBtn.addEventListener("click", () => importPastedReport("TrueLearn"));
  els.pasteUwBtn.addEventListener("click", () => importPastedReport("UWorld"));
}

function render() {
  applyTheme();
  els.monthSelect.value = state.selectedMonth;
  if (![...els.typeFilter.options].some((option) => option.value === state.filterType)) {
    state.filterType = "All";
  }
  els.typeFilter.value = state.filterType;
  syncThemePickerUi();
  syncCalendarLayout();
  syncExamLayout();
  syncTopicsLayout();
  syncScheduleImportUi();
  renderCountdowns();
  renderTodaySpotlight();
  renderPerformance();
  renderSnapshot();
  renderCoverage();
  renderCalendar();
  renderTrendCharts();
  renderDetail();
  renderExams();
  renderBacklog();
}

function renderThemePicker() {
  if (!els.themePicker) {
    return;
  }
  els.themePicker.innerHTML = themeOptions
    .map(
      (theme) => `
        <button
          type="button"
          class="theme-chip theme-choice-${escapeHtml(theme.id)}"
          data-theme-id="${escapeHtml(theme.id)}"
          aria-label="${escapeHtml(theme.label)} palette"
        >
          <span class="theme-chip-swatches theme-${escapeHtml(theme.id)}">
            <span></span><span></span><span></span>
          </span>
          <span>${escapeHtml(theme.label)}</span>
        </button>
      `
    )
    .join("");
}

function syncThemePickerUi() {
  const activeTheme = state.storage.theme || "sandstone";
  els.themePicker?.querySelectorAll("[data-theme-id]").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeId === activeTheme);
  });
}

function handleThemePickerClick(event) {
  const button = event.target.closest("[data-theme-id]");
  if (!(button instanceof HTMLElement)) {
    return;
  }
  const themeId = button.dataset.themeId;
  if (!themeOptions.some((theme) => theme.id === themeId)) {
    return;
  }
  state.storage.theme = themeId;
  persistStorage();
  render();
}

function applyTheme() {
  document.body.dataset.theme = state.storage.theme || "sandstone";
}

function syncScheduleImportUi() {
  els.resetScheduleBtn.classList.toggle("hidden", !state.storage.scheduleOverride);
  els.applyScheduleImportBtn.classList.toggle("hidden", !state.csvImport);
  els.scheduleImportMapper.classList.toggle("hidden", !state.csvImport);
}

function setFocusMode(enabled) {
  document.body.classList.toggle("focus-mode", enabled);
  els.focusModeBtn.textContent = enabled ? "Focus Mode On" : "Focus Mode";
}

function syncCalendarLayout() {
  els.plannerSection.classList.toggle("calendar-expanded", state.calendarExpanded);
  els.calendarExpandBtn.textContent = state.calendarExpanded ? "Collapse Calendar" : "Expand Calendar";
}

function syncExamLayout() {
  const examCard = els.examList.closest(".utility-card");
  examCard?.classList.toggle("collapsed", state.examsCollapsed);
  els.examCollapseBtn.textContent = state.examsCollapsed ? "Expand Exams" : "Collapse Exams";
  els.examPreview.classList.toggle("hidden", !state.examsCollapsed);
}

function syncTopicsLayout() {
  const topicsCard = els.backlogList.closest(".utility-card");
  topicsCard?.classList.toggle("collapsed", state.topicsCollapsed);
  els.topicsCollapseBtn.textContent = state.topicsCollapsed ? "Expand Topics" : "Collapse Topics";
  els.topicsPreview.classList.toggle("hidden", !state.topicsCollapsed);
}

function scrollToPlanner() {
  els.plannerSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCountdowns() {
  const baseDate = new Date(`${getInitialDate()}T12:00:00`);
  els.countdownGrid.innerHTML = examTargets
    .map((exam) => {
      const targetDate = new Date(`${exam.date}T12:00:00`);
      const diffDays = Math.ceil((targetDate - baseDate) / 86400000);
      return `
        <div class="countdown-card">
          <span>${escapeHtml(exam.label)}</span>
          <strong>${diffDays}</strong>
          <span>${diffDays === 1 ? "day to go" : "days to go"}</span>
        </div>
      `;
    })
    .join("");
}

function renderTodaySpotlight() {
  const today = getDay(state.selectedDate);
  const entry = getEntry(today.date);
  els.todayTitle.textContent = longDateFormatter.format(new Date(`${today.date}T12:00:00`));
  els.todayPhaseBadge.textContent = today.phase;

  els.todaySpotlight.innerHTML = `
    <div class="spotlight-meta">
      <span class="pill">Week ${today.week}</span>
      <span class="pill">${escapeHtml(today.system)}</span>
      <span class="pill">${escapeHtml(today.type)}</span>
      <span class="pill">${entry.completed ? "Completed" : "In Progress"}</span>
    </div>
    <div class="spotlight-plan">
      ${spotlightItem("Obligations", today.obligations || "Open study day")}
      ${spotlightItem("Qbank", today.qbankPlan)}
      ${spotlightItem("Content Focus", getContentFocusText(today))}
      ${spotlightItem(
        "Evening",
        entry.personalNote || today.notes || "Use the command center to write your own closeout."
      )}
    </div>
  `;
}

function renderSnapshot() {
  const completed = Object.values(state.storage.entries).filter((entry) => entry.completed).length;
  const qbankTotals = schedule.reduce(
    (acc, day) => {
      const entry = getEntry(day.date);
      const tlSummary = getSourceSummary(entry, "TrueLearn");
      const uwSummary = getSourceSummary(entry, "UWorld");
      acc.tl += tlSummary.questions;
      acc.uw += uwSummary.questions;
      return acc;
    },
    { tl: 0, uw: 0 }
  );

  const practiceLogged = getExamItems().filter((exam) => {
    const entry = getExamEntry(exam);
    return exam.type === "Practice Exam" && (entry.score || entry.examPercent || entry.examQuestions);
  }).length;

  const currentPhase = getDay(state.selectedDate).phase;

  els.snapshotStats.innerHTML = [
    { label: "Completed days", value: `${completed}/${schedule.length}` },
    { label: "Practice scores logged", value: practiceLogged },
    { label: "Questions logged", value: `${qbankTotals.tl + qbankTotals.uw}` },
    { label: "Current phase", value: currentPhase.replace("Phase ", "") },
  ]
    .map(
      (stat) => `
      <div class="stat-row">
        <span>${escapeHtml(stat.label)}</span>
        <strong>${escapeHtml(String(stat.value))}</strong>
      </div>
    `
    )
    .join("");
}

function renderPerformance() {
  const tlAggregate = getAggregateForSource("TrueLearn");
  const uwAggregate = getAggregateForSource("UWorld");
  const tl25Average = getTrueLearn25Average();

  els.performancePanel.innerHTML = `
    <div class="performance-stat">
      <div class="performance-label">TrueLearn Overall Accuracy</div>
      <strong>${tlAggregate.averageText}</strong>
      <div class="performance-footnote">${tlAggregate.questions} questions across ${tlAggregate.blocks} logged block${tlAggregate.blocks === 1 ? "" : "s"}</div>
    </div>
    <div class="performance-stat">
      <div class="performance-label">TrueLearn 25Q Block Average</div>
      <strong>${tl25Average.text}</strong>
      <div class="performance-footnote">${tl25Average.blocks} qualifying block${tl25Average.blocks === 1 ? "" : "s"}</div>
    </div>
    <div class="performance-stat">
      <div class="performance-label">UWorld Overall Accuracy</div>
      <strong>${uwAggregate.averageText}</strong>
      <div class="performance-footnote">${uwAggregate.questions} questions across ${uwAggregate.blocks} logged block${uwAggregate.blocks === 1 ? "" : "s"}</div>
    </div>
  `;
}

function renderCoverage() {
  const excluded = new Set(["Practice Exam", "Review/Anki", "Real Exam", "Rest/Reset"]);
  const selectedIndex = schedule.findIndex((item) => item.date === state.selectedDate);
  const currentDay = getDay(state.selectedDate);
  const currentSystem = excluded.has(currentDay.system) ? null : currentDay.system;

  const upcomingSystems = [];
  const seen = new Set();
  let upcomingOrder = 1;

  if (currentSystem) {
    upcomingSystems.push({ system: currentSystem, step: "Current" });
    seen.add(currentSystem);
  }

  schedule.slice(Math.max(selectedIndex + 1, 0)).forEach((day) => {
    if (excluded.has(day.system) || seen.has(day.system)) {
      return;
    }
    seen.add(day.system);
    upcomingSystems.push({ system: day.system, step: upcomingOrder === 1 ? "Up next" : `Then ${upcomingOrder}` });
    upcomingOrder += 1;
  });

  if (!upcomingSystems.length) {
    els.coverageBars.innerHTML =
      '<div class="coverage-item"><div class="coverage-step">Current</div><div class="coverage-label"><span class="coverage-name">No active system</span><span class="coverage-now">Review mode</span></div></div>';
    return;
  }

  const previewSystems = upcomingSystems.slice(0, 3);
  const remainingSystems = upcomingSystems.slice(3);

  const renderCoverageCard = (item, index) => `
    <div
      class="coverage-item ${index === 0 && currentSystem ? "current" : ""}"
      style="${systemStyle(item.system)}"
    >
      <div class="coverage-step">${escapeHtml(item.step)}</div>
      <div class="coverage-label">
        <span class="coverage-name">${escapeHtml(item.system)}</span>
        <span class="coverage-now">${index === 0 && currentSystem ? "Now" : ""}</span>
      </div>
    </div>
  `;

  els.coverageBars.innerHTML = `
    ${previewSystems.map((item, index) => renderCoverageCard(item, index)).join("")}
    ${
      remainingSystems.length
        ? `
          <details class="coverage-more">
            <summary>Show ${remainingSystems.length} more system${remainingSystems.length === 1 ? "" : "s"}</summary>
            <div class="coverage-more-list">
              ${remainingSystems
                .map((item, index) => renderCoverageCard(item, previewSystems.length + index))
                .join("")}
            </div>
          </details>
        `
        : ""
    }
  `;
}

function renderCalendar() {
  const days = schedule.filter((item) => item.date.startsWith(state.selectedMonth));
  const firstDate = new Date(`${days[0].date}T12:00:00`);
  const start = new Date(firstDate);
  start.setDate(start.getDate() - firstDate.getDay());

  const gridDays = [];
  for (let i = 0; i < 35; i += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    const iso = toIsoDate(current);
    const found = schedule.find((item) => item.date === iso);
    gridDays.push(found || { date: iso, system: "", type: "Off", contentFocus: "", week: "" });
  }

  els.calendarGrid.innerHTML = gridDays
    .map((day) => {
      const date = new Date(`${day.date}T12:00:00`);
      const isCurrentMonth = day.date.startsWith(state.selectedMonth);
      const isScheduledDay = schedule.some((item) => item.date === day.date);
      const entry = getEntry(day.date);
      const heatLevel = getCalendarHeatLevel(entry);
      const questionCount = getCalendarHeatQuestions(entry);
      const matchesFilter = state.filterType === "All" || day.type === state.filterType;
      const filteredOut = isCurrentMonth && !matchesFilter;

      return `
        <button
          class="calendar-day ${isCurrentMonth ? "" : "other-month"} ${entry.completed ? "done" : ""} ${
        day.date === state.selectedDate ? "active" : ""
      } ${filteredOut ? "filtered-out" : ""}"
          style="${systemStyle(day.system)}"
          data-date="${day.date}"
          ${isScheduledDay ? "" : "disabled"}
        >
          <div class="day-number-row">
            <span class="day-number">${date.getDate()}</span>
            ${entry.completed ? '<span class="completion-badge" aria-label="Completed">✓</span>' : ""}
          </div>
          ${
            day.type && day.type !== "Off"
              ? `<span class="day-type ${typeClass(day.type)}">${escapeHtml(day.type)}</span>`
              : ""
          }
          <div class="calendar-title">${escapeHtml(day.system || "Buffer / open day")}</div>
          <div class="calendar-subtext">${escapeHtml(getCalendarContentFocusText(day))}</div>
          ${
            isScheduledDay
              ? `
                <div class="calendar-heat" aria-label="${escapeHtml(
                  questionCount ? `${questionCount} qbank questions logged` : "No qbank questions logged yet"
                )}">
                  ${[1, 2, 3, 4]
                    .map(
                      (level) =>
                        `<span class="calendar-heat-cell ${heatLevel >= level ? "active" : ""}"></span>`
                    )
                    .join("")}
                </div>
              `
              : ""
          }
        </button>
      `;
    })
    .join("");

  els.calendarGrid.querySelectorAll(".calendar-day").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.hasAttribute("disabled")) {
        return;
      }
      state.planEditor = null;
      state.selectedDate = button.dataset.date;
      state.selectedMonth = state.selectedDate.slice(0, 7);
      render();
    });
  });
}

function renderDetail() {
  const day = getDay(state.selectedDate);
  const entry = getEntry(day.date);
  els.detailTitle.textContent = longDateFormatter.format(new Date(`${day.date}T12:00:00`));
  els.detailTypeBadge.textContent = day.type;
  els.detailMeta.innerHTML = [
    `Week ${day.week}`,
    day.phase,
    day.system,
    entry.energy ? `Energy: ${entry.energy}` : null,
    entry.confidence ? `Confidence: ${entry.confidence}` : null,
  ]
    .filter(Boolean)
    .map((text) => `<span class="meta-pill">${escapeHtml(text)}</span>`)
    .join("");

  const carryIns = state.storage.carryOvers[day.date] || [];
  if (carryIns.length) {
    els.carryOverBox.classList.remove("hidden");
    els.carryOverBox.innerHTML = `<strong>Catch-up cards</strong><div class="muted">${carryIns
      .map((item) => escapeHtml(item))
      .join("<br />")}</div>`;
  } else {
    els.carryOverBox.classList.add("hidden");
    els.carryOverBox.innerHTML = "";
  }

  els.detailPlan.innerHTML = [
    {
      title: "Obligations",
      body: day.obligations || "No fixed school obligations",
      field: "obligations",
      defaultValue: "No fixed school obligations",
    },
    {
      title: "Qbank Plan",
      body: day.qbankPlan,
      field: "qbankPlan",
      defaultValue: "",
    },
    {
      title: "Content Focus",
      body: getContentFocusText(day),
      field: "contentFocus",
      defaultValue: "",
    },
    {
      title: "Evening Notes",
      body: formatEveningNotes(day.notes) || "No preset evening block",
      field: "notes",
      defaultValue: "No preset evening block",
    },
  ]
    .map((item) =>
      item.title === "Qbank Plan"
        ? renderQbankPlanItem(item, entry, day.date)
        : item.title === "Content Focus"
        ? renderContentFocusItem(item, entry)
        : item.title === "Evening Notes"
        ? renderEveningNotesItem(item, entry)
        : renderEditablePlanItem(item, entry)
    )
    .join("") + renderCustomTaskItems(entry);

  renderBlockTracker(entry);
  els.customTaskInput.value = "";
  els.completedInput.checked = Boolean(entry.completed);
  els.energyInput.value = entry.energy || "";
  els.confidenceInput.value = entry.confidence || "";
  els.weakTopicsInput.value = entry.weakTopics || "";
  renderWeakTopicInputTags(entry.weakTopics || "");
  els.personalNoteInput.value = entry.personalNote || "";
  els.carryOverDate.value = getNextDate(day.date);
}

function renderExams() {
  const exams = getExamItems();

  renderExamPreview(exams);

  els.examList.innerHTML = exams
    .map((exam) => {
      const entry = getExamEntry(exam);
      const isReal = exam.type === "Real Exam";
      return `
        <div class="exam-row">
          <div class="exam-topline">
            <strong>${escapeHtml(exam.qbankPlan)}</strong>
            <div class="exam-topline-actions">
              <span class="badge ${isReal ? "" : "accent"}">${escapeHtml(exam.type)}</span>
              <button
                type="button"
                class="mini-btn remove-btn"
                data-action="remove-exam"
                data-exam-key="${escapeHtml(exam.key)}"
                aria-label="Remove ${escapeHtml(exam.qbankPlan)}"
              >
                Remove
              </button>
            </div>
          </div>
          ${
            exam.isCustom
              ? `
          <div class="exam-edit-grid exam-meta-grid">
            <label>
              Exam name
              <input
                type="text"
                data-exam-field="name"
                data-exam-key="${escapeHtml(exam.key)}"
                value="${escapeHtml(exam.qbankPlan)}"
                placeholder="NBME 31"
              />
            </label>
            <label>
              Date
              <input
                type="date"
                data-exam-field="date"
                data-exam-key="${escapeHtml(exam.key)}"
                value="${escapeHtml(exam.date)}"
              />
            </label>
            <label>
              Type
              <select
                data-exam-field="type"
                data-exam-key="${escapeHtml(exam.key)}"
              >
                <option value="Practice Exam" ${exam.type === "Practice Exam" ? "selected" : ""}>Practice Exam</option>
                <option value="Real Exam" ${exam.type === "Real Exam" ? "selected" : ""}>Real Exam</option>
              </select>
            </label>
            <label>
              Focus
              <input
                type="text"
                data-exam-field="contentFocus"
                data-exam-key="${escapeHtml(exam.key)}"
                value="${escapeHtml(exam.contentFocus || "")}"
                placeholder="Mixed / self-assessment"
              />
            </label>
          </div>
          `
              : `
          <div>${escapeHtml(shortDateFormatter.format(new Date(`${exam.date}T12:00:00`)))} • ${escapeHtml(
                  exam.contentFocus
                )}</div>
          `
          }
          <div class="muted">${escapeHtml(exam.obligations)}</div>
          <div class="exam-edit-grid">
            <label>
              Questions
              <input
                type="number"
                min="0"
                data-exam-field="questions"
                data-exam-key="${escapeHtml(exam.key)}"
                value="${escapeHtml(entry.examQuestions ?? "")}"
                placeholder="160"
              />
            </label>
            <label>
              % Correct
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                data-exam-field="percent"
                data-exam-key="${escapeHtml(exam.key)}"
                value="${escapeHtml(entry.examPercent ?? "")}"
                placeholder="68.5"
              />
            </label>
            <label>
              Score / note
              <input
                type="text"
                data-exam-field="score"
                data-exam-key="${escapeHtml(exam.key)}"
                value="${escapeHtml(entry.score || "")}"
                placeholder="218 / strong finish"
              />
            </label>
            <label>
              Topics to focus on
              <textarea
                data-exam-field="focus"
                data-exam-key="${escapeHtml(exam.key)}"
                placeholder="OMM, renal acid-base, murmurs..."
              >${escapeHtml(entry.examFocus || "")}</textarea>
            </label>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderTrendCharts() {
  const tlAggregate = getAggregateForSource("TrueLearn");
  const uwAggregate = getAggregateForSource("UWorld");
  const tl25Aggregate = getTrueLearn25Average();
  const charts = [
    {
      title: "TrueLearn %",
      subtitle: "Percent correct by block",
      color: "#2f7f74",
      soft: "rgba(47, 127, 116, 0.14)",
      summaryText: tlAggregate.averageText,
      points: getTrendPoints((block) => block.source === "TrueLearn" && Number(block.percent || 0) > 0),
    },
    {
      title: "UWorld %",
      subtitle: "Percent correct by block",
      color: "#2e6e8d",
      soft: "rgba(46, 110, 141, 0.14)",
      summaryText: uwAggregate.averageText,
      points: getTrendPoints((block) => block.source === "UWorld" && Number(block.percent || 0) > 0),
    },
    {
      title: "TrueLearn 25Q %",
      subtitle: "Only 25-question TL blocks",
      color: "#bc623e",
      soft: "rgba(188, 98, 62, 0.14)",
      summaryText: tl25Aggregate.text,
      points: getTrendPoints(
        (block) =>
          block.source === "TrueLearn" &&
          Number(block.questions || 0) === 25 &&
          Number(block.percent || 0) > 0
      ),
    },
  ];

  els.trendCharts.innerHTML = charts.map((chart) => renderTrendChartCard(chart)).join("");
}

function getTrendPoints(predicate) {
  return schedule.flatMap((day) => {
    const entry = getEntry(day.date);
    return ((entry.blocks || []).map(hydrateBlock))
      .filter(predicate)
      .map((block, index) => ({
        date: day.date,
        value: Number(block.percent || 0),
        label: `${shortDateFormatter.format(new Date(`${day.date}T12:00:00`))} • ${Math.round(Number(block.percent || 0))}%`,
        tooltip: `${longDateFormatter.format(new Date(`${day.date}T12:00:00`))} • ${block.label || "Question block"} • ${Number(block.percent || 0).toFixed(1)}% • ${Number(block.correct || 0)}/${Number(block.questions || 0)} correct`,
        key: `${day.date}-${index}`,
      }));
  });
}

function renderTrendChartCard(chart) {
  if (!chart.points.length) {
    return `
      <div class="trend-card">
        <div class="trend-card-header">
          <div>
            <strong>${escapeHtml(chart.title)}</strong>
            <div class="muted">${escapeHtml(chart.subtitle)}</div>
          </div>
        </div>
        <div class="trend-empty">Log a few blocks to see this chart.</div>
      </div>
    `;
  }

  const values = chart.points.map((point) => point.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100);
  const range = Math.max(max - min, 1);
  const width = 320;
  const height = 128;
  const paddingX = 14;
  const paddingY = 12;
  const xStep = chart.points.length === 1 ? 0 : (width - paddingX * 2) / (chart.points.length - 1);

  const coords = chart.points.map((point, index) => {
    const x = paddingX + xStep * index;
    const y = height - paddingY - ((point.value - min) / range) * (height - paddingY * 2);
    return { ...point, x, y };
  });

  const polyline = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${paddingX},${height - paddingY} ${polyline} ${coords[coords.length - 1].x},${height - paddingY}`;
  const latest = chart.points[chart.points.length - 1];

  return `
    <div class="trend-card">
      <div class="trend-card-header">
        <div>
          <strong>${escapeHtml(chart.title)}</strong>
          <div class="muted">${escapeHtml(chart.subtitle)}</div>
        </div>
        <div class="trend-latest">${escapeHtml(chart.summaryText || "--")}</div>
      </div>
      <svg viewBox="0 0 ${width} ${height}" class="trend-svg" aria-hidden="true">
        <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" class="trend-axis" />
        <polygon points="${area}" fill="${chart.soft}"></polygon>
        <polyline points="${polyline}" fill="none" stroke="${chart.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
        ${coords
          .map(
            (point) => `
              <g class="trend-point-group">
                <circle cx="${point.x}" cy="${point.y}" r="10" fill="transparent" class="trend-point-hit" data-tooltip="${escapeHtml(point.tooltip)}"></circle>
                <circle cx="${point.x}" cy="${point.y}" r="4" fill="${chart.color}" class="trend-point-dot" data-tooltip="${escapeHtml(point.tooltip)}"></circle>
              </g>
            `
          )
          .join("")}
      </svg>
      <div class="trend-hover-detail" data-default-text="Hover a point for details">Hover a point for details</div>
      <div class="trend-footer">
        <span>${escapeHtml(chart.points[0].label.split(" • ")[0])}</span>
        <span>${escapeHtml(latest.label.split(" • ")[0])}</span>
      </div>
    </div>
  `;
}

function handleTrendPointHover(event) {
  const target = event.target.closest("[data-tooltip]");
  if (!(target instanceof Element)) {
    return;
  }
  const card = target.closest(".trend-card");
  const detail = card?.querySelector(".trend-hover-detail");
  if (!(detail instanceof HTMLElement)) {
    return;
  }
  detail.textContent = target.dataset.tooltip || detail.dataset.defaultText || "";
}

function handleTrendPointLeave(event) {
  const target = event.target.closest("[data-tooltip]");
  if (!(target instanceof Element)) {
    return;
  }
  const related = event.relatedTarget;
  if (related instanceof Node && target.closest(".trend-card")?.contains(related)) {
    return;
  }
  const card = target.closest(".trend-card");
  const detail = card?.querySelector(".trend-hover-detail");
  if (!(detail instanceof HTMLElement)) {
    return;
  }
  detail.textContent = detail.dataset.defaultText || "Hover a point for details";
}

function renderExamPreview(exams) {
  const nextExam = exams.find((exam) => {
    const entry = getExamEntry(exam);
    return !entry.examQuestions || !entry.examPercent;
  });

  if (!nextExam) {
    els.examPreview.innerHTML = `
      <div class="exam-preview-label">Next exam</div>
      <strong>All exams logged</strong>
      <div class="muted">Every exam has questions and percentage recorded.</div>
    `;
    return;
  }

  els.examPreview.innerHTML = `
    <div class="exam-preview-label">Next exam</div>
    <strong>${escapeHtml(nextExam.qbankPlan)}</strong>
    <div>${escapeHtml(shortDateFormatter.format(new Date(`${nextExam.date}T12:00:00`)))} • ${escapeHtml(nextExam.type)}</div>
    <div class="muted">${escapeHtml(nextExam.contentFocus)}</div>
  `;
}

function renderBacklog() {
  const backlog = getBacklogItems();

  renderReviewQueue(backlog);
  renderTopicsPreview(backlog);
  renderReviewPrompt(backlog);
  renderTopicTagSummary(backlog);

  if (!backlog.length) {
    els.backlogList.innerHTML =
      '<div class="backlog-item"><strong>Clear board</strong><div>No backlog yet. Log weak topics or incomplete days and they will appear here.</div></div>';
    return;
  }

  els.backlogList.innerHTML = backlog
    .map((day) => {
      const entry = getEntry(day.date);
      return `
        <div class="backlog-item">
          <div class="backlog-topline">
            <strong>${escapeHtml(shortDateFormatter.format(new Date(`${day.date}T12:00:00`)))}</strong>
            <span>${entry.completed ? "Weak topics" : "Needs review"}</span>
          </div>
          <div>${escapeHtml(day.system)}</div>
          ${renderTopicTags(extractWeakTopicTags(entry.weakTopics || day.contentFocus || ""))}
          <div class="muted preserve-breaks">${escapeHtml(entry.weakTopics || day.contentFocus)}</div>
        </div>
      `;
    })
    .join("");
}

function getBacklogItems() {
  return schedule
    .filter((day) => {
      const entry = getEntry(day.date);
      return (entry.weakTopics && entry.weakTopics.trim()) || (day.date < getInitialDate() && !entry.completed);
    })
    .slice(0, 12);
}

function renderReviewQueue(backlog) {
  const queue = buildReviewQueue(backlog);
  const dueQueue = queue.filter((item) => item.due);
  const currentItem = dueQueue[0] || null;
  const completedToday = Math.max(queue.length - dueQueue.length, 0);
  const totalToday = queue.length;

  if (!totalToday) {
    els.reviewQueue.innerHTML = `
      <div class="review-queue-empty">
        <strong>Review queue is empty</strong>
        <div class="muted">Add weak topics and recurring tags will start surfacing here.</div>
      </div>
    `;
    return;
  }

  if (!currentItem) {
    els.reviewQueue.innerHTML = `
      <div class="topic-tag-summary-label">Review queue</div>
      <div class="review-queue-progress">
        <span>All ${totalToday} tags reviewed for today</span>
        <div class="review-queue-progress-bar">
          <span class="review-queue-progress-fill" style="width:100%"></span>
        </div>
      </div>
      <div class="review-queue-empty">
        <strong>Nice work. You are caught up for today.</strong>
        <div class="muted">Tags will return here automatically when they become due again.</div>
      </div>
    `;
    return;
  }

  els.reviewQueue.innerHTML = `
    <div class="topic-tag-summary-label">Review queue</div>
    <div class="muted review-queue-help">Mark reviewed to snooze this tag until its next due date, then the next due tag will appear.</div>
    <div class="review-queue-progress">
      <span>${completedToday} of ${totalToday} reviewed today</span>
      <span>${dueQueue.length} left</span>
      <div class="review-queue-progress-bar">
        <span class="review-queue-progress-fill" style="width:${(completedToday / totalToday) * 100}%"></span>
      </div>
    </div>
    <div class="review-queue-list">
      <div class="review-queue-item due">
        <div class="review-queue-top">
          <span class="topic-tag-pill">${escapeHtml(currentItem.tag)}</span>
          <button
            type="button"
            class="mini-btn review-queue-btn"
            data-action="mark-tag-reviewed"
            data-tag="${escapeHtml(currentItem.tag)}"
          >
            Mark reviewed
          </button>
        </div>
        <div class="review-queue-meta">
          <span>${currentItem.count} miss${currentItem.count === 1 ? "" : "es"}</span>
          <span>Last seen ${escapeHtml(shortDateFormatter.format(new Date(`${currentItem.lastSeen}T12:00:00`)))}</span>
          <span>${escapeHtml(currentItem.lastReviewed ? `Last reviewed ${shortDateFormatter.format(new Date(`${currentItem.lastReviewed}T12:00:00`))}` : "Never reviewed")}</span>
          <span>Due now</span>
        </div>
      </div>
    </div>
  `;
}

function buildReviewQueue(backlog) {
  const reviewLog = state.storage.tagReviewLog || {};
  const currentDate = state.selectedDate;
  const counts = new Map();

  backlog.forEach((day) => {
    const entry = getEntry(day.date);
    extractWeakTopicTags(entry.weakTopics || day.contentFocus || "").forEach((tag) => {
      const existing = counts.get(tag) || { tag, count: 0, lastSeen: day.date };
      existing.count += 1;
      if (day.date > existing.lastSeen) {
        existing.lastSeen = day.date;
      }
      counts.set(tag, existing);
    });
  });

  return [...counts.values()]
    .map((item) => {
      const lastReviewed = reviewLog[item.tag] || "";
      const intervalDays = item.count >= 4 ? 2 : item.count === 3 ? 3 : item.count === 2 ? 4 : 5;
      const daysSinceReviewed = lastReviewed ? getDaysBetween(lastReviewed, currentDate) : 999;
      const due = !lastReviewed || daysSinceReviewed >= intervalDays;
      const daysUntilDue = due ? 0 : Math.max(intervalDays - daysSinceReviewed, 0);
      const nextDueDate = lastReviewed ? addDaysToIsoDate(lastReviewed, intervalDays) : currentDate;
      const freshnessBoost = Math.max(0, 14 - getDaysBetween(item.lastSeen, currentDate));
      const priority = (due ? 100 : 0) + item.count * 10 + freshnessBoost - daysUntilDue;
      return {
        ...item,
        lastReviewed,
        intervalDays,
        daysUntilDue,
        nextDueDate,
        due,
        reviewedToday: lastReviewed === currentDate,
        priority,
      };
    })
    .sort((a, b) => b.count - a.count || b.lastSeen.localeCompare(a.lastSeen) || a.tag.localeCompare(b.tag));
}

function handleReviewQueueClick(event) {
  const button = event.target.closest('[data-action="mark-tag-reviewed"]');
  if (!button) {
    return;
  }

  const tag = button.dataset.tag;
  if (!tag) {
    return;
  }

  if (!state.storage.tagReviewLog) {
    state.storage.tagReviewLog = {};
  }
  state.storage.tagReviewLog[tag] = state.selectedDate;
  const nextCandidates = getReviewPromptCandidates(getBacklogItems());
  state.reviewPromptIndex = nextCandidates.length ? state.reviewPromptIndex % nextCandidates.length : 0;
  persistStorage();
  renderBacklog();
}

function getReviewPromptCandidate(backlog) {
  const candidates = getReviewPromptCandidates(backlog);
  if (!candidates.length) {
    state.reviewPromptIndex = 0;
    return null;
  }
  state.reviewPromptIndex %= candidates.length;
  return candidates[state.reviewPromptIndex];
}

function getReviewPromptCandidates(backlog) {
  const queue = buildReviewQueue(backlog);
  const prioritizedTags = queue
    .filter((item) => item.due || !item.lastReviewed)
    .map((item) => item.tag);
  const fallbackTags = queue.map((item) => item.tag);

  const lines = backlog.flatMap((day) => {
    const entry = getEntry(day.date);
    const sourceText = entry.weakTopics || day.contentFocus || "";
    return sourceText
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        line,
        date: day.date,
        system: day.system,
        tags: extractWeakTopicTags(line),
      }));
  });

  if (!lines.length) {
    return [];
  }

  const ordered = [];
  const seen = new Set();
  const addMatches = (tags) => {
    for (const tag of tags) {
      lines.forEach((item) => {
        const key = `${item.date}:${item.line}`;
        if (item.tags.includes(tag) && !seen.has(key)) {
          seen.add(key);
          ordered.push(item);
        }
      });
    }
  };

  addMatches(prioritizedTags);
  addMatches(fallbackTags);
  lines
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((item) => {
      const key = `${item.date}:${item.line}`;
      if (!seen.has(key)) {
        seen.add(key);
        ordered.push(item);
      }
    });

  return ordered;
}

function renderTopicsPreview(backlog) {
  const pick = getReviewPromptCandidate(backlog);

  if (!pick) {
    els.topicsPreview.innerHTML = `
      <div class="exam-preview-label">Review prompt</div>
      <strong>No review topics yet</strong>
      <div class="muted">Log weak topics in the command center and one will appear here when collapsed.</div>
    `;
    return;
  }

  els.topicsPreview.innerHTML = `
    <div class="exam-preview-label">Priority review prompt</div>
    <strong>${escapeHtml(pick.line)}</strong>
    ${renderTopicTags(pick.tags)}
    <div>${escapeHtml(shortDateFormatter.format(new Date(`${pick.date}T12:00:00`)))} • ${escapeHtml(pick.system)}</div>
  `;
}

function renderReviewPrompt(backlog) {
  const pick = getReviewPromptCandidate(backlog);
  const candidates = getReviewPromptCandidates(backlog);
  els.nextReviewPromptBtn.disabled = candidates.length <= 1;

  if (!pick) {
    els.reviewPromptCard.innerHTML = `
      <div class="review-prompt-empty">
        <strong>No missed topics yet</strong>
      </div>
    `;
    return;
  }

  els.reviewPromptCard.innerHTML = `
    <strong>${escapeHtml(pick.line)}</strong>
    ${renderTopicTags(pick.tags)}
    <div class="muted">${escapeHtml(shortDateFormatter.format(new Date(`${pick.date}T12:00:00`)))} • ${escapeHtml(pick.system)}</div>
  `;
}

function showNextReviewPrompt() {
  state.reviewPromptIndex += 1;
  renderBacklog();
}

function renderWeakTopicInputTags(text) {
  const tags = extractWeakTopicTags(text);
  els.weakTopicTags.innerHTML = tags.length
    ? renderTopicTags(tags)
    : '<span class="topic-tag-empty">Tags will appear here automatically.</span>';
}

function renderTopicTagSummary(backlog) {
  const counts = new Map();
  backlog.forEach((day) => {
    const entry = getEntry(day.date);
    extractWeakTopicTags(entry.weakTopics || day.contentFocus || "").forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });

  const topTags = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8);

  els.topicTagSummary.innerHTML = topTags.length
    ? `
      <div class="topic-tag-summary-label">Top weak areas</div>
      <div class="topic-tag-list">
        ${topTags
          .map(
            ([tag, count]) =>
              `<span class="topic-tag-pill topic-tag-pill-count">${escapeHtml(tag)} <strong>${count}</strong></span>`
          )
          .join("")}
      </div>
    `
    : '<div class="topic-tag-empty">Add weak topics and your most-missed tags will show up here.</div>';
}

function saveCurrentEntry() {
  const date = state.selectedDate;
  const existing = getEntry(date);
  state.storage.entries[date] = {
    ...existing,
    completed: els.completedInput.checked,
    energy: els.energyInput.value,
    confidence: els.confidenceInput.value,
    weakTopics: els.weakTopicsInput.value,
    personalNote: els.personalNoteInput.value,
  };
  persistStorage();
  renderWeakTopicInputTags(els.weakTopicsInput.value);
  render();
}

function renderBlockTracker(entry) {
  const tlSummary = getSourceSummary(entry, "TrueLearn");
  const uwSummary = getSourceSummary(entry, "UWorld");
  const blocks = entry.blocks || [];

  els.blockSummary.innerHTML = [tlSummary, uwSummary]
    .map(
      (summary) => `
        <div class="block-summary-card">
          <strong>${escapeHtml(summary.label)}</strong>
          <div>${summary.blocks} block${summary.blocks === 1 ? "" : "s"} logged</div>
          <div>${summary.questions} question${summary.questions === 1 ? "" : "s"} tracked</div>
          <div>${summary.averageText}</div>
        </div>
      `
    )
    .join("");

  if (!blocks.length) {
    els.blockTrackerList.innerHTML =
      '<div class="block-entry"><strong>No blocks logged yet</strong><div class="muted">Use the buttons above to add a TrueLearn or UWorld block for this day.</div></div>';
    return;
  }

  els.blockTrackerList.innerHTML = blocks
    .map(
      (block, index) => `
        <div class="block-entry" data-index="${index}">
          <div class="block-entry-top">
            <strong>${escapeHtml(block.source)} Block ${index + 1}</strong>
            <button type="button" class="mini-btn" data-action="remove-block" data-index="${index}">
              Remove
            </button>
          </div>
          <div class="block-entry-grid">
            <label>
              Label
              <input type="text" data-field="label" data-index="${index}" value="${escapeHtml(
                block.label || ""
              )}" placeholder="e.g. Random timed 40" />
            </label>
            <label>
              Questions
              <input type="number" min="0" data-field="questions" data-index="${index}" value="${escapeHtml(
                block.questions ?? ""
              )}" placeholder="40" />
            </label>
            <label>
              Correct
              <input type="number" min="0" data-field="correct" data-index="${index}" value="${escapeHtml(
                block.correct ?? ""
              )}" placeholder="28" />
            </label>
            <label>
              Percent
              <input type="number" min="0" max="100" step="0.1" data-field="percent" data-index="${index}" value="${escapeHtml(
                block.percent ?? ""
              )}" placeholder="70" />
            </label>
          </div>
        </div>
      `
    )
    .join("");
}

function addQuestionBlock(source) {
  const date = state.selectedDate;
  const existing = getEntry(date);
  const blocks = existing.blocks || [];
  blocks.push({
    source,
    label: "",
    questions: "",
    correct: "",
    percent: "",
  });
  state.storage.entries[date] = {
    ...existing,
    blocks,
  };
  persistStorage();
  renderDetail();
  renderSnapshot();
  renderPerformance();
  renderTrendCharts();
}

function importPastedReport(sourceOverride) {
  const rawText = els.pdfPasteInput.value.trim();
  if (!rawText) {
    setPdfStatus("Paste report text first, then choose TrueLearn or UWorld.");
    return;
  }

  const parsed = parseStudyReport(rawText, `${sourceOverride} pasted report`);
  parsed.source = sourceOverride;
  applyImportedReport(parsed, `${sourceOverride} pasted report`, rawText);
  setPdfStatus(`Imported pasted ${sourceOverride} report${parsed.percent ? ` • ${parsed.percent}%` : ""}`);
  els.pdfPasteInput.value = "";
}

function parseStudyReport(text, fileName) {
  const cleaned = text
    .replace(/about:blank\s+\d+\s*\/\s*\d+/gi, " ")
    .replace(/\b\d+\s*\/\s*\d+\b/g, (match) => (/^\d+\s*\/\s*\d+$/.test(match) ? ` ${match} ` : match));
  const normalized = cleaned.replace(/\s+/g, " ").trim();
  const lower = `${fileName} ${normalized}`.toLowerCase();
  const source = lower.includes("uworld") ? "UWorld" : "TrueLearn";

  const percentPatterns = [
    /(\d{1,3}(?:\.\d+)?)\s*%/g,
    /percent(?:age)?\s+(?:correct|score)?[:\s]+(\d{1,3}(?:\.\d+)?)/gi,
  ];
  const questionPatterns = [
    /(\d{1,3})\s+(?:questions|items|qs)\b/gi,
    /total\s+(?:questions|items)[:\s]+(\d{1,3})/gi,
    /question\s+count[:\s]+(\d{1,3})/gi,
    /questions?\s+answered[:\s]+(\d{1,3})/gi,
    /(?:questions|items|qs)\s*[:\s]+(\d{1,3})/gi,
    /(?:block|test|set)\s+of\s+(\d{1,3})/gi,
    /out\s+of\s+(\d{1,3})/gi,
  ];
  const correctPatterns = [
    /(\d{1,3})\s+correct\b/gi,
    /correct[:\s]+(\d{1,3})/gi,
  ];

  const totalCorrect = pickLikelyNumber(
    [/total\s+correct[:\s]+(\d{1,3})/gi],
    normalized,
    (value) => value >= 0 && value <= 400
  );
  const totalIncorrect = pickLikelyNumber(
    [/total\s+incorrect[:\s]+(\d{1,3})/gi],
    normalized,
    (value) => value >= 0 && value <= 400
  );
  const totalOmitted = pickLikelyNumber(
    [/total\s+omitted[:\s]+(\d{1,3})/gi],
    normalized,
    (value) => value >= 0 && value <= 400
  );

  const summaryPercent =
    pickLikelyNumber(
      [
        /your\s+score\s+(\d{1,3}(?:\.\d+)?)\s*%/gi,
        /(\d{1,3}(?:\.\d+)?)\s*%\s+correct\s+your\s+score/gi,
        /overall\s+mean\s+score\s+(\d{1,3}(?:\.\d+)?)\s*%/gi,
      ],
      normalized,
      (value) => value > 0 && value <= 100
    ) ?? null;
  let percent = summaryPercent ?? pickLikelyNumber(percentPatterns, normalized, (value) => value > 0 && value <= 100);
  let questions = pickLikelyNumber(questionPatterns, normalized, (value) => value > 0 && value <= 400);
  const correct =
    totalCorrect ??
    pickLikelyNumber(correctPatterns, normalized, (value) => value > 0 && value <= 400);
  const incorrect = pickLikelyNumber(
    [/total\s+incorrect[:\s]+(\d{1,3})/gi, /(\d{1,3})\s+incorrect\b/gi, /incorrect[:\s]+(\d{1,3})/gi],
    normalized,
    (value) => value >= 0 && value <= 400
  );
  const omitted = pickLikelyNumber(
    [/total\s+omitted[:\s]+(\d{1,3})/gi, /(\d{1,3})\s+omitted\b/gi, /omitted[:\s]+(\d{1,3})/gi],
    normalized,
    (value) => value >= 0 && value <= 400
  );

  if (source === "UWorld" && (totalCorrect !== null || totalIncorrect !== null)) {
    questions = Number(totalCorrect || 0) + Number(totalIncorrect || 0);
  } else if (source === "UWorld" && (correct !== null || incorrect !== null || omitted !== null)) {
    questions = Number(correct || 0) + Number(incorrect || 0) + Number(omitted || 0);
  }

  if (!questions && (correct !== null || incorrect !== null || omitted !== null)) {
    questions = Number(correct || 0) + Number(incorrect || 0) + Number(omitted || 0);
  }

  if (!questions && correct && percent) {
    questions = Math.round(correct / (percent / 100));
  }

  if ((!percent || source === "UWorld") && questions && correct !== null) {
    percent = Number(((Number(correct) / Number(questions)) * 100).toFixed(1));
  }

  const focusHints = [];
  if (/cardio|pulm|renal|neuro|micro|pharm|biochem|omm|msk|gi|gu|psych/i.test(normalized)) {
    const matches = normalized.match(
      /\b(cardio|pulm|renal|neuro|micro|pharm|biochem|omm|msk|gi|gu|psych|endo|repro|heme|onc|immuno|genetics)\b/gi
    );
    if (matches) {
      focusHints.push([...new Set(matches.map((item) => item.toLowerCase()))].join(", "));
    }
  }

  return {
    source,
    label: fileName.replace(/\.pdf$/i, ""),
    questions: questions || "",
    correct: correct || "",
    percent: percent || (questions && correct ? Number(((correct / questions) * 100).toFixed(1)) : ""),
    focus: focusHints.join("\n"),
  };
}

function pickLikelyNumber(patterns, text, predicate) {
  const values = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = Number(match[1]);
      if (predicate(value)) {
        values.push(value);
      }
    }
  }
  return values.length ? values[0] : null;
}

function applyImportedReport(parsed, fileName, rawText) {
  const date = state.selectedDate;
  const existing = getEntry(date);
  const blocks = [...(existing.blocks || [])];
  blocks.push(
    hydrateBlock({
      source: parsed.source,
      label: parsed.label || fileName,
      questions: parsed.questions,
      correct: parsed.correct,
      percent: parsed.percent,
      reportText: rawText.slice(0, 4000),
      importedFrom: fileName,
    })
  );

  state.storage.entries[date] = {
    ...existing,
    blocks,
    weakTopics:
      parsed.focus && !existing.weakTopics
        ? parsed.focus
        : existing.weakTopics,
  };
  persistStorage();
  render();
}

function setPdfStatus(message) {
  els.pdfImportStatus.textContent = message;
}

function handleBlockTrackerChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  const field = target.dataset.field;
  const index = Number(target.dataset.index);
  if (!field || Number.isNaN(index)) {
    return;
  }

  const date = state.selectedDate;
  const existing = getEntry(date);
  const blocks = [...(existing.blocks || [])];
  const block = { ...blocks[index] };
  block[field] = field === "label" ? target.value : normalizeNumber(target.value);
  blocks[index] = hydrateBlock(block);

  state.storage.entries[date] = {
    ...existing,
    blocks,
  };
  persistStorage();
  renderDetail();
  renderSnapshot();
  renderPerformance();
  renderTrendCharts();
}

function handleBlockTrackerClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.dataset.action !== "remove-block") {
    return;
  }

  const index = Number(target.dataset.index);
  if (Number.isNaN(index)) {
    return;
  }

  const date = state.selectedDate;
  const existing = getEntry(date);
  const blocks = [...(existing.blocks || [])];
  blocks.splice(index, 1);
  state.storage.entries[date] = {
    ...existing,
    blocks,
  };
  persistStorage();
  renderDetail();
  renderSnapshot();
  renderPerformance();
  renderTrendCharts();
}

function handleTaskToggleClick(event) {
  const editButton = event.target.closest('[data-action="edit-plan-field"]');
  if (editButton) {
    state.planEditor = {
      type: editButton.dataset.editorType || "field",
      field: editButton.dataset.field || "",
      taskId: editButton.dataset.taskId || "",
    };
    renderDetail();
    return;
  }

  const cancelButton = event.target.closest('[data-action="cancel-plan-edit"]');
  if (cancelButton) {
    state.planEditor = null;
    renderDetail();
    return;
  }

  const saveButton = event.target.closest('[data-action="save-plan-edit"]');
  if (saveButton) {
    savePlanEdit(saveButton);
    return;
  }

  const removeButton = event.target.closest('[data-action="remove-custom-task"]');
  if (removeButton) {
    const taskId = removeButton.dataset.taskId;
    if (!taskId) {
      return;
    }
    removeCustomTask(taskId);
    return;
  }

  const button = event.target.closest("[data-task-title]");
  if (!button) {
    return;
  }

  const title = button.dataset.taskTitle;
  const date = state.selectedDate;
  const existing = getEntry(date);
  const taskChecks = { ...(existing.taskChecks || {}) };
  taskChecks[title] = !taskChecks[title];

  state.storage.entries[date] = {
    ...existing,
    taskChecks,
  };
  syncDayCompletionFromTasks(date);
  persistStorage();
  renderDetail();
  renderTodaySpotlight();
  renderSnapshot();
  renderCalendar();
}

function handlePlanEditorKeydown(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return;
  }

  if (event.key === "Escape") {
    state.planEditor = null;
    renderDetail();
    return;
  }

  if (event.key === "Enter" && !(target instanceof HTMLTextAreaElement && !event.metaKey && !event.ctrlKey)) {
    const saveButton = target.closest(".plan-item")?.querySelector('[data-action="save-plan-edit"]');
    if (saveButton instanceof HTMLElement) {
      event.preventDefault();
      savePlanEdit(saveButton);
    }
  }
}

function addCustomTask() {
  const text = els.customTaskInput.value.trim();
  if (!text) {
    return;
  }

  const date = state.selectedDate;
  const existing = getEntry(date);
  const customTasks = [...(existing.customTasks || [])];
  customTasks.push({
    id: `task-${Date.now()}`,
    text,
  });

  state.storage.entries[date] = {
    ...existing,
    customTasks,
  };
  syncDayCompletionFromTasks(date);
  persistStorage();
  renderDetail();
}

function removeCustomTask(taskId) {
  const date = state.selectedDate;
  const existing = getEntry(date);
  const customTasks = (existing.customTasks || []).filter((task) => task.id !== taskId);
  const taskChecks = { ...(existing.taskChecks || {}) };
  delete taskChecks[`Custom Task::${taskId}`];

  state.storage.entries[date] = {
    ...existing,
    customTasks,
    taskChecks,
  };
  syncDayCompletionFromTasks(date);
  persistStorage();
  renderDetail();
}

function syncDayCompletionFromTasks(date) {
  const day = getDay(date);
  const existing = getEntry(date);
  const taskKeys = getStudyPlanTaskKeys(day, existing);
  const allComplete = taskKeys.length > 0 && taskKeys.every((taskKey) => isTaskComplete(existing, taskKey));

  state.storage.entries[date] = {
    ...existing,
    completed: allComplete,
  };
}

function savePlanEdit(source) {
  const field = source.dataset.field || "";
  const editorType = source.dataset.editorType || "field";
  if (editorType === "custom-task") {
    const taskId = source.dataset.taskId || "";
    const input = els.detailPlan.querySelector(`[data-plan-editor-input="${escapeAttribute(taskId)}"]`);
    if (!(input instanceof HTMLInputElement) || !taskId) {
      return;
    }
    updateCustomTaskText(taskId, input.value);
    state.planEditor = null;
    renderDetail();
    return;
  }

  const input = els.detailPlan.querySelector(`[data-plan-editor-input="${escapeAttribute(field)}"]`);
  if (!(input instanceof HTMLTextAreaElement) || !field) {
    return;
  }
  updatePlanField(field, input.value);
  state.planEditor = null;
  renderDetail();
}

function updatePlanField(field, value) {
  const date = state.selectedDate;
  const overrides = { ...(state.storage.scheduleEdits || {}) };
  const dayOverride = { ...(overrides[date] || {}) };
  const baseDay = schedule.find((item) => item.date === date) || {};
  const normalizedValue = String(value || "").trim();
  const baseValue =
    field === "contentFocus" ? String(baseDay.contentFocus || "").trim() : String(baseDay[field] || "").trim();

  if (!normalizedValue || normalizedValue === baseValue) {
    delete dayOverride[field];
  } else {
    dayOverride[field] = normalizedValue;
  }

  if (Object.keys(dayOverride).length) {
    overrides[date] = dayOverride;
  } else {
    delete overrides[date];
  }

  state.storage.scheduleEdits = overrides;
  syncDayCompletionFromTasks(date);
  persistStorage();
}

function updateCustomTaskText(taskId, value) {
  const date = state.selectedDate;
  const existing = getEntry(date);
  const nextText = String(value || "").trim();
  const customTasks = [...(existing.customTasks || [])].map((task) =>
    task.id === taskId ? { ...task, text: nextText || task.text } : task
  );

  state.storage.entries[date] = {
    ...existing,
    customTasks,
  };
  persistStorage();
}

function handleExamTrackerChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return;
  }

  const field = target.dataset.examField;
  const examKey = target.dataset.examKey;
  if (!field || !examKey) {
    return;
  }
  const shouldRerender = event.type === "change";

  if (field === "name" || field === "date" || field === "type" || field === "contentFocus") {
    updateCustomExam(examKey, field, target.value, shouldRerender);
    return;
  }

  const existing = getExamEntryByKey(examKey);
  const next = { ...existing };

  if (field === "questions") {
    next.examQuestions = normalizeNumber(target.value);
  } else if (field === "percent") {
    next.examPercent = normalizeNumber(target.value);
  } else if (field === "focus") {
    next.examFocus = target.value.trim();
  } else if (field === "score") {
    next.score = target.value.trim();
  }

  if (!state.storage.examEntries) {
    state.storage.examEntries = {};
  }
  state.storage.examEntries[examKey] = next;
  persistStorage();
  renderSnapshot();
  if (shouldRerender) {
    renderExams();
  }
}

function handleExamTrackerClick(event) {
  const button = event.target.closest('[data-action="remove-exam"]');
  if (!button) {
    return;
  }

  const examKey = button.dataset.examKey;
  if (!examKey) {
    return;
  }

  if (examKey.startsWith("custom:")) {
    state.storage.customExams = (state.storage.customExams || []).filter((exam) => `custom:${exam.id}` !== examKey);
    if (state.storage.examEntries) {
      delete state.storage.examEntries[examKey];
    }
  } else {
    const hidden = new Set(state.storage.hiddenExams || []);
    hidden.add(examKey);
    state.storage.hiddenExams = [...hidden];
  }

  persistStorage();
  renderExams();
  renderSnapshot();
}

function addPracticeExam() {
  if (!state.storage.customExams) {
    state.storage.customExams = [];
  }
  const id = `exam-${Date.now()}`;
  state.storage.customExams.push({
    id,
    date: state.selectedDate,
    type: "Practice Exam",
    qbankPlan: "New Practice Exam",
    contentFocus: "Custom exam",
    obligations: "Custom exam entry",
  });
  persistStorage();
  renderExams();
}

function addCarryOver() {
  const fromDay = getDay(state.selectedDate);
  const target = els.carryOverDate.value;
  if (!target || target === fromDay.date) {
    return;
  }

  const carryText = `${shortDateFormatter.format(
    new Date(`${fromDay.date}T12:00:00`)
  )}: ${fromDay.system} catch-up • ${fromDay.contentFocus}`;

  const existing = state.storage.carryOvers[target] || [];
  if (!existing.includes(carryText)) {
    state.storage.carryOvers[target] = [...existing, carryText];
    persistStorage();
    renderDetail();
    renderBacklog();
  }
}

function exportBackup() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    storage: state.storage,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `boards-blueprint-backup-${getInitialDate()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  els.backupStatus.textContent = "Backup exported.";
}

function importBackup(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const nextStorage = parsed.storage || parsed;
      state.storage = sanitizeImportedStorage(nextStorage);
      syncScheduleFromStorage();
      state.selectedDate = getInitialDate();
      state.selectedMonth = state.selectedDate.slice(0, 7);
      state.filterType = "All";
      state.csvImport = null;
      populateScheduleControls();
      persistStorage();
      render();
      els.backupStatus.textContent = "Backup imported successfully.";
    } catch (error) {
      els.backupStatus.textContent = "That backup file could not be imported.";
    } finally {
      els.importBackupInput.value = "";
    }
  };
  reader.readAsText(file);
}

function handleScheduleCsvSelect(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const csvText = String(reader.result || "");
      const parsedImport = parseDelimitedText(csvText);
      if (!parsedImport.rows.length) {
        throw new Error("No rows");
      }
      const headerRowIndex = findHeaderRowIndex(parsedImport.rows);
      if (headerRowIndex < 0) {
        throw new Error("Missing header row");
      }
      const headers = parsedImport.rows[headerRowIndex].map((value, index) => {
        const text = String(value || "").trim();
        return index === 0 ? text.replace(/^\uFEFF/, "") : text;
      });
      const dataRows = parsedImport.rows
        .slice(headerRowIndex + 1)
        .filter((row) => row.some((cell) => String(cell || "").trim()));
      if (!headers.length || !dataRows.length) {
        throw new Error("Missing headers or rows");
      }
      state.csvImport = {
        headers,
        rows: dataRows,
        mappings: guessScheduleMappings(headers),
        delimiter: parsedImport.delimiter,
        headerRowIndex,
      };
      renderScheduleImportMapper();
      els.scheduleImportStatus.textContent = `Loaded ${dataRows.length} rows from a ${parsedImport.delimiterLabel} file. Map your columns, then import your schedule.`;
    } catch (error) {
      state.csvImport = null;
      els.scheduleImportStatus.textContent = "That spreadsheet file could not be read. Export as CSV from Excel or Google Sheets and make sure there is a header row.";
    } finally {
      els.scheduleCsvInput.value = "";
      syncScheduleImportUi();
    }
  };
  reader.readAsText(file);
}

function renderScheduleImportMapper() {
  if (!state.csvImport) {
    els.scheduleImportMapper.innerHTML = "";
    return;
  }

  const fields = [
    { key: "date", label: "Date", required: true },
    { key: "system", label: "System", required: true },
    { key: "type", label: "Type", required: true },
    { key: "contentFocus", label: "Content focus", required: true },
    { key: "qbankPlan", label: "Qbank plan", required: false },
    { key: "obligations", label: "Obligations", required: false },
    { key: "notes", label: "Notes", required: false },
    { key: "phase", label: "Phase", required: false },
    { key: "week", label: "Week", required: false },
  ];

  els.scheduleImportMapper.innerHTML = `
    <div class="schedule-import-grid">
      ${fields
        .map(
          (field) => `
            <label>
              ${escapeHtml(field.label)} ${field.required ? '<span class="import-required">required</span>' : '<span class="import-optional">optional</span>'}
              <select data-import-map="${field.key}">
                <option value="">${field.required ? "Choose column" : "Ignore"}</option>
                ${state.csvImport.headers
                  .map(
                    (header) =>
                      `<option value="${escapeHtml(header)}" ${
                        state.csvImport.mappings[field.key] === header ? "selected" : ""
                      }>${escapeHtml(header)}</option>`
                  )
                  .join("")}
              </select>
            </label>
          `
        )
        .join("")}
    </div>
    <div class="muted import-preview">
      Detected ${escapeHtml(state.csvImport.delimiter === "\t" ? "tab-separated" : state.csvImport.delimiter === ";" ? "semicolon-separated" : "comma-separated")} file • header row ${state.csvImport.headerRowIndex + 1}<br />
      Preview: ${escapeHtml(state.csvImport.headers.slice(0, 6).join(" • "))}${state.csvImport.headers.length > 6 ? " ..." : ""}
    </div>
  `;

  els.scheduleImportMapper.querySelectorAll("[data-import-map]").forEach((select) => {
    select.addEventListener("change", (changeEvent) => {
      state.csvImport.mappings[changeEvent.target.dataset.importMap] = changeEvent.target.value;
    });
  });
}

function applyScheduleImport() {
  if (!state.csvImport) {
    return;
  }

  const result = buildImportedSchedule(state.csvImport);
  if (!result.schedule.length) {
    els.scheduleImportStatus.textContent =
      "Import failed. Make sure date, system, type, and content focus are mapped and each imported row has those values.";
    return;
  }

  schedule = result.schedule;
  state.storage.scheduleOverride = result.schedule;
  state.selectedDate = getInitialDate();
  state.selectedMonth = state.selectedDate.slice(0, 7);
  state.filterType = "All";
  state.csvImport = null;
  persistStorage();
  populateScheduleControls();
  const skippedCopy = result.skippedRows ? ` ${result.skippedRows} row${result.skippedRows === 1 ? " was" : "s were"} skipped because required fields were missing or dates were invalid.` : "";
  const duplicateCopy = result.duplicateDates ? ` ${result.duplicateDates} duplicate date${result.duplicateDates === 1 ? " was" : "s were"} merged by keeping the last row for that date.` : "";
  els.scheduleImportStatus.textContent = `Imported ${result.schedule.length} schedule days.${skippedCopy}${duplicateCopy} This schedule is now saved locally in this browser.`;
  renderScheduleImportMapper();
  render();
}

function resetToBuiltInSchedule() {
  delete state.storage.scheduleOverride;
  schedule = normalizeSchedule(defaultSchedule);
  state.selectedDate = getInitialDate();
  state.selectedMonth = state.selectedDate.slice(0, 7);
  state.filterType = "All";
  state.csvImport = null;
  persistStorage();
  populateScheduleControls();
  renderScheduleImportMapper();
  els.scheduleImportStatus.textContent = "Reverted to the built-in schedule.";
  render();
}

function guessScheduleMappings(headers) {
  const normalized = headers.map((header) => ({
    raw: header,
    key: normalizeHeaderKey(header),
  }));
  const findHeader = (patterns) => {
    const match = normalized.find((header) => patterns.some((pattern) => pattern.test(header.key)));
    return match ? match.raw : "";
  };

  return {
    date: findHeader([/^date$/, /studydate/, /daydate/, /plandate/, /calendar/, /scheduledate/]),
    system: findHeader([/^system$/, /rotation/, /subject/, /discipline/, /unit/, /organ/, /module/, /theme/]),
    type: findHeader([/^type$/, /daytype/, /sessiontype/, /daykind/, /plantype/, /category/]),
    contentFocus: findHeader([/contentfocus/, /focus/, /topic/, /studytopic/, /content/, /assignment/, /focusarea/, /chapter/]),
    qbankPlan: findHeader([/qbank/, /questions/, /blocks/, /questionplan/, /questionbank/, /qb/, /questiontarget/]),
    obligations: findHeader([/obligation/, /school/, /class/, /lecture/, /meeting/, /lab/, /clinic/, /responsibilit/]),
    notes: findHeader([/^notes?$/, /evening/, /comment/, /reminder/, /misc/, /detail/, /extra/]),
    phase: findHeader([/^phase$/, /block/, /sprint/, /period/, /stage/]),
    week: findHeader([/^week$/, /weeknumber/, /weekof/, /studyweek/]),
  };
}

function buildImportedSchedule(csvImport) {
  const required = ["date", "system", "type", "contentFocus"];
  if (required.some((field) => !csvImport.mappings[field])) {
    return { schedule: [], skippedRows: 0, duplicateDates: 0 };
  }

  const indexByHeader = Object.fromEntries(csvImport.headers.map((header, index) => [header, index]));
  let skippedRows = 0;
  const rows = csvImport.rows
    .map((row) => {
      const read = (field) => {
        const header = csvImport.mappings[field];
        if (!header) {
          return "";
        }
        const index = indexByHeader[header];
        return index === undefined ? "" : String(row[index] || "").trim();
      };

      const date = normalizeImportedDate(read("date"));
      const system = read("system");
      const type = read("type");
      const contentFocus = read("contentFocus");
      if (!date || !system || !type || !contentFocus) {
        skippedRows += 1;
        return null;
      }

      return {
        date,
        system,
        type,
        contentFocus,
        qbankPlan: read("qbankPlan"),
        obligations: read("obligations"),
        notes: read("notes"),
        phase: read("phase"),
        week: read("week"),
      };
    })
    .filter(Boolean);

  const duplicateDates = Math.max(0, rows.length - new Set(rows.map((row) => row.date)).size);
  return {
    schedule: normalizeSchedule(rows),
    skippedRows,
    duplicateDates,
  };
}

function normalizeSchedule(rows) {
  const byDate = new Map();
  [...rows]
    .map((row, index) => ({
      date: row.date,
      system: String(row.system || "").trim(),
      type: String(row.type || "Study").trim(),
      contentFocus: String(row.contentFocus || "").trim(),
      qbankPlan: String(row.qbankPlan || "").trim(),
      obligations: String(row.obligations || "").trim(),
      notes: String(row.notes || "").trim(),
      phase: String(row.phase || "Imported Schedule").trim(),
      week: String(row.week || index + 1).trim(),
    }))
    .forEach((row) => {
      if (row.date) {
        byDate.set(row.date, row);
      }
    });

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function loadScheduleData(fallback) {
  try {
    const raw = localStorage.getItem("boards-blueprint-state");
    if (!raw) {
      return normalizeSchedule(fallback);
    }
    const parsed = JSON.parse(raw);
    return parsed.scheduleOverride?.length ? normalizeSchedule(parsed.scheduleOverride) : normalizeSchedule(fallback);
  } catch (error) {
    return normalizeSchedule(fallback);
  }
}

function parseDelimitedText(text) {
  const candidates = [",", "\t", ";"];
  const lines = String(text || "")
    .split(/\r\n|\n|\r/)
    .slice(0, 8)
    .filter((line) => line.trim());
  const scored = candidates
    .map((delimiter) => ({
      delimiter,
      score: scoreDelimiter(lines, delimiter),
    }))
    .sort((a, b) => b.score - a.score);

  const delimiter = scored[0]?.score > 0 ? scored[0].delimiter : ",";
  return {
    delimiter,
    delimiterLabel: delimiter === "\t" ? "tab-separated" : delimiter === ";" ? "semicolon-separated" : "CSV",
    rows: parseCsv(text, delimiter),
  };
}

function parseCsv(text, delimiter = ",") {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function scoreDelimiter(lines, delimiter) {
  if (!lines.length) {
    return 0;
  }

  const counts = lines.map((line) => countDelimiterOutsideQuotes(line, delimiter)).filter((count) => count > 0);
  if (!counts.length) {
    return 0;
  }

  const first = counts[0];
  const consistency = counts.filter((count) => count === first).length;
  return first * 4 + consistency;
}

function countDelimiterOutsideQuotes(line, delimiter) {
  let count = 0;
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === delimiter && !inQuotes) {
      count += 1;
    }
  }

  return count;
}

function findHeaderRowIndex(rows) {
  let bestIndex = -1;
  let bestScore = -1;

  rows.slice(0, 12).forEach((row, index) => {
    const score = scoreHeaderRow(row);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestScore >= 2 ? bestIndex : 0;
}

function scoreHeaderRow(row) {
  const headerKeys = row.map((cell) => normalizeHeaderKey(cell)).filter(Boolean);
  if (!headerKeys.length) {
    return -1;
  }

  const weights = [
    { patterns: [/date/, /daydate/, /studydate/], score: 3 },
    { patterns: [/system/, /rotation/, /subject/, /discipline/, /unit/], score: 3 },
    { patterns: [/type/, /daytype/, /sessiontype/, /category/], score: 2 },
    { patterns: [/focus/, /topic/, /content/, /assignment/], score: 3 },
    { patterns: [/qbank/, /questions/, /blocks/, /qb/], score: 1 },
    { patterns: [/notes?/, /comment/, /extra/, /detail/], score: 1 },
  ];

  return weights.reduce(
    (total, rule) => total + (headerKeys.some((key) => rule.patterns.some((pattern) => pattern.test(key))) ? rule.score : 0),
    0
  );
}

function normalizeHeaderKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function normalizeImportedDate(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (/^\d{5}(\.\d+)?$/.test(raw)) {
    const serial = Number(raw);
    if (!Number.isNaN(serial)) {
      const excelEpoch = Date.UTC(1899, 11, 30);
      const parsedSerial = new Date(excelEpoch + Math.round(serial) * 86400000);
      return toIsoDate(parsedSerial);
    }
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const month = slashMatch[1].padStart(2, "0");
    const day = slashMatch[2].padStart(2, "0");
    const year = slashMatch[3].length === 2 ? `20${slashMatch[3]}` : slashMatch[3];
    return `${year}-${month}-${day}`;
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? "" : toIsoDate(parsed);
}

function sanitizeImportedStorage(storage) {
  return {
    entries: storage.entries || {},
    carryOvers: storage.carryOvers || {},
    examEntries: storage.examEntries || {},
    customExams: storage.customExams || [],
    hiddenExams: storage.hiddenExams || [],
    tagReviewLog: storage.tagReviewLog || {},
    theme: storage.theme || "sandstone",
    scheduleEdits: storage.scheduleEdits || {},
    scheduleOverride: storage.scheduleOverride?.length ? normalizeSchedule(storage.scheduleOverride) : [],
  };
}

function loadStorage() {
  try {
    const raw = localStorage.getItem("boards-blueprint-state");
    const parsed = raw ? JSON.parse(raw) : { entries: {}, carryOvers: {} };
    return sanitizeImportedStorage(parsed);
  } catch (error) {
    return sanitizeImportedStorage({});
  }
}

function persistStorage() {
  localStorage.setItem("boards-blueprint-state", JSON.stringify(state.storage));
}

function syncScheduleFromStorage() {
  schedule = state.storage.scheduleOverride?.length
    ? normalizeSchedule(state.storage.scheduleOverride)
    : normalizeSchedule(defaultSchedule);
}

function getEntry(date) {
  return state.storage.entries[date] || {};
}

function getExamEntry(exam) {
  return getExamEntryByKey(exam.key, exam.date);
}

function getExamEntryByKey(key, date = "") {
  const examEntries = state.storage.examEntries || {};
  if (examEntries[key]) {
    return examEntries[key];
  }
  if (date) {
    return getEntry(date);
  }
  return {};
}

function getExamItems() {
  const hidden = new Set(state.storage.hiddenExams || []);
  const scheduledExams = schedule
    .filter((day) => day.type === "Practice Exam" || day.type === "Real Exam")
    .map((day) => ({
      ...day,
      key: `scheduled:${day.date}:${day.type}`,
      isCustom: false,
    }));

  const customExams = (state.storage.customExams || []).map((exam) => ({
    ...exam,
    key: `custom:${exam.id}`,
    isCustom: true,
  }));

  return [...scheduledExams, ...customExams]
    .filter((exam) => !hidden.has(exam.key))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function updateCustomExam(examKey, field, value, shouldRerender = true) {
  const id = examKey.replace(/^custom:/, "");
  state.storage.customExams = (state.storage.customExams || []).map((exam) => {
    if (exam.id !== id) {
      return exam;
    }
    if (field === "name") {
      return { ...exam, qbankPlan: value.trim() || "New Practice Exam" };
    }
    if (field === "date") {
      return { ...exam, date: value || exam.date };
    }
    if (field === "type") {
      return { ...exam, type: value || "Practice Exam" };
    }
    if (field === "contentFocus") {
      return { ...exam, contentFocus: value.trim() };
    }
    return exam;
  });
  persistStorage();
  if (shouldRerender) {
    renderExams();
  }
}

function extractWeakTopicTags(text) {
  const source = String(text || "").trim();
  if (!source) {
    return [];
  }

  const tags = weakTopicTagRules
    .filter((rule) => rule.patterns.some((pattern) => pattern.test(source)))
    .map((rule) => rule.tag);

  if (!tags.length) {
    return [];
  }

  return [...new Set(tags)];
}

function renderTopicTags(tags) {
  if (!tags.length) {
    return "";
  }

  return `
    <div class="topic-tag-list">
      ${tags.map((tag) => `<span class="topic-tag-pill">${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
}

function getDay(date) {
  const baseDay = schedule.find((item) => item.date === date) || schedule[0];
  const edit = state.storage.scheduleEdits?.[baseDay.date] || {};
  return {
    ...baseDay,
    ...edit,
  };
}

function getDaysBetween(fromDate, toDate) {
  const from = new Date(`${fromDate}T12:00:00`);
  const to = new Date(`${toDate}T12:00:00`);
  return Math.max(0, Math.round((to - from) / 86400000));
}

function addDaysToIsoDate(date, days) {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + days);
  return toIsoDate(next);
}

function getNextDate(date) {
  const index = schedule.findIndex((item) => item.date === date);
  return schedule[Math.min(index + 1, schedule.length - 1)].date;
}

function getContentFocusText(day) {
  const focus = String(day.contentFocus || "").trim();
  const faReference = getVisibleFirstAidReference(day.date);
  const bbReference = boardsAndBeyondReferencesByDate[day.date];
  const lines = [];
  if (focus) {
    lines.push(focus);
  }
  if (faReference) {
    lines.push(`FA: ${faReference}`);
  }
  if (bbReference) {
    lines.push(`B&B: ${bbReference}`);
  }
  return lines.join("\n");
}

function getCalendarContentFocusText(day) {
  const focus = String(day.contentFocus || "").trim();
  const faReference = getVisibleFirstAidReference(day.date);
  const bbReference = boardsAndBeyondReferencesByDate[day.date];
  const lines = [];
  if (focus) {
    lines.push(focus);
  }
  if (faReference) {
    lines.push(`FA: ${faReference}`);
  }
  if (bbReference) {
    lines.push(`B&B: ${bbReference}`);
  }
  return lines.join(" • ");
}

function getVisibleFirstAidReference(date) {
  const faReference = String(firstAidReferencesByDate[date] || "").trim();
  if (!faReference) {
    return "";
  }
  if (/no new fa pages/i.test(faReference)) {
    return "";
  }
  return faReference;
}

function formatEveningNotes(value) {
  const notes = String(value || "").trim();
  if (/^misses to anki$/i.test(notes)) {
    return "Anki";
  }
  return notes;
}

function getInitialDate() {
  const today = new Date();
  const iso = toIsoDate(today);
  return schedule.some((item) => item.date === iso) ? iso : schedule[0].date;
}

function normalizeNumber(value) {
  return value === "" ? "" : Number(value);
}

function hydrateBlock(block) {
  const next = { ...block };
  const questions = Number(next.questions || 0);
  const correct = Number(next.correct || 0);
  const percent = Number(next.percent || 0);

  if (questions > 0 && correct > 0 && !percent) {
    next.percent = Number(((correct / questions) * 100).toFixed(1));
  } else if (questions > 0 && percent > 0 && !correct) {
    next.correct = Math.round((percent / 100) * questions);
  }

  return next;
}

function getSourceSummary(entry, source) {
  const blocks = (entry.blocks || []).filter((block) => block.source === source);
  const blockQuestions = blocks.reduce((sum, block) => sum + Number(block.questions || 0), 0);
  const questions = blockQuestions;
  const weightedCorrect = blocks.reduce((sum, block) => sum + Number(block.correct || 0), 0);
  const average = blockQuestions > 0 ? (weightedCorrect / blockQuestions) * 100 : null;

  return {
    label: source,
    blocks: blocks.length,
    questions,
    averageText: average === null ? "Average: not enough data yet" : `Average: ${average.toFixed(1)}%`,
  };
}

function getAggregateForSource(source) {
  const blocks = schedule.flatMap((day) =>
    ((getEntry(day.date).blocks || []).map(hydrateBlock)).filter((block) => block.source === source)
  );
  const questions = blocks.reduce((sum, block) => sum + Number(block.questions || 0), 0);
  const correct = blocks.reduce((sum, block) => sum + Number(block.correct || 0), 0);
  const average = questions > 0 ? (correct / questions) * 100 : null;

  return {
    blocks: blocks.length,
    questions,
    averageText: average === null ? "--" : `${average.toFixed(1)}%`,
  };
}

function getTrueLearn25Average() {
  const blocks = schedule.flatMap((day) =>
    ((getEntry(day.date).blocks || []).map(hydrateBlock)).filter(
      (block) =>
        block.source === "TrueLearn" &&
        Number(block.questions || 0) === 25 &&
        Number(block.percent || 0) > 0
    )
  );

  if (!blocks.length) {
    return { blocks: 0, text: "--" };
  }

  const average = blocks.reduce((sum, block) => sum + Number(block.percent || 0), 0) / blocks.length;
  return {
    blocks: blocks.length,
    text: `${average.toFixed(1)}%`,
  };
}

function isTaskComplete(entry, title) {
  return Boolean(entry.taskChecks && entry.taskChecks[title]);
}

function getStudyPlanTaskKeys(day, entry) {
  const keys = [];

  keys.push("Obligations");

  const qbankBlocks = parseQbankBlocks(day.qbankPlan, day.date);
  if (qbankBlocks.length) {
    qbankBlocks.forEach((block) => keys.push(`Qbank Plan::${block.label}`));
  } else {
    keys.push("Qbank Plan");
  }

  const contentLines = String(getContentFocusText(day) || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (contentLines.length > 1) {
    contentLines.forEach((line) => keys.push(`Content Focus::${line}`));
  } else {
    keys.push("Content Focus");
  }

  const eveningSegments = String(formatEveningNotes(day.notes) || "No preset evening block")
    .split(/\s*\+\s*/g)
    .map((line) => line.trim())
    .filter(Boolean);
  if (eveningSegments.length > 1) {
    eveningSegments.forEach((segment) => keys.push(`Evening Notes::${segment}`));
  } else {
    keys.push("Evening Notes");
  }

  (entry.customTasks || []).forEach((task) => {
    keys.push(`Custom Task::${task.id}`);
  });

  return keys;
}

function typeClass(type) {
  return `type-${type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function renderQbankPlanItem(item, entry, date) {
  if (isEditingPlanField(item.field)) {
    return renderPlanFieldEditor(item);
  }

  const blocks = parseQbankBlocks(item.body, date);
  if (!blocks.length) {
    return `
      <div class="plan-item task-toggle ${isTaskComplete(entry, item.title) ? "active" : ""}">
        <div class="task-toggle-top">
          <strong>${escapeHtml(item.title)}</strong>
          <div class="task-toggle-actions">
            <button
              type="button"
              class="mini-btn subtle-edit-btn"
              data-action="edit-plan-field"
              data-field="${escapeHtml(item.field)}"
            >
              Edit
            </button>
            <button
              type="button"
              class="task-check-button"
              data-task-title="${escapeHtml(item.title)}"
              aria-label="Mark ${escapeHtml(item.title)} complete"
            >
              <span class="task-check">${isTaskComplete(entry, item.title) ? "✓" : ""}</span>
            </button>
          </div>
        </div>
        <div>${escapeHtml(item.body)}</div>
      </div>
    `;
  }

  const allComplete = blocks.every((block) => isTaskComplete(entry, `${item.title}::${block.label}`));

  return `
    <div class="plan-item static ${allComplete ? "complete" : ""}">
      <div class="task-toggle-top">
        <strong>${escapeHtml(item.title)}</strong>
        <div class="task-toggle-actions">
          <button
            type="button"
            class="mini-btn subtle-edit-btn"
            data-action="edit-plan-field"
            data-field="${escapeHtml(item.field)}"
          >
            Edit
          </button>
          <span class="task-check">${allComplete ? "✓" : ""}</span>
        </div>
      </div>
      <div class="task-chip-row">
        ${blocks
          .map((block) => {
            const taskTitle = `${item.title}::${block.label}`;
            const active = isTaskComplete(entry, taskTitle);
            return `
              <button
                type="button"
                class="task-chip ${active ? "active" : ""}"
                data-task-title="${escapeHtml(taskTitle)}"
                title="${escapeHtml(block.description)}"
              >
                <span class="task-chip-check">${active ? "✓" : ""}</span>
                <span>${escapeHtml(block.label)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderContentFocusItem(item, entry) {
  if (isEditingPlanField(item.field)) {
    return renderPlanFieldEditor(item);
  }

  const lines = String(item.body || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return renderEditablePlanItem(item, entry);
  }

  const allComplete = lines.every((line) => isTaskComplete(entry, `${item.title}::${line}`));

  return `
    <div class="plan-item static ${allComplete ? "complete" : ""}">
      <div class="task-toggle-top">
        <strong>${escapeHtml(item.title)}</strong>
        <div class="task-toggle-actions">
          <button
            type="button"
            class="mini-btn subtle-edit-btn"
            data-action="edit-plan-field"
            data-field="${escapeHtml(item.field)}"
          >
            Edit
          </button>
          <span class="task-check">${allComplete ? "✓" : ""}</span>
        </div>
      </div>
      <div class="task-chip-stack">
        ${lines
          .map((line) => {
            const taskTitle = `${item.title}::${line}`;
            const active = isTaskComplete(entry, taskTitle);
            return `
              <button
                type="button"
                class="task-chip ${active ? "active" : ""}"
                data-task-title="${escapeHtml(taskTitle)}"
                title="${escapeHtml(line)}"
              >
                <span class="task-chip-check">${active ? "✓" : ""}</span>
                <span>${escapeHtml(line)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderEveningNotesItem(item, entry) {
  if (isEditingPlanField(item.field)) {
    return renderPlanFieldEditor(item);
  }

  const segments = String(item.body || "")
    .split(/\s*\+\s*/g)
    .map((line) => line.trim())
    .filter(Boolean);

  if (segments.length <= 1) {
    return renderEditablePlanItem(item, entry);
  }

  const allComplete = segments.every((segment) => isTaskComplete(entry, `${item.title}::${segment}`));

  return `
    <div class="plan-item static ${allComplete ? "complete" : ""}">
      <div class="task-toggle-top">
        <strong>${escapeHtml(item.title)}</strong>
        <div class="task-toggle-actions">
          <button
            type="button"
            class="mini-btn subtle-edit-btn"
            data-action="edit-plan-field"
            data-field="${escapeHtml(item.field)}"
          >
            Edit
          </button>
          <span class="task-check">${allComplete ? "✓" : ""}</span>
        </div>
      </div>
      <div class="task-chip-stack">
        ${segments
          .map((segment) => {
            const taskTitle = `${item.title}::${segment}`;
            const active = isTaskComplete(entry, taskTitle);
            return `
              <button
                type="button"
                class="task-chip ${active ? "active" : ""}"
                data-task-title="${escapeHtml(taskTitle)}"
                title="${escapeHtml(segment)}"
              >
                <span class="task-chip-check">${active ? "✓" : ""}</span>
                <span>${escapeHtml(segment)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderCustomTaskItems(entry) {
  const customTasks = entry.customTasks || [];
  if (!customTasks.length) {
    return "";
  }

  return customTasks
    .map((task) => {
      const taskTitle = `Custom Task::${task.id}`;
      const active = isTaskComplete(entry, taskTitle);
      if (isEditingCustomTask(task.id)) {
        return `
          <div class="plan-item custom-task-item editor">
            <div class="task-toggle-top">
              <strong>Custom Task</strong>
              <div class="task-toggle-actions">
                <button
                  type="button"
                  class="mini-btn subtle-edit-btn"
                  data-action="cancel-plan-edit"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="mini-btn"
                  data-action="save-plan-edit"
                  data-editor-type="custom-task"
                  data-task-id="${escapeHtml(task.id)}"
                >
                  Save
                </button>
              </div>
            </div>
            <input
              type="text"
              data-plan-editor-input="${escapeHtml(task.id)}"
              value="${escapeHtml(task.text)}"
              placeholder="Custom task"
            />
          </div>
        `;
      }
      return `
        <div class="plan-item task-toggle custom-task-item ${active ? "active" : ""}">
          <div class="task-toggle-top">
            <strong>Custom Task</strong>
            <div class="task-toggle-actions">
              <button
                type="button"
                class="mini-btn subtle-edit-btn"
                data-action="edit-plan-field"
                data-editor-type="custom-task"
                data-task-id="${escapeHtml(task.id)}"
              >
                Edit
              </button>
              <button
                type="button"
                class="task-check-button"
                data-task-title="${escapeHtml(taskTitle)}"
                aria-label="Mark custom task complete"
              >
                <span class="task-check">${active ? "✓" : ""}</span>
              </button>
            </div>
          </div>
          <div class="custom-task-body">
            <span data-task-title="${escapeHtml(taskTitle)}">${escapeHtml(task.text)}</span>
            <span
              class="mini-btn remove-task-btn"
              data-action="remove-custom-task"
              data-task-id="${escapeHtml(task.id)}"
              role="button"
              tabindex="0"
            >
              Remove
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderEditablePlanItem(item, entry) {
  if (isEditingPlanField(item.field)) {
    return renderPlanFieldEditor(item);
  }

  return `
    <div class="plan-item task-toggle ${isTaskComplete(entry, item.title) ? "active" : ""}">
      <div class="task-toggle-top">
        <strong>${escapeHtml(item.title)}</strong>
        <div class="task-toggle-actions">
          <button
            type="button"
            class="mini-btn subtle-edit-btn"
            data-action="edit-plan-field"
            data-field="${escapeHtml(item.field)}"
          >
            Edit
          </button>
          <button
            type="button"
            class="task-check-button"
            data-task-title="${escapeHtml(item.title)}"
            aria-label="Mark ${escapeHtml(item.title)} complete"
          >
            <span class="task-check">${isTaskComplete(entry, item.title) ? "✓" : ""}</span>
          </button>
        </div>
      </div>
      <div class="preserve-breaks" data-task-title="${escapeHtml(item.title)}">${escapeHtml(item.body)}</div>
    </div>
  `;
}

function renderPlanFieldEditor(item) {
  const day = getDay(state.selectedDate);
  const rawValue =
    item.field === "contentFocus" ? String(day.contentFocus || "").trim() : String(day[item.field] || "").trim();

  return `
    <div class="plan-item editor">
      <div class="task-toggle-top">
        <strong>${escapeHtml(item.title)}</strong>
        <div class="task-toggle-actions">
          <button
            type="button"
            class="mini-btn subtle-edit-btn"
            data-action="cancel-plan-edit"
          >
            Cancel
          </button>
          <button
            type="button"
            class="mini-btn"
            data-action="save-plan-edit"
            data-field="${escapeHtml(item.field)}"
          >
            Save
          </button>
        </div>
      </div>
      <textarea
        rows="${item.field === "contentFocus" ? 4 : 3}"
        data-plan-editor-input="${escapeHtml(item.field)}"
        placeholder="${escapeHtml(item.defaultValue || "")}"
      >${escapeHtml(rawValue)}</textarea>
    </div>
  `;
}

function isEditingPlanField(field) {
  return Boolean(state.planEditor && state.planEditor.type === "field" && state.planEditor.field === field);
}

function isEditingCustomTask(taskId) {
  return Boolean(state.planEditor && state.planEditor.type === "custom-task" && state.planEditor.taskId === taskId);
}

function getCalendarHeatQuestions(entry) {
  const tlQuestions = getSourceSummary(entry, "TrueLearn").questions;
  const uwQuestions = getSourceSummary(entry, "UWorld").questions;
  return tlQuestions + uwQuestions;
}

function getCalendarHeatLevel(entry) {
  const questions = getCalendarHeatQuestions(entry);
  if (questions >= 81) {
    return 4;
  }
  if (questions >= 41) {
    return 3;
  }
  if (questions >= 21) {
    return 2;
  }
  if (questions >= 1) {
    return 1;
  }
  return 0;
}

function parseQbankBlocks(text, date) {
  const rawText = String(text || "");
  const hasOptionalExtra = /\bopt\b/i.test(rawText) || /\boptional\b/i.test(rawText);
  const normalized = rawText
    .replace(/\bopt\b/gi, "optional")
    .replace(/\s+/g, " ")
    .trim();
  const parsingText = normalized
    .replace(/\boptional\s+(?:\d+(?:-\d+)?\s*(?:TL|UW|VCOM)|(?:TL|UW)\s*\d+(?:-\d+)?)\b/gi, "")
    .replace(/\boptional\s+extra\s+block(?:\s+if\s+energy)?\b/gi, "")
    .trim();

  const blocks = [];
  const seen = new Set();

  const numberFirstMatches = [...parsingText.matchAll(/(\d+(?:-\d+)?)\s*(TL|UW|VCOM)\b/gi)];
  const sourceFirstMatches = [...parsingText.matchAll(/\b(TL|UW)\s*(\d+(?:-\d+)?)\b/gi)];

  [...numberFirstMatches, ...sourceFirstMatches].forEach((match) => {
    const sourceFirst = /^[A-Z]/i.test(match[1]);
    const source = (sourceFirst ? match[1] : match[2]).toUpperCase();
    const count = sourceFirst ? match[2] : match[1];
    const key = `${source}:${count}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);

    if (source === "TL") {
      blocks.push({
        label: `${count} TL`,
        description: `${count} question TrueLearn block`,
      });
      return;
    }
    if (source === "UW") {
      blocks.push({
        label: `${count} UW`,
        description: `${count} question UWorld block`,
      });
      return;
    }
    if (date && date < "2026-04-20") {
      return;
    }
    blocks.push({
      label: `${count} VCOM`,
      description: "VCOM module quiz",
    });
  });

  if (hasOptionalExtra || /\b(?:optional|opt)?\s*extra\s+block(?:\s+if\s+energy)?\b/i.test(normalized)) {
    blocks.push({
      label: "Extra",
      description: "Optional extra question block if energy allows",
    });
  }

  if (!blocks.length) {
    return buildDateAwareQbankBlocks(blocks, date);
  }

  return buildDateAwareQbankBlocks(blocks, date).sort((a, b) => {
    return qbankBlockSortRank(a) - qbankBlockSortRank(b);
  });
}

function qbankBlockSortRank(block) {
  if (block.label.includes("VCOM")) {
    return 3;
  }
  if (block.label === "Extra") {
    return 2;
  }
  return 1;
}

function buildDateAwareQbankBlocks(blocks, date) {
  const nextBlocks = [...blocks];
  const shouldHaveVcom = isWeekdayVcomWindow(date);
  const hasVcom = nextBlocks.some((block) => block.label.includes("VCOM"));

  if (shouldHaveVcom && !hasVcom) {
    nextBlocks.push({
      label: "16 VCOM",
      description: "VCOM module quiz",
    });
  }

  if (!shouldHaveVcom) {
    return nextBlocks.filter((block) => !block.label.includes("VCOM"));
  }

  return nextBlocks;
}

function isWeekdayVcomWindow(date) {
  if (!date || date < "2026-04-20" || date > "2026-05-22") {
    return false;
  }
  const day = new Date(`${date}T12:00:00`).getDay();
  return day >= 1 && day <= 5;
}

function systemStyle(system) {
  const palette = systemPalette[system];
  if (!palette) {
    return "";
  }
  return `--system-color:${palette.color};--system-soft:${palette.soft};`;
}

function spotlightItem(title, body) {
  return `
    <div class="spotlight-item">
      <strong>${escapeHtml(title)}</strong>
      <div>${escapeHtml(body)}</div>
    </div>
  `;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"');
}
