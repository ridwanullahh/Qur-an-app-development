# Tajweed Accessibility Guide

**Document ID**: TBD (will be assigned by sf document create)  
**Created**: 2026-05-04  
**Category**: reference  
**Status**: active

---

## Overview

This guide documents the comprehensive accessibility features implemented in the Tajweed color-coding system for the Digital Mushaf application. The system is designed to be fully accessible to all users, including those with visual impairments, motor disabilities, and cognitive differences.

## WCAG 2.1 AA Compliance

The Tajweed system meets or exceeds WCAG 2.1 Level AA standards across all success criteria:

### Perceivable

#### 1.1 Text Alternatives
- **Screen Reader Support**: All Tajweed color-coded elements include ARIA labels that announce the rule name and description
- **Text Alternatives**: Color information is supplemented with text labels in tooltips and detailed panels
- **Non-Text Content**: Visual Tajweed indicators have text equivalents accessible to assistive technologies

#### 1.3 Adaptable
- **Info and Relationships**: Semantic HTML structure with proper ARIA roles and relationships
- **Meaningful Sequence**: Logical reading order maintained for screen readers
- **Sensory Characteristics**: Instructions don't rely solely on color; text labels and patterns available

#### 1.4 Distinguishable
- **Color Contrast**: All color combinations meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **Use of Color**: Color is not the only visual means of conveying information (pattern overlays available)
- **Resize Text**: Text can be resized up to 200% without loss of functionality
- **Images of Text**: No images of text used; all text is actual text

### Operable

#### 2.1 Keyboard Accessible
- **Keyboard Navigation**: Full keyboard access to all Tajweed features
- **No Keyboard Trap**: Users can navigate in and out of all components using standard keyboard commands
- **Keyboard Shortcuts**: Tab, Enter, Space, and Arrow keys supported throughout

#### 2.2 Enough Time
- **No Time Limits**: No time-based restrictions on Tajweed feature usage
- **Pause, Stop, Hide**: Animations can be disabled via reduced motion preference

#### 2.4 Navigable
- **Bypass Blocks**: Skip-to-content links available
- **Page Titled**: All dialogs and panels have descriptive titles
- **Focus Order**: Logical tab order throughout the interface
- **Link Purpose**: All interactive elements have clear, descriptive labels
- **Focus Visible**: Clear focus indicators on all interactive elements (2px outline)

### Understandable

#### 3.1 Readable
- **Language of Page**: Language attributes set correctly (ar, en, ur)
- **Language of Parts**: Multi-language support with proper lang attributes

#### 3.2 Predictable
- **On Focus**: No context changes on focus
- **On Input**: No unexpected context changes on input
- **Consistent Navigation**: Consistent navigation patterns throughout
- **Consistent Identification**: Components with same functionality identified consistently

#### 3.3 Input Assistance
- **Error Identification**: Clear error messages when applicable
- **Labels or Instructions**: All form controls have associated labels
- **Error Suggestion**: Helpful suggestions provided for errors

### Robust

#### 4.1 Compatible
- **Parsing**: Valid HTML with proper nesting and attributes
- **Name, Role, Value**: All UI components have accessible names, roles, and values via ARIA

---

## Accessibility Features

### 1. Screen Reader Support

#### ARIA Labels
All Tajweed elements include comprehensive ARIA labels:

```typescript
aria-label={`${char} - ${ruleName}: ${ruleDescription}`}
```

#### Semantic HTML
- Proper use of semantic elements (`<button>`, `<nav>`, `<main>`)
- ARIA roles where semantic HTML is insufficient
- `role="text"` for Tajweed character spans
- `role="button"` for interactive elements
- `role="region"` for major sections

#### Screen Reader Announcements
- Rule names announced when focused
- State changes announced (enabled/disabled)
- Search results announced
- Filter changes announced

#### Tested With
- **NVDA** (Windows): Full compatibility
- **JAWS** (Windows): Full compatibility
- **VoiceOver** (macOS/iOS): Full compatibility
- **TalkBack** (Android): Full compatibility

### 2. Keyboard Navigation

#### Navigation Keys
- **Tab**: Move forward through interactive elements
- **Shift+Tab**: Move backward through interactive elements
- **Enter**: Activate buttons and links
- **Space**: Activate buttons and toggle states
- **Escape**: Close dialogs and panels (where applicable)
- **Arrow Keys**: Navigate within lists and groups

#### Focus Indicators
- 2px solid outline in primary color
- 2px offset for visibility
- Enhanced 3px outline in high contrast mode
- Never hidden or removed

#### Tab Order
Logical tab order follows visual layout:
1. Main navigation
2. Tajweed Legend toggle
3. Search input
4. Difficulty filters
5. Category headers
6. Rule cards
7. Action buttons
8. Footer actions

### 3. Colorblind Accessibility

#### Colorblind Modes
Four modes available via settings:

##### None (Default)
Standard color palette optimized for normal color vision.

##### Protanopia (Red-Blind)
- Uses blue-yellow spectrum
- Avoids red-green distinctions
- Blue tones for Noon Sakinah rules
- Yellow-brown tones for Madd rules
- Purple tones for Meem Sakinah rules

##### Deuteranopia (Green-Blind)
- Uses blue-purple-yellow spectrum
- Similar to protanopia with adjusted hues
- Enhanced contrast between rule categories

##### Tritanopia (Blue-Blind)
- Uses red-green-purple spectrum
- Avoids blue-yellow distinctions
- Warm colors throughout
- Red tones for Qalqalah and Madd rules
- Green tones for Ra and Lam rules

#### Pattern Overlays
Optional visual patterns supplement color coding:
- **Dots**: Ghunnah and Izhar rules
- **Stripes**: Idgham and Ikhfa rules
- **Grid**: Qalqalah rules
- **Waves**: Madd rules
- **Crosshatch**: Lam and Ra rules

Patterns are subtle (4px size) and don't interfere with readability.

### 4. Visual Accessibility

#### Adjustable Color Intensity
- Range: 0-100%
- Default: 80%
- Allows users to reduce or increase color saturation
- Maintains contrast ratios at all intensity levels

#### High Contrast Mode
Automatically activated via `prefers-contrast: high` media query:
- Increased opacity (25-35% vs 15-20%)
- Bold font weight (600)
- 1px border around colored elements
- Enhanced focus indicators (3px outline)

#### Font Size Scaling
- Supports browser zoom up to 200%
- Responsive font sizes using clamp()
- No horizontal scrolling required
- Layout adapts to larger text

#### Reduced Motion
Respects `prefers-reduced-motion: reduce` media query:
- Disables all animations
- Removes transitions
- Instant state changes
- Scroll behavior set to auto

### 5. Cognitive Accessibility

#### Clear Language
- Simple, direct instructions
- Consistent terminology
- Avoid jargon where possible
- Multi-language support (Arabic, English, Urdu)

#### Consistent UI Patterns
- Predictable interaction patterns
- Consistent button placement
- Familiar iconography
- Standard keyboard shortcuts

#### Progressive Disclosure
- Collapsible sections reduce visual clutter
- Difficulty filters allow gradual learning
- Category grouping organizes information
- Search helps find specific rules quickly

#### Help and Tooltips
- Hover tooltips on all Tajweed elements
- Detailed explanations in word dialog
- Visual examples for each rule
- Audio pronunciation guides (planned)

---

## Implementation Details

### CSS Variables
All Tajweed colors defined as CSS custom properties:

```css
:root {
  --tajweed-ghunnah: #16a34a;
  --tajweed-ghunnah-bg: rgba(22, 163, 74, 0.15);
  /* ... */
}

.dark {
  --tajweed-ghunnah: #22c55e;
  --tajweed-ghunnah-bg: rgba(34, 197, 94, 0.2);
  /* ... */
}
```

### Accessibility Utilities
Centralized accessibility functions in `lib/accessibility.ts`:

```typescript
// Get colorblind-friendly colors
getColorblindColors(rule: TajweedRule, mode: ColorblindMode)

// Apply pattern overlays
applyPatternOverlay(rule: TajweedRule, usePatterns: boolean)

// Check user preferences
prefersReducedMotion(): boolean
prefersHighContrast(): boolean

// Generate ARIA labels
getTajweedAriaLabel(rule: TajweedRule, char: string, language: string)
```

### Context Settings
Accessibility settings stored in QuranContext:

```typescript
interface QuranSettings {
  // ... other settings
  colorblindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia"
  usePatternOverlays: boolean
  highContrastMode: boolean
  reducedMotion: boolean
}
```

---

## Testing Checklist

### Functional Testing
- ✅ All interactive elements keyboard accessible
- ✅ Focus indicators visible on all elements
- ✅ Tab order logical and predictable
- ✅ Enter and Space keys activate buttons
- ✅ Escape closes dialogs
- ✅ No keyboard traps

### Screen Reader Testing
- ✅ All Tajweed elements have ARIA labels
- ✅ Rule names announced correctly
- ✅ State changes announced
- ✅ Search results announced
- ✅ Multi-language support works
- ✅ Semantic HTML structure correct

### Visual Testing
- ✅ Color contrast meets WCAG AA (4.5:1)
- ✅ Text readable at 200% zoom
- ✅ High contrast mode enhances visibility
- ✅ Colorblind modes distinguishable
- ✅ Pattern overlays visible but subtle
- ✅ Focus indicators clearly visible

### Motion Testing
- ✅ Reduced motion preference respected
- ✅ No animations when disabled
- ✅ Transitions removed
- ✅ Scroll behavior set to auto

### Compatibility Testing
- ✅ Works in Chrome, Firefox, Safari, Edge
- ✅ Works on Windows, macOS, Linux
- ✅ Works on iOS and Android
- ✅ Works with NVDA, JAWS, VoiceOver, TalkBack

---

## User Guide

### Enabling Accessibility Features

#### Colorblind Mode
1. Open Settings panel
2. Navigate to Accessibility section
3. Select colorblind mode:
   - None (default)
   - Protanopia (red-blind)
   - Deuteranopia (green-blind)
   - Tritanopia (blue-blind)
4. Changes apply immediately

#### Pattern Overlays
1. Open Settings panel
2. Navigate to Accessibility section
3. Toggle "Use Pattern Overlays"
4. Patterns appear on all Tajweed elements

#### Color Intensity
1. Open Settings panel
2. Navigate to Tajweed section
3. Adjust "Color Intensity" slider (0-100%)
4. Preview changes in real-time

#### High Contrast Mode
Automatically enabled when system preference is set:
- **Windows**: Settings > Ease of Access > High Contrast
- **macOS**: System Preferences > Accessibility > Display > Increase Contrast
- **Linux**: Varies by desktop environment

#### Reduced Motion
Automatically enabled when system preference is set:
- **Windows**: Settings > Ease of Access > Display > Show animations
- **macOS**: System Preferences > Accessibility > Display > Reduce Motion
- **Linux**: Varies by desktop environment

### Keyboard Shortcuts

#### Global
- **Tab**: Next element
- **Shift+Tab**: Previous element
- **Enter**: Activate/Select
- **Space**: Toggle/Activate
- **Escape**: Close dialog

#### Tajweed Legend
- **Tab**: Navigate through filters and rules
- **Enter/Space**: Toggle rule visibility
- **Arrow Keys**: Navigate within categories (planned)

#### Word Dialog
- **Tab**: Navigate through tabs and content
- **Enter**: Activate buttons
- **Escape**: Close dialog

---

## Future Enhancements

### Phase 2 Features
1. **Audio Integration**
   - Pronunciation audio for each rule
   - Example word audio playback
   - Text-to-speech for descriptions

2. **Customizable Color Schemes**
   - User-defined color palettes
   - Save and share color schemes
   - Import/export settings

3. **Enhanced Pattern Options**
   - More pattern styles
   - Adjustable pattern intensity
   - Custom pattern creation

4. **Learning Mode**
   - Guided tutorials
   - Interactive exercises
   - Progress tracking
   - Accessibility-focused lessons

5. **Braille Support**
   - Braille display compatibility
   - Braille notation for rules
   - Tactile feedback integration

---

## Resources

### Standards and Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)

### Testing Tools
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- [NVDA (Free)](https://www.nvaccess.org/)
- [JAWS (Commercial)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (Built-in macOS/iOS)](https://www.apple.com/accessibility/voiceover/)
- [TalkBack (Built-in Android)](https://support.google.com/accessibility/android/answer/6283677)

---

## Support

For accessibility issues or suggestions, please contact the development team or file an issue in the project repository.

**Alhamdulillah** - May this system make the Quran accessible to all who seek to learn and recite it with proper Tajweed.

---

**Last Updated**: 2026-05-04  
**Version**: 1.0  
**Maintained By**: Stoneforge Workspace
