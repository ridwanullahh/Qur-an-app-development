/**
 * بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
 * أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ
 * 
 * Offline Quran Database - Using sql.js (WebAssembly SQLite) + JSON
 * Data source: Tarteel QUL
 * 
 * This module provides client-side access for fully offline
 * Mushaf rendering using QUL data (script, layout, surah names).
 * 
 * IMPORTANT: Word text is loaded from Unicode JSON (qpc-hafs-word-by-word.json)
 * to ensure proper Arabic rendering with the qpc-hafs font.
 * Layout data still comes from SQLite for page structure.
 * 
 * OFFLINE-FIRST: All data loaded from local files
 */

// Database file paths
const DB_PATHS = {
    layout: '/data/qpc-v4-tajweed-15-lines.db',
    surahNames: '/data/surah-names.db',
};

// JSON data path for Unicode word text
const WORDS_JSON_PATH = '/data/qpc-hafs-word-by-word.json';

// sql.js WASM paths (locally hosted for offline-first)
const SQL_JS_PATH = '/js/sql-wasm.js';

// Type for sql.js Database
interface SqlJsDatabase {
    exec: (sql: string) => { columns: string[]; values: any[][] }[];
    close: () => void;
}

// Type for word data from JSON
interface WordJsonEntry {
    id: number;
    surah: string;
    ayah: string;
    word: string;
    location: string;
    text: string;
}

// Cached database instances
let layoutDb: SqlJsDatabase | null = null;
let surahNamesDb: SqlJsDatabase | null = null;
let sqlPromise: Promise<any> | null = null;

// Word data cache (from JSON)
let wordsJsonCache: Record<string, WordJsonEntry> | null = null;
let wordsByIdCache: Map<number, WordJsonEntry> | null = null;

// Schema caches
let surahNamesCache: Record<number, string> | null = null;
let pagesSchema: { tableName: string; columns: string[] } | null = null;

// Declare global initSqlJs
declare global {
    interface Window {
        initSqlJs?: (config?: { locateFile?: (file: string) => string }) => Promise<any>;
    }
}

/**
 * Load sql.js from local script (offline-first)
 */
function loadSqlJsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.initSqlJs) {
            resolve();
            return;
        }

        if (typeof window === 'undefined') {
            reject(new Error('sql.js can only run in browser'));
            return;
        }

        const script = document.createElement('script');
        script.src = SQL_JS_PATH;
        script.async = true;

        script.onload = () => resolve();
        script.onerror = () => {
            console.warn('Local sql.js not found, falling back to CDN');
            const cdnScript = document.createElement('script');
            cdnScript.src = 'https://sql.js.org/dist/sql-wasm.js';
            cdnScript.async = true;
            cdnScript.onload = () => resolve();
            cdnScript.onerror = () => reject(new Error('Failed to load sql.js'));
            document.head.appendChild(cdnScript);
        };

        document.head.appendChild(script);
    });
}

/**
 * Initialize sql.js WASM
 */
async function initSql() {
    if (!sqlPromise) {
        sqlPromise = (async () => {
            await loadSqlJsScript();

            if (!window.initSqlJs) {
                throw new Error('sql.js not loaded');
            }

            return window.initSqlJs({
                locateFile: (file: string) => {
                    if (document.querySelector(`script[src*="sql.js.org"]`)) {
                        return `https://sql.js.org/dist/${file}`;
                    }
                    return `/js/${file}`;
                },
            });
        })();
    }
    return sqlPromise;
}

/**
 * Load a SQLite database from URL
 */
async function loadDatabase(url: string): Promise<SqlJsDatabase> {
    const SQL = await initSql();
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load database: ${url}`);
    }
    const buffer = await response.arrayBuffer();
    return new SQL.Database(new Uint8Array(buffer));
}

async function getScriptDb(): Promise<SqlJsDatabase> {
    // This function is no longer used - words are loaded from JSON
    throw new Error('Script database no longer used. Words are loaded from JSON.');
}

/**
 * Load words from JSON file (Unicode text for proper qpc-hafs font rendering)
 */
async function loadWordsJson(): Promise<Map<number, WordJsonEntry>> {
    if (wordsByIdCache) return wordsByIdCache;

    console.log('Loading Unicode words from JSON...');
    const response = await fetch(WORDS_JSON_PATH);
    if (!response.ok) {
        throw new Error(`Failed to load words JSON: ${WORDS_JSON_PATH}`);
    }

    wordsJsonCache = await response.json();
    wordsByIdCache = new Map<number, WordJsonEntry>();

    // Build index by ID for efficient lookup
    for (const key of Object.keys(wordsJsonCache!)) {
        const entry = wordsJsonCache![key];
        wordsByIdCache.set(entry.id, entry);
    }

    console.log(`Loaded ${wordsByIdCache.size} words from JSON`);
    return wordsByIdCache;
}

async function getLayoutDb(): Promise<SqlJsDatabase> {
    if (!layoutDb) {
        layoutDb = await loadDatabase(DB_PATHS.layout);
    }
    return layoutDb;
}

async function getSurahNamesDb(): Promise<SqlJsDatabase> {
    if (!surahNamesDb) {
        surahNamesDb = await loadDatabase(DB_PATHS.surahNames);
    }
    return surahNamesDb;
}

// Types
export interface PageLine {
    page_number: number;
    line_number: number;
    line_type: 'ayah' | 'surah_name' | 'basmallah';
    is_centered: boolean;
    first_word_id: number | null;
    last_word_id: number | null;
    surah_number: number | null;
}

export interface Word {
    id: number;
    word_key: string;
    surah: number;
    ayah: number;
    text: string;
}

/**
 * Note: Words are now loaded from JSON, not SQLite
 * The discoverWordsSchema function is no longer needed
 */

/**
 * Discover schema for pages table
 */
async function discoverPagesSchema(): Promise<{ tableName: string; columns: string[] }> {
    if (pagesSchema) return pagesSchema;

    const db = await getLayoutDb();

    // Find table name
    const tables = db.exec(`SELECT name FROM sqlite_master WHERE type='table'`);
    const tableName = tables[0]?.values[0]?.[0] as string || 'pages';
    console.log('Pages table name:', tableName);

    // Get columns
    const tableInfo = db.exec(`PRAGMA table_info(${tableName})`);
    const columns = tableInfo[0]?.values.map(row => row[1] as string) || [];
    console.log('Pages table columns:', columns);

    pagesSchema = { tableName, columns };
    return pagesSchema;
}

/**
 * Get page layout data for a specific page number
 */
export async function getPageLayout(pageNumber: number): Promise<PageLine[]> {
    const schema = await discoverPagesSchema();
    const db = await getLayoutDb();

    // Build query dynamically based on available columns
    const cols = schema.columns;
    const result = db.exec(`SELECT * FROM ${schema.tableName} WHERE page_number = ${pageNumber} ORDER BY line_number`);

    if (!result.length || !result[0].values.length) {
        return [];
    }

    const colIndex = (name: string) => result[0].columns.indexOf(name);

    return result[0].values.map((row: any[]) => ({
        page_number: row[colIndex('page_number')] as number,
        line_number: row[colIndex('line_number')] as number,
        line_type: row[colIndex('line_type')] as 'ayah' | 'surah_name' | 'basmallah',
        is_centered: Boolean(row[colIndex('is_centered')]),
        first_word_id: row[colIndex('first_word_id')] as number | null,
        last_word_id: row[colIndex('last_word_id')] as number | null,
        surah_number: row[colIndex('surah_number')] as number | null,
    }));
}

/**
 * Get words by ID range - Now uses JSON data for proper Unicode text
 */
export async function getWords(firstWordId: number, lastWordId: number): Promise<Word[]> {
    const wordsMap = await loadWordsJson();
    const words: Word[] = [];

    for (let id = firstWordId; id <= lastWordId; id++) {
        const entry = wordsMap.get(id);
        if (entry) {
            words.push({
                id: entry.id,
                word_key: entry.location,
                surah: parseInt(entry.surah, 10),
                ayah: parseInt(entry.ayah, 10),
                text: entry.text,
            });
        }
    }

    return words;
}

/**
 * Get concatenated text for a word range
 */
export async function getLineText(firstWordId: number, lastWordId: number): Promise<string> {
    const words = await getWords(firstWordId, lastWordId);
    return words.map(w => w.text).join(' ');
}

/**
 * Load all surah names into cache
 */
async function loadSurahNamesCache(): Promise<Record<number, string>> {
    if (surahNamesCache) return surahNamesCache;

    const db = await getSurahNamesDb();

    const tables = db.exec(`SELECT name FROM sqlite_master WHERE type='table'`);
    if (!tables.length || !tables[0].values.length) {
        console.error('No tables found in surah names database');
        surahNamesCache = {};
        return surahNamesCache;
    }

    const tableName = tables[0].values[0][0] as string;
    console.log('Found surah table:', tableName);

    const tableInfo = db.exec(`PRAGMA table_info(${tableName})`);
    const columns = tableInfo[0]?.values.map(row => row[1] as string) || [];
    console.log('Surah table columns:', columns);

    // Find the best column for Arabic name
    let nameColumn = columns.find(c => ['name_arabic', 'name_ar'].includes(c)) || 'name';

    // Find id column
    let idColumn = columns.find(c => ['id', 'surah_number', 'number'].includes(c)) || columns[0];

    const result = db.exec(`SELECT ${idColumn}, ${nameColumn} FROM ${tableName}`);

    surahNamesCache = {};
    if (result.length && result[0].values.length) {
        for (const row of result[0].values) {
            surahNamesCache[row[0] as number] = row[1] as string;
        }
    }

    return surahNamesCache;
}

/**
 * Get surah name by number
 */
export async function getSurahName(surahNumber: number): Promise<string> {
    const cache = await loadSurahNamesCache();
    return cache[surahNumber] || `سورة ${surahNumber}`;
}

/**
 * Get total page count
 */
export async function getTotalPages(): Promise<number> {
    const schema = await discoverPagesSchema();
    const db = await getLayoutDb();
    const result = db.exec(`SELECT MAX(page_number) FROM ${schema.tableName}`);

    if (result.length && result[0].values.length) {
        return result[0].values[0][0] as number;
    }

    return 604;
}

/**
 * Pre-load all databases and data files
 */
export async function preloadDatabases(): Promise<void> {
    await Promise.all([
        loadWordsJson(),
        discoverPagesSchema(),
        loadSurahNamesCache(),
    ]);
}

/**
 * Clean up database connections and caches
 */
export function closeDatabases(): void {
    if (layoutDb) { layoutDb.close(); layoutDb = null; }
    if (surahNamesDb) { surahNamesDb.close(); surahNamesDb = null; }
    surahNamesCache = null;
    wordsJsonCache = null;
    wordsByIdCache = null;
    pagesSchema = null;
}

// حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ
