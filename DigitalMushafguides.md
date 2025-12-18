
Rendering Precision: Building a Digital Quran Mushaf
Jibran Kalia

15 min read
Rendering the Quran in its traditional mushaf (physical book) format is a fascinating technical challenge that sits at the intersection of typography, internationalization, and religious precision. In this guide, I'll walk you through the complete process of building a digital mushaf renderer using data from qul.tarteel.ai.

What is a Mushaf?
A mushaf (مصحف) is a codex or book containing the Quran. Unlike simple text rendering where verses flow continuously, a mushaf maintains the exact physical page layout of a printed Quran. This means:

Fixed pagination: Verse 2:255 (Ayat al-Kursi) always appears on the same page number across all copies
Line-by-line fidelity: Each line contains specific words in a specific order
Visual consistency: Headers, chapter names (surah names), and the Basmallah (بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ) appear at precise positions
This precision is crucial for Islamic education because:

Teachers and students can reference the same page and line numbers
Memorization is aided by visual-spatial memory of page layouts
Traditional teaching methods rely on page-based assignments
Understanding Mushaf Editions
Not all mushafs are identical. There are several popular editions worldwide, each with different layouts:

QCF V1 (1405H print): 604 pages, 15 lines per page - Popular in many regions
QCF V2 (1421H print): 604 pages, 15 lines per page - Updated King Fahd print
Indopak 15 lines (Qudratullah): 610 pages, 15 lines per page - Popular in South Asia
QPC Hafs Nastaleeq 15 lines: 610 pages, 15 lines per page - Alternative Nastaleeq style
Each edition has different:

Total page counts (604 vs 610 pages)
Typography and font styles
Text positioning and justification
The Data Architecture
Understanding qul.tarteel.ai Data Structure
The qul.tarteel.ai API provides comprehensive Quran data with mushaf-specific layouts. Here's the core data you'll need:

1. Structural Data
Chapters (Surahs) - 114 total

{
  "id": 1,
  "name_simple": "Al-Fatihah",
  "name_arabic": "الفاتحة",
  "verses_count": 7,
  "revelation_place": "makkah",
  "revelation_order": 5
}
Verses (Ayahs) - 6,236 total

{
  "id": 1,
  "verse_key": "1:1",
  "surah_number": 1,
  "ayah_number": 1,
  "text_qpc_hafs": "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
  "words_count": 4
}
Words - 83,668 total

This is where it gets interesting. Each word has multiple text representations for different mushaf editions:

{
  "id": 1,
  "location": "1:1:1",  // surah:ayah:word
  "verse_key": "1:1",
  "surah": 1,
  "ayah": 1,
  "word": 1,
  "qpc_v1": "ﭑ",
  "qpc_v2": "ﱁ",
  "indopak_nastaleeq_15": "بِسْمِ",
  "qpc_nastaleeq": "بِسْمِ"
}
Why multiple text versions? The diacritical marks (tashkeel) and typography vary between editions to ensure each word fits perfectly on its designated line.

2. Page Layout Data
Mushaf Metadata

{
  "id": 1,
  "mushaf_name": "QCF V1 (1405H print)",
  "code": "qpc_v1",
  "pages_count": 604,
  "lines_per_page": 15,
  "font_name": "v1"
}
Page Lines Mapping

This is the heart of mushaf rendering - mapping each line on each page:

{
  "mushaf_id": 1,
  "page_number": 1,
  "line_number": 1,
  "line_type": "surah_name",  // or "basmallah" or "ayah"
  "is_centered": true,
  "surah_number": 1,
  "first_word_id": null,
  "last_word_id": null
}
{
  "mushaf_id": 1,
  "page_number": 1,
  "line_number": 3,
  "line_type": "ayah",
  "is_centered": false,
  "first_word_id": 1,    // Points to word "بِسْمِ"
  "last_word_id": 4      // Points to word "ٱلرَّحِيمِ"
}
For the QPC V1 edition with 604 pages and ~15 lines per page, you'll have 9,046 page line records mapping the entire Quran. Note that not all pages have exactly 15 lines—the first two pages of Surah Al-Fatihah and Surah Al-Baqarah have only 8 lines each due to their special formatting with chapter headers.

3. Structural Divisions
To support educational assignments and navigation:

Juz (30 divisions)

{
  "id": 1,
  "first_verse_key": "1:1",
  "last_verse_key": "2:141",
  "verses_count": 148
}
Hizb (60 divisions - 2 per Juz)
Rub (240 divisions - 4 per Hizb, quarters of Juz)
Manzil (7 divisions for weekly completion)
Ruku (558 thematic sections)
Sajdah (15 prostration verses)
All of these can be retrieved from qul.tarteel.ai's API endpoints.

Data Model Design
Here's a platform-agnostic data model for mushaf rendering:

Core Tables
1. mushafs

- id (integer, primary key)
- mushaf_name (string)
- code (enum: qpc_v1, qpc_v2, indopak_nastaleeq_15, qpc_nastaleeq)
- pages_count (integer)
- lines_per_page (integer)
- font_name (string)
2. chapters

- id (integer, 1-114)
- name_simple (string)
- name_arabic (string)
- name_display (string)
- revelation_place (enum: makkah, madinah)
- revelation_order (integer)
- verses_count (integer)
3. verses

- id (integer)
- verse_key (string, unique, e.g., "1:1")
- surah_number (integer, foreign key to chapters)
- ayah_number (integer)
- text_qpc_hafs (text)
- words_count (integer)
4. words

- id (integer, primary key)
- location (string, unique, e.g., "1:1:1")
- verse_key (string, foreign key to verses)
- surah (integer)
- ayah (integer)
- word (integer)
- qpc_v1 (string)
- qpc_v2 (string)
- indopak_nastaleeq_15 (string)
- qpc_nastaleeq (string)
5. mushaf_page_lines (The critical mapping table)

- id (integer)
- mushaf_id (foreign key to mushafs)
- page_number (integer)
- line_number (integer)
- line_type (enum: surah_name, basmallah, ayah)
- is_centered (boolean)
- first_word_id (foreign key to words, nullable)
- last_word_id (foreign key to words, nullable)
- surah_number (integer, nullable, foreign key to chapters)

UNIQUE INDEX on (mushaf_id, page_number, line_number)
Virtual Page Object
Instead of storing pages in the database, generate them on-demand:

class MushafPage {
  constructor(mushaf, pageNumber) {
    this.mushaf = mushaf;
    this.pageNumber = pageNumber;
  }

  getLines() {
    // Query: SELECT * FROM mushaf_page_lines
    //        WHERE mushaf_id = ? AND page_number = ?
    //        ORDER BY line_number
    return database.query(/* ... */);
  }

  getWords() {
    const lines = this.getLines();
    const wordIds = lines
      .filter(line => line.line_type === 'ayah')
      .flatMap(line => [line.first_word_id, line.last_word_id]);

    const minId = Math.min(...wordIds);
    const maxId = Math.max(...wordIds);

    // Query: SELECT * FROM words WHERE id BETWEEN ? AND ? ORDER BY id
    return database.query(/* ... */);
  }

  getVerseBoundaries() {
    const words = this.getWords();
    return {
      firstVerseKey: words[0].verse_key,
      lastVerseKey: words[words.length - 1].verse_key
    };
  }
}
The Rendering Strategy
Step 1: Fetch Page Data
async function renderPage(mushafId, pageNumber) {
  const mushaf = await getMushaf(mushafId);
  const lines = await getPageLines(mushafId, pageNumber);

  return {
    mushaf,
    pageNumber,
    lines: await Promise.all(lines.map(line => processLine(line, mushaf)))
  };
}
Step 2: Process Each Line
async function processLine(line, mushaf) {
  switch (line.line_type) {
    case 'surah_name':
      return {
        type: 'surah_name',
        centered: line.is_centered,
        surahNumber: line.surah_number,
        chapter: await getChapter(line.surah_number)
      };

    case 'basmallah':
      return {
        type: 'basmallah',
        centered: line.is_centered
      };

    case 'ayah':
      const words = await getWordsByRange(
        line.first_word_id,
        line.last_word_id
      );
      return {
        type: 'ayah',
        centered: line.is_centered,
        words: words.map(word => ({
          id: word.id,
          text: getWordTextForMushaf(word, mushaf.code),
          location: word.location
        }))
      };
  }
}

function getWordTextForMushaf(word, mushafCode) {
  switch (mushafCode) {
    case 'qpc_v1': return word.qpc_v1;
    case 'qpc_v2': return word.qpc_v2;
    case 'indopak_nastaleeq_15': return word.indopak_nastaleeq_15;
    case 'qpc_nastaleeq': return word.qpc_nastaleeq;
    default: return word.qpc_v1;
  }
}
Step 3: HTML Structure
<div class="mushaf mushaf-qpc-v1" dir="rtl">
  <div class="page-wrapper">
    <div class="page page-1-qpc-v1">

      <!-- Line 1: Surah Name (centered) -->
      <div class="line line--center line--surah-name">
        <span class="surah-name-icon"><!-- Icon font character --></span>
      </div>

      <!-- Line 2: Basmallah (centered) -->
      <div class="line line--center line--bismillah">
        <span class="bismillah-icon">﷽</span>
      </div>

      <!-- Line 3-15: Verses -->
      <div class="line">
        <div class="ayah">
          <span class="char" id="word-1">بِسْمِ</span>
          <span class="char" id="word-2">ٱللَّهِ</span>
          <span class="char" id="word-3">ٱلرَّحْمَٰنِ</span>
          <span class="char" id="word-4">ٱلرَّحِيمِ</span>
        </div>
      </div>

    </div>
  </div>
</div>
Font Handling: The Secret Sauce
The Challenge
Traditional Quran fonts are large (often 1-2 MB per font file). Loading all fonts at once would destroy performance. Additionally, each mushaf page might need specific typographic adjustments.

The Solution: Per-Page Fonts
For editions like QPC V1, use page-specific font files (604 separate font files):

fonts/
  quran/
    common/
      qpc-hafs-v22.woff2          # General fallback
      surah-names-v4.woff2         # Surah headers
      bismillah.woff2              # Basmallah icon
      quran-common.woff2           # Decorative icons
    v1/
      p1.woff2                     # Page 1 specific
      p2.woff2                     # Page 2 specific
      ...
      p604.woff2                   # Page 604 specific
Font Loading Strategy
Critical: Current Page (Preload)

<link rel="preload"
      href="/fonts/quran/v1/p1.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous">

<style>
  @font-face {
    font-family: 'p1-v1';
    src: url('/fonts/quran/v1/p1.woff2') format('woff2');
    font-display: block;  /* Block rendering until loaded */
  }

  .page-1-qpc_v1 {
    font-family: 'p1-v1', 'qpc-hafs-v22', sans-serif;
  }
</style>
Optimization: Next/Previous Pages (Prefetch)

<link rel="prefetch"
      href="/fonts/quran/v1/p2.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous">

<style>
  @font-face {
    font-family: 'p2-v1';
    src: url('/fonts/quran/v1/p2.woff2') format('woff2');
    font-display: swap;  /* Show fallback first, swap when loaded */
  }
</style>
This approach:

✅ Loads only 3 fonts per page (current + next + previous)
✅ Instant rendering when navigating forward/backward
✅ Minimal initial page load
CSS Architecture
Base Styles
.mushaf {
  color: #111827;
  user-select: none;  /* Prevent accidental text selection */
  -webkit-user-select: none;
}

.dark .mushaf {
  color: #f9fafb;
}

.page-wrapper {
  text-align: center;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  direction: rtl;  /* Right-to-left */
}

.page {
  text-align: justify;
  text-align-last: justify;  /* Justify the last line too */
  unicode-bidi: embed;       /* Proper RTL embedding */
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  font-size: 1.5rem;         /* Mobile: 24px */
}

@media (min-width: 768px) {
  .page {
    padding: 2rem;
    font-size: 3rem;         /* Desktop: 48px */
  }
}
Line Styles
.line {
  text-align: right;
  direction: rtl;
  width: 100%;
  margin-bottom: 0.375rem;
}

@media (min-width: 768px) {
  .line {
    margin-bottom: 1rem;
  }
}

.line--center {
  text-align: center !important;
  text-align-last: center !important;
}

.line--bismillah {
  display: flex;
  justify-content: center;
  align-items: center;
}
Word Rendering: The Whitespace Problem
Here's a critical CSS trick. When rendering justified text with inline elements, browsers add whitespace between elements that breaks justification:

.ayah {
  display: block;
  width: 100%;
  text-align: justify;
  text-align-last: justify;
  font-size: 0;  /* ← CRITICAL: Removes whitespace between chars */
}

.ayah .char {
  display: inline-block;
  font-size: 1.5rem;  /* ← Restore font size on actual words */
}

@media (min-width: 768px) {
  .ayah .char {
    font-size: 3rem;
  }
}
Setting font-size: 0 on the container eliminates whitespace, then individual characters restore their proper size.

Interactive Words (Optional)
For educational applications with mistake tracking or word highlighting:

.char--clickable {
  cursor: pointer;
  padding: 2px 0.5px;
  transition: all 200ms;
  border-radius: 0;

  /* Remove default button styles if using <button> */
  background: none;
  border: none;
  font: inherit;
  color: inherit;
}

.char--clickable:hover {
  background-color: #e5e7eb;
  border-radius: 0.25rem;
}

.dark .char--clickable:hover {
  background-color: #374151;
}

.char--clickable:active {
  background-color: #d1d5db;
  transform: scale(0.98);
}
Performance Optimizations
1. Database Indexing
-- Critical indexes
CREATE UNIQUE INDEX idx_words_location ON words(location);
CREATE INDEX idx_words_verse_key ON words(verse_key);
CREATE INDEX idx_mushaf_page_lines_lookup
  ON mushaf_page_lines(mushaf_id, page_number, line_number);

-- Composite indexes for range queries
CREATE INDEX idx_words_id_range ON words(id);
CREATE INDEX idx_verses_surah_ayah ON verses(surah_number, ayah_number);
2. Efficient Word Queries
Instead of querying each line's words individually:

// ❌ BAD: N+1 queries
for (const line of lines) {
  if (line.line_type === 'ayah') {
    line.words = await getWords(line.first_word_id, line.last_word_id);
  }
}

// ✅ GOOD: Single query for all words on page
const wordIds = lines
  .filter(line => line.line_type === 'ayah')
  .flatMap(line => [line.first_word_id, line.last_word_id]);

const minId = Math.min(...wordIds);
const maxId = Math.max(...wordIds);

const allWords = await database.query(
  'SELECT * FROM words WHERE id BETWEEN ? AND ? ORDER BY id',
  [minId, maxId]
);

// Map words back to lines
for (const line of lines) {
  if (line.line_type === 'ayah') {
    line.words = allWords.filter(w =>
      w.id >= line.first_word_id && w.id <= line.last_word_id
      >
  
