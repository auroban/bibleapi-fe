export interface Error {
    code?: string
    message?: string
}

export interface ApiResponse<T> {
    status?: string
    data?: T
    error?: Error
}

export interface TranslationOverviewResponse {
    name?: string
    short_name?: string,
    code?: string
    language?: string
    text_direction?: string
    license_url?: string
    web_url?: string
    total_books?: number
    lex_info_available?: boolean
    usfm_available?: boolean
    books?: Array<any>
    audio_available?: boolean
}

export interface ChapterDetailedViewResponse {
    translation_code?: string
    book_name?: string
    book_code?: string
    chapter_num?: number
    verses?: any
    usfm?: any
    cross_refs?: Array<any>
    audio_timestamps?: AudioTimestampsResponse | null
}

export interface AudioTimestampsResponse {
    timestamps?: Array<number>
}

export interface ChapterOverviewResponse {
    translation_code?: string
    book_code?: string
    chapter_num?: number
    total_verses?: number
    audio_available?: boolean
}

export interface VerseDetailedViewResponse {
    num?: number
    text?: string
    footnotes?: Array<any>
    text_segments?: Array<any>
    special_text_segments?: any
}