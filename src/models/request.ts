export interface TranslationOverviewRequest {
    translationCode: string
}

export interface ChapterOverviewRequest {
    translationCode: string
    bookCode: string
    chapterNum: number
}

export interface ChapterDetailedViewRequest {
    translationCode: string
    bookCode: string
    chapterNum: number
}

export interface VerseDetailedViewRequest {
    translationCode: string
    bookCode: string
    chapterNum: number
    verseNum: number
}