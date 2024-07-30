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
}

export interface ChapterOverview {
    translationCode?: string
    bookCode?: string
    chapterNum?: number
    totalVerses?: number
}

export interface ChapterDetailedView {
    translationCode?: string
    bookName?: string
    bookCode?: string
    chapterNum?: number
    verses?: CustomMap<VerseDetailedView> | null
    usfm?: CustomMap<MarkerView> | null
    crossRefs?: Array<CrossRefView>
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

export interface VerseSegment {
    verseNum: string | null,
    text: string
}