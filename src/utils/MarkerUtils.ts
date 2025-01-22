import { createElement, ReactElement } from "react";
import { text } from "stream/consumers";
import { CustomMap, FootnoteView, SpecialTextSegment, TextSegmentView, VerseDetailedView, VerseSegment } from "../models/dto";
import TextBlock from "../components/TextBlock/TextBlock";
import { TextUtils } from "./TextUtils";
import { FootnoteAction } from "../models/actions";

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

const getSpecialTextsRelativeToVerseChunk = (
    num: string,
    verseMap: CustomMap<VerseDetailedView>,
    chunkStart: number,
    chunkEnd: number
) : CustomMap<SpecialTextSegment> | null => {


    const vdv = verseMap[num] ?? null;
    if (!vdv || !vdv.specialTextSegments) {
        return null;
    }

    const specialTextSegments1 = vdv.specialTextSegments!!;
    const specialTextSegments2: CustomMap<SpecialTextSegment> = {};

    Object.keys(specialTextSegments1).forEach((key) => {

        const spTextId = key;
        const spTextSegment = specialTextSegments1[spTextId];

        if (isAParentNode(spTextSegment) &&
            spTextSegment.startIndex && spTextSegment.endIndex) {

            const sIndex = spTextSegment.startIndex;
            const eIndex = spTextSegment.endIndex;

            if (sIndex >= chunkStart && eIndex <= chunkEnd) {

                specialTextSegments2[spTextId] = spTextSegment;
                const children = getChildren(spTextId, specialTextSegments1);

                Object.keys(children).forEach((i) => {
                    const item = children[i];
                    specialTextSegments2[i] = item;
                });
            }
        }
    });
    return specialTextSegments2;
}

const isAParentNode = (spText: SpecialTextSegment) => {
    return spText.parent === null;
}

const getChildren = (parentId: string, spMap: CustomMap<SpecialTextSegment>) : CustomMap<SpecialTextSegment> => {

    const children: CustomMap<SpecialTextSegment> = {};
    const idsToProcess: Array<string> = [parentId];
    const idsToFetch: Array<string> = [];

    while(idsToProcess.length > 0) {
        const id = idsToProcess.pop() as string;
        const childIds = getChildIDs(id, spMap);
        childIds.forEach((i) => {
            idsToProcess.push(i);
            idsToFetch.push(i);
        });
    }

    idsToFetch.forEach((id) => {
        const seg = spMap[id];
        children[id] = seg;
    });
    return children;

}

const getChildIDs = (parentId: string, spMap: CustomMap<SpecialTextSegment>) : Array<string> => {

    const childIds: Array<string> = [];
    Object.keys(spMap).forEach((key) => {
        const seg = spMap[key];
        if (seg.parent == parentId) {
            childIds.push(key);
        }
    });
    return childIds;
}

// const getAllChildNodes = (spTextMap: CustomMap<SpecialTextSegment>, parentId: string) : Array<SpecialTextSegment> => {
//     const arr: Array<SpecialTextSegment> = [];
//     Object.keys(spTextMap).forEach((k) => {
//         const spText = spTextMap[k] as SpecialTextSegment;
//         if (spText)
//     });

//     return arr;
// }

const getFootnoteActionsWithinRange = (
    footnoteActions: Array<FootnoteAction>,
    start: number,
    end: number
) : Array<FootnoteAction> => {
    return footnoteActions.filter((it) => {
        if ((it.footnote.insertionAfter!! >= start) &&
            (it.footnote.insertionAfter!! <= end)) {
                return it;
            }
    });
}

const getFootnotesRelativeToVerseChunk = (
    num: string,
    verseMap: CustomMap<VerseDetailedView>,
    chunkStart: number,
    chunkEnd: number) : 
    Array<FootnoteView> => {

        const vdv = verseMap[num] ?? null;
        if (!vdv || !vdv.footnotes || (vdv.footnotes.length === 0)) {
            return [];
        }

        const footnotes1 = vdv.footnotes!!;
        const footnotes2: Array<FootnoteView> = [];
        footnotes1.forEach((item) => {
            const insertionAfterPoint = item.insertionAfter;
            if (!insertionAfterPoint) {
                throw new Error("No insertion after point found");
            }
            if (insertionAfterPoint >= chunkStart && insertionAfterPoint <= chunkEnd) {
                const modifiedInsertionAfterPoint = insertionAfterPoint - chunkStart
                const modifiedFootnote: FootnoteView = {
                    insertionAfter : modifiedInsertionAfterPoint,
                    note : item.note,
                    verseRefs : item.verseRefs
                }
                footnotes2.push(modifiedFootnote);
            }
        });
        return footnotes2;
}

// const constructTextBlocks = (vs: VerseSegment) : Array<ReactElement> => {
//     console.debug(`Received Verse Segment: ${JSON.stringify(vs)}`);
//     const tsvActions = vs.textSegmentActions ?? [];
//     const blocks: Array<ReactElement> = [];
//     console.info("Received VerseSegment: ", vs);
//     let nextIndex = -1;
//     tsvActions.forEach((it) => {
//         console.debug(`Current Index: ${nextIndex}`);
//         if (nextIndex < 0) {
//             if (it.textSegmentView.startIndex !== 0) {
//                 const verseChunk1 = vs.text.substring(nextIndex, it.textSegmentView.startIndex!!);    
//                 const verseChunk2 = vs.text.substring(it.textSegmentView.startIndex!!, it.textSegmentView.endIndex!! + 1);

//                 const footnoteActions1 = getFootnoteActionsWithinRange(vs.footnoteActions!!, nextIndex, it.textSegmentView.startIndex!!);
//                 const footnoteActions2 = getFootnoteActionsWithinRange(vs.footnoteActions!!, it.textSegmentView.startIndex!!, it.textSegmentView.endIndex!!);

//                 console.info(`1A: FootnoteActions1: ${JSON.stringify(footnoteActions1)}`);
//                 console.info(`1A: FootnoteActions2: ${JSON.stringify(footnoteActions2)}`);

//                 const textBlock1 = createElement(TextBlock, { "text" : verseChunk1, "footnoteActions" : footnoteActions1 });
//                 const textBlock2 = createElement(TextBlock, { "text" : verseChunk2, "footnoteActions" : footnoteActions2, "highlight" : true, "lexiInfo" : it.textSegmentView.lexicographyInfo });
//                 blocks.push(textBlock1);
//                 blocks.push(textBlock2);
//             } else {
//                 const verseChunk = vs.text.substring(it.textSegmentView.startIndex!!, it.textSegmentView.endIndex!! + 1);
//                 const footnoteActions = getFootnoteActionsWithinRange(vs.footnoteActions!!, it.textSegmentView.startIndex!!, it.textSegmentView.endIndex!!);
//                 console.info(`1B: FootnoteActions: ${JSON.stringify(footnoteActions)}`);
//                 const textBlock = createElement(TextBlock, { "text" : verseChunk, "footnoteActions" : footnoteActions, "highlight" : true });
//                 blocks.push(textBlock);
//             }
//         } else if ((it.textSegmentView.endIndex ?? -1) !== -1) {
//             const verseChunk1 = vs.text.substring(nextIndex, it.textSegmentView.startIndex!!);
//             const verseChunk2 = vs.text.substring(it.textSegmentView.startIndex!!, it.textSegmentView.endIndex!! + 1);

//             const footnoteActions1 = getFootnoteActionsWithinRange(vs.footnoteActions!!, nextIndex, it.textSegmentView.startIndex!!);
//             const footnoteActions2 = getFootnoteActionsWithinRange(vs.footnoteActions!!, it.textSegmentView.startIndex!!, it.textSegmentView.endIndex!!);

//             console.info(`2A: FootnoteActions1: ${JSON.stringify(footnoteActions1)}`);
//             console.info(`2A: FootnoteActions2: ${JSON.stringify(footnoteActions2)}`);

//             const textBlock1 = createElement(TextBlock, { "text" : verseChunk1, "footnoteActions" : footnoteActions1 });
//             const textBlock2 = createElement(TextBlock, { "text" : verseChunk2, "footnoteActions" : footnoteActions2, "highlight" : true, "lexiInfo" : it.textSegmentView.lexicographyInfo });
//             blocks.push(textBlock1);
//             blocks.push(textBlock2);
//         }
//         if ((it.textSegmentView.endIndex ?? -1) !== -1) {
//             nextIndex = it.textSegmentView.endIndex!! + 1;
//         }
//     });

//     if (nextIndex !== -1 && nextIndex < vs.text.length - 1) {
//         const verseChunk = vs.text.substring(nextIndex, vs.text.length);
//         const footnoteActions = getFootnoteActionsWithinRange(vs.footnoteActions!!, nextIndex, vs.text.length)
//         console.info(`3A: FootnoteActions: ${JSON.stringify(footnoteActions)}`);
//         if (!TextUtils.isNullOrEmpty(verseChunk)) {
//             const textBlock = createElement(TextBlock, { "text" : verseChunk, "footnoteActions" : footnoteActions });
//             blocks.push(textBlock);
//         }
//     }

//     return blocks;
// }


const constructTextBlocks = (vs: VerseSegment) : Array<ReactElement> => {
    const blocks: Array<ReactElement> = [];
    const textBlock = createElement(
        TextBlock, 
        { 
            "text" : vs.text, 
            "textSegmentViewActions" : vs.textSegmentActions,
            "specialTextInfo" : vs.specialTextSegments,
            "footnoteActions" : vs.footnoteActions
         });
    blocks.push(textBlock);
    return blocks;
}

const getTextBlocksStartingWithSpecialTexts = (vs: VerseSegment) : Array<ReactElement> => {
    console.debug("Constructing TextBlocks with SpecialTexts");
    const blocks: Array<ReactElement> = [];
    const specialTextSegmentMap = vs.specialTextSegments
    if (specialTextSegmentMap) {
        Object.keys(specialTextSegmentMap).forEach((key) => {

            const spTextSegId = key;
            const spTextSeg = specialTextSegmentMap[key];

            // Find out if the current item is a parent node.
            // If yes, only then proceed
            if (isAParentNode(spTextSeg)) {
                
            }
        })
    }
    return blocks;
}

const getTextBlocksStartingWithTextSegments = (vs: VerseSegment) : Array<ReactElement> => {
    console.debug("Constructing TextBlocks with TextSegments");
    const blocks: Array<ReactElement> = [];
    return blocks;
}

export const MarkerUtil = {
    getVerse : getVerse,
    getTextSegmentsRelativeToVerseChunk : getTextSegmentsRelativeToVerseChunk,
    getSpecialTextsRelativeToVerseChunk : getSpecialTextsRelativeToVerseChunk,
    getFootnotesRelativeToVerseChunk : getFootnotesRelativeToVerseChunk,
    constructTextBlocks : constructTextBlocks,
}