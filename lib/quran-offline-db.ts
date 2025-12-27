/**
 * بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
 * 
 * Offline Quran Database - Using sql.js (WebAssembly SQLite)
 * Data source: Tarteel QUL
 * 
 * This module provides client-side SQLite access for fully offline
 * Mushaf rendering using QUL data (script, layout, surah names).
 * 
 * NOTE: sql.js is loaded via CDN script tag to bypass Turbopack bundling issues.
 * The script is loaded dynamically at runtime only in the browser.
 */

// Database file paths
const DB_PATHS = {
    script: '/data/qpc-v4.db',
    layout: '/data/qpc-v4-tajweed-15-lines.db',
    surahNames: '/data/surah-names.db',
};

// Type for sql.js Database
interface SqlJsDatabase {
    exec: (sql: string) => { columns: string[]; values: any[][] }[];
    close: () => void;
}

// Cached database instances
let scriptDb: SqlJsDatabase | null = null;
let layoutDb: SqlJsDatabase | null = null;
let surahNamesDb: SqlJsDatabase | null = null;
let sqlPromise: Promise<any> | null = null;

// Declare global initSqlJs that will be loaded from CDN
declare global {
    interface Window {
        initSqlJs?: (config?: { locateFile?: (file: string) => string }) => Promise<any>;
    }
}

/**
 * Load sql.js from CDN via script tag
 * This completely bypasses the bundler
 */
function loadSqlJsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (typeof window !== 'undefined' && window.initSqlJs) {
            resolve();
            return;
        }

        // Only run in browser
        if (typeof window === 'undefined') {
            reject(new Error('sql.js can only run in browser'));
            return;
        }

        // Create script tag
        const script = document.createElement('script');
        script.src = 'https://sql.js.org/dist/sql-wasm.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load sql.js'));
        document.head.appendChild(script);
    });
}

/**
 * Initialize sql.js WASM
 */
async function initSql() {
    if (!sqlPromise) {
        sqlPromise = (async () => {
            // Load sql.js from CDN
            await loadSqlJsScript();

            // Initialize with WASM location
            if (!window.initSqlJs) {
                throw new Error('sql.js not loaded');
            }

            return window.initSqlJs({
                locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
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
    const buffer = await response.arrayBuffer();
    return new SQL.Database(new Uint8Array(buffer));
}

/**
 * Get the script database (words table)
 */
async function getScriptDb(): Promise<SqlJsDatabase> {
    if (!scriptDb) {
        scriptDb = await loadDatabase(DB_PATHS.script);
    }
    return scriptDb;
}

/**
 * Get the layout database (pages table)
 */
async function getLayoutDb(): Promise<SqlJsDatabase> {
    if (!layoutDb) {
        layoutDb = await loadDatabase(DB_PATHS.layout);
    }
    return layoutDb;
}

/**
 * Get the surah names database
 */
async function getSurahNamesDb(): Promise<SqlJsDatabase> {
    if (!surahNamesDb) {
        surahNamesDb = await loadDatabase(DB_PATHS.surahNames);
    }
    return surahNamesDb;
}

// Types based on QUL schema
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
    word_index: number;
    word_key: string;
    surah: number;
    ayah: number;
    text: string;
}

export interface SurahName {
    id: number;
    name: string;
    name_ar?: string;
}

/**
 * Get page layout data for a specific page number
 */
export async function getPageLayout(pageNumber: number): Promise<PageLine[]> {
    const db = await getLayoutDb();
    const result = db.exec(`
    SELECT page_number, line_number, line_type, is_centered, first_word_id, last_word_id, surah_number
    FROM pages
    WHERE page_number = ${pageNumber}
    ORDER BY line_number
  `);

    if (!result.length || !result[0].values.length) {
        return [];
    }

    return result[0].values.map((row: any[]) => ({
        page_number: row[0] as number,
        line_number: row[1] as number,
        line_type: row[2] as 'ayah' | 'surah_name' | 'basmallah',
        is_centered: Boolean(row[3]),
        first_word_id: row[4] as number | null,
        last_word_id: row[5] as number | null,
        surah_number: row[6] as number | null,
    }));
}

/**
 * Get words by ID range
 */
export async function getWords(firstWordId: number, lastWordId: number): Promise<Word[]> {
    const db = await getScriptDb();
    const result = db.exec(`
    SELECT word_index, word_key, surah, ayah, text
    FROM words
    WHERE word_index >= ${firstWordId} AND word_index <= ${lastWordId}
    ORDER BY word_index
  `);

    if (!result.length || !result[0].values.length) {
        return [];
    }

    return result[0].values.map((row: any[]) => ({
        word_index: row[0] as number,
        word_key: row[1] as string,
        surah: row[2] as number,
        ayah: row[3] as number,
        text: row[4] as string,
    }));
}

/**
 * Get concatenated text for a word range
 */
export async function getLineText(firstWordId: number, lastWordId: number): Promise<string> {
    const words = await getWords(firstWordId, lastWordId);
    return words.map(w => w.text).join(' ');
}

/**
 * Get surah name by number
 */
export async function getSurahName(surahNumber: number): Promise<string> {
    const db = await getSurahNamesDb();
    const result = db.exec(`
    SELECT name FROM surahs WHERE id = ${surahNumber}
    UNION
    SELECT name_ar FROM surahs WHERE id = ${surahNumber}
  `);

    if (result.length && result[0].values.length) {
        return result[0].values[0][0] as string;
    }

    return `سورة ${surahNumber}`;
}

/**
 * Get total page count
 */
export async function getTotalPages(): Promise<number> {
    const db = await getLayoutDb();
    const result = db.exec(`SELECT MAX(page_number) FROM pages`);

    if (result.length && result[0].values.length) {
        return result[0].values[0][0] as number;
    }

    return 604; // Default for QPC V4
}

/**
 * Pre-load all databases for faster subsequent access
 */
export async function preloadDatabases(): Promise<void> {
    await Promise.all([
        getScriptDb(),
        getLayoutDb(),
        getSurahNamesDb(),
    ]);
}

/**
 * Clean up database connections
 */
export function closeDatabases(): void {
    if (scriptDb) {
        scriptDb.close();
        scriptDb = null;
    }
    if (layoutDb) {
        layoutDb.close();
        layoutDb = null;
    }
    if (surahNamesDb) {
        surahNamesDb.close();
        surahNamesDb = null;
    }
}
