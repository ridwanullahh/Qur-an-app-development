/**
 * بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
 * 
 * Offline Quran Database - Using sql.js (WebAssembly SQLite)
 * Data source: Tarteel QUL
 * 
 * This module provides client-side SQLite access for fully offline
 * Mushaf rendering using QUL data (script, layout, surah names).
 */

import initSqlJs, { Database } from 'sql.js';

// Database file paths
const DB_PATHS = {
    script: '/data/qpc-v4.db',
    layout: '/data/qpc-v4-tajweed-15-lines.db',
    surahNames: '/data/surah-names.db',
};

// Cached database instances
let scriptDb: Database | null = null;
let layoutDb: Database | null = null;
let surahNamesDb: Database | null = null;
let sqlPromise: Promise<any> | null = null;

/**
 * Initialize sql.js WASM
 */
async function initSql() {
    if (!sqlPromise) {
        sqlPromise = initSqlJs({
            // Load WASM from CDN (can also be self-hosted in public folder)
            locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
        });
    }
    return sqlPromise;
}

/**
 * Load a SQLite database from URL
 */
async function loadDatabase(url: string): Promise<Database> {
    const SQL = await initSql();
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new SQL.Database(new Uint8Array(buffer));
}

/**
 * Get the script database (words table)
 */
async function getScriptDb(): Promise<Database> {
    if (!scriptDb) {
        scriptDb = await loadDatabase(DB_PATHS.script);
    }
    return scriptDb;
}

/**
 * Get the layout database (pages table)
 */
async function getLayoutDb(): Promise<Database> {
    if (!layoutDb) {
        layoutDb = await loadDatabase(DB_PATHS.layout);
    }
    return layoutDb;
}

/**
 * Get the surah names database
 */
async function getSurahNamesDb(): Promise<Database> {
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
    // Try different possible column names
    const result = db.exec(`
    SELECT name FROM surahs WHERE id = ${surahNumber}
    UNION
    SELECT name_ar FROM surahs WHERE id = ${surahNumber}
  `);

    if (result.length && result[0].values.length) {
        return result[0].values[0][0] as string;
    }

    // Fallback - try 'name' column from any table
    const fallback = db.exec(`SELECT * FROM sqlite_master WHERE type='table'`);
    console.log('Available tables:', fallback);

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
