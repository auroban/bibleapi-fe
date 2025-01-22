import { FootnoteAction, TextSegmentAction } from "./actions"

export interface CustomMap<T> {
    [key: string] : T
}

export interface BookOverview {
    name?: string,
    code?: string,
    totalChapters?: number
}

export interface TranslationOverview {
    name?: string
    shortName?: string,
    code?: string
    language?: string
    textDirection?: string
    licenseURL?: string
    webURL?: string
    totalBooks?: number
    lexInfoAvailable?: boolean
    usfmAvailable?: boolean
    books?: Array<BookOverview>
    audioAvailable?: boolean
}

export interface ChapterOverview {
    translationCode?: string
    bookCode?: string
    chapterNum?: number
    totalVerses?: number
    audioAvailable?: boolean
}

export interface ChapterDetailedView {
    translationCode?: string
    bookName?: string
    bookCode?: string
    chapterNum?: number
    verses?: CustomMap<VerseDetailedView> | null
    usfm?: CustomMap<MarkerView> | null
    crossRefs?: Array<CrossRefView>
    audioTimestamps?: AudioTimestampsView | null
}

export interface AudioTimestampsView {
    timestamps?: Array<number>
}

export interface CrossRefView {
    markerId?: number
    refBookCode?: string
    refChapterNum?: number
    refVerseStart?: number
    refVerseEnd?: number
}

export interface MarkerView {
    syntax?: string
    data?: CustomMap<string>
}

export interface VerseDetailedView {
    num?: number
    text?: string
    footnotes?: Array<FootnoteView>
    textSegments?: Array<TextSegmentView>
    specialTextSegments?: CustomMap<SpecialTextSegment> | null
}

export interface FootnoteView {
    insertionAfter?: number
    note?: string
    verseRefs?: Array<FootnoteVerseReferenceView>
}

export interface FootnoteVerseReferenceView {
    startIndex?: number
    endIndex?: number
    refBibleTranslationCode?: string
    refBookCode?: string
    refChapterNum?: number
    refVerseStart?: number
    refVerseEnd?: number
}

export interface TextSegmentView {
    startIndex?: number
    endIndex?: number
    lexicographyInfo?: CustomMap<string>
}

/**
 * @template {VerseSegment}
 * Interface to represent portion of a verse displayed in a USFM marker
 * This also contains Text Segments, Special Text Segments and Footnotes
 * for that particular portion of the verse.
 */

export interface VerseSegment {
    verseNum: string | null
    text: string
    textSegmentActions: Array<TextSegmentAction>
    footnoteActions?: Array<FootnoteAction>
    specialTextSegments?: CustomMap<SpecialTextSegment> | null
}

export interface SpecialTextSegment {
    parent?: string | null
    startIndex?: number,
    endIndex?: number,
    type?: string
}