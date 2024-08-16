import { createElement, ReactElement } from "react";
import { text } from "stream/consumers";
import { CustomMap, TextSegmentView, VerseDetailedView, VerseSegment } from "../models/dto";
import TextBlock from "../components/TextBlock/TextBlock";
import { TextUtils } from "./TextUtils";

const getVerse = (num: string, verseMap: CustomMap<VerseDetailedView>) : string => {
    const vdv = verseMap[num] ?? null;
    if (!vdv) {
        return "";
    }
    return vdv.text ?? "";

}

const getTextSegmentsRelativeToVerseChunk = (
    num: string, 
    verseMap: CustomMap<VerseDetailedView>, 
    chunkStart: number, 
    chunkEnd: number
) : Array<TextSegmentView> => {
    const vdv = verseMap[num] ?? null;
    if (!vdv || !vdv.textSegments) {
        return [];
    }
    const textSegmentViews = vdv.textSegments;
    const ts: Array<TextSegmentView> = [];
    textSegmentViews.forEach((tsv) => {
        const tsStart = tsv.startIndex ?? -1;
        const tsEnd = tsv.endIndex ?? -1;
        if (tsStart >= chunkStart && tsEnd <= chunkEnd && tsEnd !== -1) {
            const localStartIndex = tsStart - chunkStart;
            const localEndIndex = localStartIndex + (tsEnd - tsStart);
            const localTSV: TextSegmentView = {
                startIndex : localStartIndex,
                endIndex : localEndIndex,
                lexicographyInfo : tsv.lexicographyInfo
            }
            ts.push(localTSV);
        }
    });
    return ts;
}

const constructTextBlocks = (vs: VerseSegment) : Array<ReactElement> => {
    console.debug(`Received Verse Segment: ${JSON.stringify(vs)}`);
    const tsvActions = vs.textSegmentActions ?? [];
    const blocks: Array<ReactElement> = [];
    let nextIndex = -1;
    tsvActions.forEach((it) => {
        console.debug(`Current Index: ${nextIndex}`);
        if (nextIndex < 0) {
            const verseChunk = vs.text.substring(it.textSegmentView.startIndex!!, it.textSegmentView.endIndex!! + 1);
            const textBlock = createElement(TextBlock, { "text" : verseChunk, "onClick" : it.onClick, "highlight" : true });
            blocks.push(textBlock);
        } else if ((it.textSegmentView.endIndex ?? -1) !== -1) {
            const verseChunk1 = vs.text.substring(nextIndex, it.textSegmentView.startIndex!!);
            const verseChunk2 = vs.text.substring(it.textSegmentView.startIndex!!, it.textSegmentView.endIndex!! + 1);
            const textBlock1 = createElement(TextBlock, { "text" : verseChunk1 });
            const textBlock2 = createElement(TextBlock, { "text" : verseChunk2, "onClick" : it.onClick, "highlight" : true });
            blocks.push(textBlock1);
            blocks.push(textBlock2);
        }
        if ((it.textSegmentView.endIndex ?? -1) !== -1) {
            nextIndex = it.textSegmentView.endIndex!! + 1;
        }
    });

    if (nextIndex !== -1 && nextIndex < vs.text.length - 1) {
        const verseChunk = vs.text.substring(nextIndex, vs.text.length);
        if (!TextUtils.isNullOrEmpty(verseChunk)) {
            const textBlock = createElement(TextBlock, { "text" : verseChunk });
            blocks.push(textBlock);
        }
    }

    return blocks;
}

export const MarkerUtil = {
    getVerse : getVerse,
    getTextSegmentsRelativeToVerseChunk : getTextSegmentsRelativeToVerseChunk,
    constructTextBlocks : constructTextBlocks,
}