export const MushafStyles = {
    // Line container styles to eliminate whitespace
    line: {
        textAlign: "justify" as const,
        textAlignLast: "justify" as const,
        fontSize: 0,
        lineHeight: 0,
        width: "100%",
        direction: "rtl" as const,
    },
    // Word styles to restore font size
    word: {
        display: "inline-block",
        // Mobile: clamp(0.9rem, 2.8vh, 1.8rem)
        // Desktop: could trigger larger via media queries or just use the clamp
        fontSize: "clamp(0.9rem, 2.8vh, 1.8rem)",
        lineHeight: 1.8,
    }
}
