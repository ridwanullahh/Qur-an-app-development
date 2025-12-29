/**
 * بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
 * 
 * Offline Quran Database - Using sql.js (WebAssembly SQLite)
 * Data source: Tarteel QUL
 * 
 * This module provides client-side SQLite access for fully offline
 * Mushaf rendering using QUL data (script, layout, surah names).
 * 
 * OFFLINE-FIRST: sql.js is loaded from local /js/ folder
 * All queries use dynamic schema discovery to handle different column names
 */

// Database file paths
const DB_PATHS = {
    script: '/data/qpc-v4.db',
    layout: '/data/qpc-v4-tajweed-15-lines.db',
    surahNames: '/data/surah-names.db',
};

// sql.js WASM paths (locally hosted for offline-first)
const SQL_JS_PATH = '/js/sql-wasm.js';

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

// Schema caches
let surahNamesCache: Record<number, string> | null = null;
let wordsSchema: { tableName: string; idCol: string; textCol: string } | null = null;
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
    if (!scriptDb) {
        scriptDb = await loadDatabase(DB_PATHS.script);
    }
    return scriptDb;
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
 * Discover schema for words table
 */
async function discoverWordsSchema(): Promise<{ tableName: string; idCol: string; textCol: string }> {
    if (wordsSchema) return wordsSchema;

    const db = await getScriptDb();

    // Find table name
    const tables = db.exec(`SELECT name FROM sqlite_master WHERE type='table'`);
    const tableName = tables[0]?.values[0]?.[0] as string || 'words';
    console.log('Words table name:', tableName);

    // Get columns
    const tableInfo = db.exec(`PRAGMA table_info(${tableName})`);
    const columns = tableInfo[0]?.values.map(row => row[1] as string) || [];
    console.log('Words table columns:', columns);

    // Get a sample row to see actual data
    const sampleRow = db.exec(`SELECT * FROM ${tableName} LIMIT 1`);
    if (sampleRow.length && sampleRow[0].values.length) {
        console.log('Sample word row:');
        sampleRow[0].columns.forEach((col, idx) => {
            console.log(`  "${col}":`, sampleRow[0].values[0][idx]);
        });
    }

    // Find ID column
    let idCol = 'id';
    for (const candidate of ['word_index', 'id', 'word_id', 'index', 'rowid']) {
        if (columns.includes(candidate)) {
            idCol = candidate;
            break;
        }
    }
    console.log('Using ID column:', idCol);

    // Find text column - try more options including Arabic text columns
    let textCol = 'text';
    for (const candidate of ['text_uthmani', 'text_imlaei', 'text', 'word_text', 'code_v4', 'text_indopak', 'v4_page']) {
        if (columns.includes(candidate)) {
            textCol = candidate;
            break;
        }
    }
    console.log('Using text column:', textCol);

    wordsSchema = { tableName, idCol, textCol };
    return wordsSchema;
}

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
 * Get words by ID range
 */
export async function getWords(firstWordId: number, lastWordId: number): Promise<Word[]> {
    const schema = await discoverWordsSchema();
    const db = await getScriptDb();

    const result = db.exec(`
    SELECT * FROM ${schema.tableName}
    WHERE ${schema.idCol} >= ${firstWordId} AND ${schema.idCol} <= ${lastWordId}
    ORDER BY ${schema.idCol}
  `);

    if (!result.length || !result[0].values.length) {
        return [];
    }

    const colIndex = (name: string) => {
        const idx = result[0].columns.indexOf(name);
        return idx >= 0 ? idx : result[0].columns.indexOf(schema.idCol);
    };

    return result[0].values.map((row: any[]) => {
        // Find the ID column index
        const idIdx = result[0].columns.indexOf(schema.idCol);
        const textIdx = result[0].columns.indexOf(schema.textCol);

        // Try to find other columns or use defaults
        const wordKeyIdx = result[0].columns.indexOf('word_key');
        const surahIdx = result[0].columns.indexOf('surah');
        const ayahIdx = result[0].columns.indexOf('ayah');

        return {
            id: row[idIdx] as number,
            word_key: wordKeyIdx >= 0 ? (row[wordKeyIdx] as string) : `${row[surahIdx] || 1}:${row[ayahIdx] || 1}`,
            surah: surahIdx >= 0 ? (row[surahIdx] as number) : 1,
            ayah: ayahIdx >= 0 ? (row[ayahIdx] as number) : 1,
            text: row[textIdx] as string,
        };
    });
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
 * Pre-load all databases
 */
export async function preloadDatabases(): Promise<void> {
    await Promise.all([
        discoverWordsSchema(),
        discoverPagesSchema(),
        loadSurahNamesCache(),
    ]);
}

/**
 * Clean up database connections
 */
export function closeDatabases(): void {
    if (scriptDb) { scriptDb.close(); scriptDb = null; }
    if (layoutDb) { layoutDb.close(); layoutDb = null; }
    if (surahNamesDb) { surahNamesDb.close(); surahNamesDb = null; }
    surahNamesCache = null;
    wordsSchema = null;
    pagesSchema = null;
}
