import { BookOverview, ChapterDetailedView, ChapterOverview, CrossRefView, CustomMap, FootnoteVerseReferenceView, FootnoteView, MarkerView, TextSegmentView, TranslationOverview, VerseDetailedView } from "../models/dto";
import { ChapterDetailedViewResponse, ChapterOverviewResponse, TranslationOverviewResponse, VerseDetailedViewResponse } from "../models/response";

export const toTranslationOverview = (response: TranslationOverviewResponse) : TranslationOverview => {
    const books = response.books ?? [];
    const bookOverviews: Array<BookOverview> = [];
    books.forEach((item) => {
        const name = item["name"] as string;
        const code = item["code"] as string;
        const totalChapters = item["total_chapters"] as number;
        const bookOverview: BookOverview = {
            name : name,
            code : code,
            totalChapters: totalChapters
        };
        bookOverviews.push(bookOverview);
    });
    const translationOverview: TranslationOverview = {
        name : response.name,
        shortName : response.short_name,
        code : response.code,
        language : response.language,
        textDirection : response.text_direction,
        licenseURL : response.license_url,
        webURL : response.web_url,
        totalBooks : response.total_books,
        lexInfoAvailable : response.lex_info_available,
        usfmAvailable : response.usfm_available,
        books : bookOverviews
    }
    return translationOverview;
}

export const toChapterOverview = (response: ChapterOverviewResponse) : ChapterOverview => {
    return {
        translationCode : response.translation_code,
        bookCode : response.book_code,
        chapterNum : response.chapter_num,
        totalVerses : response.total_verses
    }
}

export const toChapterDetailedView = (response: ChapterDetailedViewResponse) : ChapterDetailedView => {
    return {
        translationCode : response.translation_code,
        bookCode : response.book_code,
        bookName : response.book_name,
        chapterNum : response.chapter_num,
        verses : toVerseDetailedViewMap(response.verses),
        usfm : toUSFMMap(response.usfm),
        crossRefs : toCrossRefViews(response.cross_refs!!)
    };
}

export const toVerseDetailedView = (response: VerseDetailedViewResponse) : VerseDetailedView => {
    return toVerseDetailedViewInner(response);
}

const toVerseDetailedViewMap = (response: any) : CustomMap<VerseDetailedView> => {
    const map: CustomMap<VerseDetailedView> = {};
    Object.keys(response).forEach((key) => {
        const verseNum = key as string;
        const verseObject = response[key];
        const verseView = toVerseDetailedViewInner(verseObject);
        map[verseNum] = verseView;
    });
    return map;
}

const toUSFMMap = (response: any) : CustomMap<MarkerView> => {
    const map: CustomMap<MarkerView> = {};
    Object.keys(response).forEach((key) => {
        const usfmId = key as string;
        const usfmObject = response[key];
        const markerView = toMarkerView(usfmObject);
        map[usfmId] = markerView
    });
    return map;
}

const toCrossRefViews = (response: Array<any>) : Array<CrossRefView> => {
    const crossRefs: Array<CrossRefView> = [];
    response.forEach((item) => {
        crossRefs.push(toCrossRefView(item));
    });
    return crossRefs;
}

const toCrossRefView = (response: any) : CrossRefView => {
    const markerId = response["marker_id"] as number;
    const refBookCode = response["ref_book_code"] as string;
    const refChapterNum = response["ref_chapter_num"] as number;
    const refVerseStart = response["ref_verse_start"] as number;
    const refVerseEnd = response["ref_verse_end"] as number;
    return {
        markerId : markerId,
        refBookCode : refBookCode,
        refChapterNum : refChapterNum,
        refVerseStart : refVerseStart,
        refVerseEnd : refVerseEnd
    };
}


const toVerseDetailedViewInner = (verseObject: any) : VerseDetailedView => {
    const num = verseObject["num"] as number;
    const text = verseObject["text"] as string;
    const footnotesArr = verseObject["footnotes"] as Array<any>;
    const textSegmentArr = verseObject["text_segments"] as Array<any>;
    const footnoteViews: Array<FootnoteView> = [];
    const textSegmentViews: Array<TextSegmentView> = [];
    footnotesArr.forEach((item) => {
        const footnoteView = toFootnoteView(item);
        footnoteViews.push(footnoteView);
    });

    textSegmentArr.forEach((item) => {
        const textSegmentView = toTextSegmentView(item);
        textSegmentViews.push(textSegmentView);
    });

    return {
        num : num,
        text : text,
        footnotes : footnoteViews,
        textSegments : textSegmentViews
    };
}

const toMarkerView = (usfmObject: any) : MarkerView => {
    const syntax = usfmObject["syntax"] as string;
    const data = usfmObject["data"];
    const dataMap: CustomMap<string> = {};
    Object.keys(data).forEach((key) => {
        dataMap[key] = data[key] as string;
    });
    return {
        syntax : syntax,
        data : dataMap
    };
}

const toFootnoteView = (response: any) : FootnoteView => {
    const insertionAfter = response["insertion_after"] as number;
    const note = response["note"] as string;
    const footnoteVerseRefs = response["verse_refs"] as Array<any>;
    const footnoteVerseRefViews: Array<FootnoteVerseReferenceView> = [];
    footnoteVerseRefs.forEach((item) => {
        const footnoteVerseRefView = toFootnoteVerseReferenceView(item);
        footnoteVerseRefViews.push(footnoteVerseRefView);
    });
    return {
        insertionAfter : insertionAfter,
        note : note,
        verseRefs : footnoteVerseRefViews
    };
}

const toFootnoteVerseReferenceView = (response: any) : FootnoteVerseReferenceView => {
    const startIndex = response["start_index"] as number;
    const endIndex = response["end_index"] as number;
    const refBibleTranslationCode = response["ref_bible_translation_code"] as string;
    const refBookCode = response["ref_book_code"] as string;
    const refChapterNum = response["ref_chapter_num"] as number;
    const refVerseStart = response["ref_verse_start"] as number;
    const refVerseEnd = response["ref_verse_end"] as number;
    return {
        startIndex : startIndex,
        endIndex : endIndex,
        refBibleTranslationCode : refBibleTranslationCode,
        refBookCode : refBookCode,
        refChapterNum : refChapterNum,
        refVerseStart : refVerseStart,
        refVerseEnd : refVerseEnd
    }
}

const toTextSegmentView = (response: any) : TextSegmentView => {
    const startIndex = response["start_index"] as number;
    const endIndex = response["end_index"] as number;
    const lexInfoObject = response["lexicography_info"];
    const lexMap: CustomMap<string> = {};
    Object.keys(lexInfoObject).forEach((key) => {
        lexMap[key] = lexInfoObject[key] as string;
    });
    return {
        startIndex : startIndex,
        endIndex : endIndex,
        lexicographyInfo : lexMap
    };
}