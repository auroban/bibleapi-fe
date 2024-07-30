import { CustomMap, TextSegmentView, VerseDetailedView } from "../models/dto";

const getVerse = (num: string, verseMap: CustomMap<VerseDetailedView>) : string => {
    const vdv = verseMap[num] ?? null;
    if (!vdv) {
        return "";
    }
    return vdv.text ?? "";

}

const getTextSegments = (num: string, verseMap: CustomMap<VerseDetailedView>, start: number, end: number) : Array<TextSegmentView> => {
    const vdv = verseMap[num] ?? null;
    if (!vdv || !vdv.textSegments) {
        return [];
    }
    const textSegmentViews = vdv.textSegments;
    const ts: Array<TextSegmentView> = [];
    textSegmentViews.forEach((tsv) => {
        const tsStart = tsv.startIndex ?? -1;
        const tsEnd = tsv.endIndex ?? -1;
        if (tsStart >= start && tsEnd <= end) {
            ts.push(tsv);
        }
    });
    return ts;
}

export const MarkerUtil = {
    getVerse : getVerse,
    getTextSegments : getTextSegments,
}