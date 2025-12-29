"use client";

/**
 * بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
 * 
 * QUL Mushaf Page Component
 * Renders Quran pages using offline QUL data (Tarteel)
 * 
 * Features:
 * - Authentic 15-line layout
 * - Uthmanic Hafs font (qpc-hafs)
 * - Proper text justification
 * - Line-type based rendering (ayah, surah_name, basmallah)
 */

import { useEffect, useState } from "react";
import { getPageLayout, getWords, getSurahName, PageLine, Word } from "@/lib/quran-offline-db";
import { cn } from "@/lib/utils";

interface QulMushafPageProps {
    pageNumber: number;
    className?: string;
}

interface RenderedLine {
    lineNumber: number;
    lineType: 'ayah' | 'surah_name' | 'basmallah';
    isCentered: boolean;
    content: string;
    words?: Word[];
    surahNumber?: number;
}

export function QulMushafPage({ pageNumber, className }: QulMushafPageProps) {
    const [lines, setLines] = useState<RenderedLine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPage() {
            setLoading(true);
            setError(null);

            try {
                // Get layout for this page
                const layout = await getPageLayout(pageNumber);

                if (!layout.length) {
                    setError(`Page ${pageNumber} not found`);
                    setLoading(false);
                    return;
                }

                // Process each line
                const renderedLines: RenderedLine[] = await Promise.all(
                    layout.map(async (line: PageLine) => {
                        const base: RenderedLine = {
                            lineNumber: line.line_number,
                            lineType: line.line_type,
                            isCentered: line.is_centered,
                            content: '',
                        };

                        switch (line.line_type) {
                            case 'surah_name':
                                if (line.surah_number) {
                                    base.content = await getSurahName(line.surah_number);
                                    base.surahNumber = line.surah_number;
                                }
                                break;

                            case 'basmallah':
                                base.content = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
                                break;

                            case 'ayah':
                                if (line.first_word_id && line.last_word_id) {
                                    const words = await getWords(line.first_word_id, line.last_word_id);
                                    base.words = words;
                                    base.content = words.map(w => w.text).join(' ');
                                }
                                break;
                        }

                        return base;
                    })
                );

                setLines(renderedLines);
            } catch (err) {
                console.error('Error loading page:', err);
                setError(err instanceof Error ? err.message : 'Failed to load page');
            } finally {
                setLoading(false);
            }
        }

        loadPage();
    }, [pageNumber]);

    if (loading) {
        return (
            <div className={cn("flex items-center justify-center h-full", className)}>
                <div className="text-muted-foreground animate-pulse">
                    Loading page {pageNumber}...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn("flex items-center justify-center h-full", className)}>
                <div className="text-destructive">{error}</div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "qul-mushaf-page w-full h-full",
                "flex flex-col",
                className
            )}
            style={{
                fontFamily: "'qpc-hafs', serif",
                direction: "rtl",
            }}
            dir="rtl"
        >
            {lines.map((line) => (
                <div
                    key={line.lineNumber}
                    className={cn(
                        "qul-line flex-1 flex items-center",
                        line.lineType === 'surah_name' && "surah-name-line",
                        line.lineType === 'basmallah' && "basmallah-line",
                        line.lineType === 'ayah' && "ayah-line",
                    )}
                    style={{
                        textAlign: line.isCentered ? 'center' : 'justify',
                        justifyContent: line.isCentered ? 'center' : 'space-between',
                    }}
                >
                    {line.lineType === 'surah_name' && (
                        <SurahNameLine name={line.content} surahNumber={line.surahNumber} />
                    )}

                    {line.lineType === 'basmallah' && (
                        <BasmallahLine />
                    )}

                    {line.lineType === 'ayah' && (
                        <AyahLine words={line.words || []} isCentered={line.isCentered} />
                    )}
                </div>
            ))}
        </div>
    );
}

// Sub-components

function SurahNameLine({ name, surahNumber }: { name: string; surahNumber?: number }) {
    return (
        <div className="surah-header-qul w-full text-center py-2">
            <span className="text-lg font-semibold text-primary">
                سُورَةُ {name}
            </span>
        </div>
    );
}

function BasmallahLine() {
    return (
        <div className="basmallah-qul w-full text-center py-1">
            <span className="text-xl">
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
            </span>
        </div>
    );
}

function AyahLine({ words, isCentered }: { words: Word[]; isCentered: boolean }) {
    return (
        <div
            className="ayah-qul w-full"
            style={{
                textAlign: isCentered ? 'center' : 'justify',
                textAlignLast: isCentered ? 'center' : 'justify',
                // Whitespace fix from QUL guide
                fontSize: 0,
                lineHeight: 0,
            }}
        >
            {words.map((word, idx) => (
                <span
                    key={`${word.word_key}-${idx}`}
                    className="qul-word cursor-pointer hover:bg-primary/10 rounded-sm transition-colors"
                    style={{
                        fontSize: 'clamp(1rem, 3vh, 1.8rem)',
                        lineHeight: 1.8,
                        display: 'inline-block',
                    }}
                    data-word-key={word.word_key}
                    data-word-index={word.id}
                >
                    {word.text}
                </span>
            ))}
        </div>
    );
}

export default QulMushafPage;
