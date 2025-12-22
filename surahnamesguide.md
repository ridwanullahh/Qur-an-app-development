Surah Resource
QUL exports metadata for each Surah of the Quran in both JSON and SQLite formats.

    {
    "1": {
    "id": 1,
    "name": "Al-Fātiĥah",
    "name_simple": "Al-Fatihah",
    "name_arabic": "الفاتحة",
    "revelation_order": 5,
    "revelation_place": "makkah",
    "verses_count": 7,
    "bismillah_pre": false
    }
    }
  
Field	Type	Description
id	Integer	Surah number (1–114)
name	String	Transliterated Surah name with diacritic
name_simple	String	Transliterated name of the Surah (e.g., Al-Fatihah)
name_arabic	String	Arabic name of the Surah (e.g., الفاتحة)
revelation_order	Integer	Order in which the Surah was revealed historically
revelation_place	String	makkah or madinah – based on location of revelation
verses_count	Integer	Total number of verses in the Surah
bismillah_pre	Boolean	true if the Surah starts with Bismillah and it should be recited; false otherwise