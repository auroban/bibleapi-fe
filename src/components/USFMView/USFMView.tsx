import { ReactElement } from "react";
import { ChapterDetailedView, CrossRefView, CustomMap, VerseSegment } from "../../models/dto";
import "./USFMView.css";
import { Marker } from "../../constants/Marker";
import Paragraph from "../MarkerViews/Paragraph/Paragraph";
import Heading from "../MarkerViews/Heading/Heading";
import { CrossRefAction, FootnoteAction, TextSegmentAction } from "../../models/actions";
import CrossRef from "../MarkerViews/CrossReference/CrossRef";
import DescriptiveTitle from "../MarkerViews/DescriptiveTitle/DescriptiveTitle";
import { TextUtils } from "../../utils/TextUtils";
import { MarkerUtil } from "../../utils/MarkerUtils";
import EmbeddedTextOpening from "../MarkerViews/EmbeddedTextOpening/EmbeddedTextOpening";
import LineBreak from "../MarkerViews/LineBreak/LineBreak";
import Quote from "../MarkerViews/Quote/Quote";
import ListEntry from "../MarkerViews/ListEntry/ListEntry";
import CenteredParagraph from "../MarkerViews/CenteredParagraph/CenteredParagraph";
import HebrewNote from "../MarkerViews/HebrewNote/HebrewNote";
import QuoteRightAligned from "../MarkerViews/QuoteRightAligned/QuoteRightAligned";

interface Props {
    chapter: ChapterDetailedView
}

const USFMView = (props: Props) => {

    const finalContentList: Array<ReactElement> = [];

    const getCrossRefViews = (usfmId: number) : Array<CrossRefView> => {
        const crossRefView: Array<CrossRefView> = [];
        if (props.chapter.crossRefs && props.chapter.crossRefs.length > 0) {
            props.chapter.crossRefs.forEach((crv) => {
                if (crv.markerId === usfmId) {
                    crossRefView.push(crv);
                }
            });
        }
        return crossRefView;
    }

    const openRefWindow = (crossRefView: CrossRefView) => {
        console.info(`Received CF View: ${JSON.stringify(crossRefView)}`);
    }

    const onTextSegmentClick = (lexInfo: CustomMap<string>) => {
        
    }

    const constructView = (contents: Array<VerseSegment>, parentMarker: string) : ReactElement => {
        switch (parentMarker) {
            case Marker.PARAGRAPH: {
                return <Paragraph verseSegments={ contents } />;
            }
            case Marker.EMBEDDED_TEXT_OPENING: {
                return <EmbeddedTextOpening verseSegments={ contents } />;
            }
            case Marker.QUOTE:
            case Marker.QUOTE_1:
            case Marker.QUOTE_2:
            case Marker.QUOTE_3: {
                return <Quote syntax={ parentMarker } verseSegment={ contents[0] } />;
            }
            case Marker.LIST_ENTRY:
            case Marker.LIST_ENTRY_1:    
            case Marker.LIST_ENTRY_2:
            case Marker.LIST_ENTRY_3: {
                return <ListEntry syntax={ parentMarker } verseSegment={ contents[0] } />;
            }
            case Marker.CENTERED_PARAGRAPH: {
                return <CenteredParagraph verseSegment={ contents[0] } />;
            }
            default: {
                console.warn(`No view set up for parent marker: ${parentMarker}`);
                return <></>;
            }
        }
    }

    const getVerseSegment = (dataMap: CustomMap<string>) : VerseSegment => {
        const verseNum = dataMap["verse-num"] ?? null;
        const verseStartIndex = dataMap["start"] ?? null;
        const verseEndIndex = dataMap["end"] ?? null;
        if (!(verseNum && verseStartIndex && verseEndIndex)) {
            throw new Error("For Verse Segment to be created, all three keys, \'verse-num\', \'start\' and \'end\' should have values");
        }

        // Get text chunk
        const wholeVerse = MarkerUtil.getVerse(verseNum, props.chapter.verses!!);
        const textChunk = TextUtils.parseTextSegment(wholeVerse, Number.parseInt(verseStartIndex), Number.parseInt(verseEndIndex));
        const includeVerseNum = Number.parseInt(verseStartIndex) === 0;

        // Get TextSegments relative to the verse segment
        const textSegments = MarkerUtil.getTextSegmentsRelativeToVerseChunk(
            verseNum, 
            props.chapter.verses!!,
            Number.parseInt(verseStartIndex),
            Number.parseInt(verseEndIndex));
        const textSegmentActions: Array<TextSegmentAction> = textSegments.map((it) => {
            const action: TextSegmentAction = {
                textSegmentView : it,
                onClick: () => onTextSegmentClick(it.lexicographyInfo!!)
            };
            return action;
        });

        const specialTextSegments = MarkerUtil.getSpecialTextsRelativeToVerseChunk(
            verseNum,
            props.chapter.verses!!,
            Number.parseInt(verseStartIndex),
            Number.parseInt(verseEndIndex));

        const footnotes = MarkerUtil.getFootnotesRelativeToVerseChunk(
            verseNum, 
            props.chapter.verses!!,
            Number.parseInt(verseStartIndex),
            Number.parseInt(verseEndIndex));

        const footnoteActions = footnotes.map((it) => {
            const action: FootnoteAction = {
                footnote : it,
                onClick : () => { alert(`Footnote Clicked: ${JSON.stringify(it)}`) }
            }
            return action;
        });

        let vs: VerseSegment = {
            verseNum : includeVerseNum ? verseNum : null,
            text : textChunk,
            textSegmentActions : textSegmentActions,
            specialTextSegments : specialTextSegments,
            footnoteActions : footnoteActions,
        }
        return vs;
    }

    if (props.chapter.usfm) {
        let contents: Array<VerseSegment> = [];
        let parentMarker = Marker.PARAGRAPH;
        Object.keys(props.chapter.usfm).forEach((usfmId) => {
            const markerView = props.chapter.usfm!![usfmId];
            const markerData = markerView.data!!;
            const content = markerData["content"] ?? "";
            const verseNum = markerData["verse-num"] ?? ""
            switch (markerView.syntax) {
                case Marker.HEADER:
                case Marker.HEADER_1:
                case Marker.HEADER_2: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    const heading = <Heading text={ content } />
                    finalContentList.push(heading);
                    break;
                }
                case Marker.CROSS_REF: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    const crossRefs = getCrossRefViews(Number.parseInt(usfmId));
                    const crossRefTextCompoents = content.replaceAll("(", "").replaceAll(")", "").split(";");
                    const crossRefActions: Array<CrossRefAction> = [];
                    crossRefTextCompoents.forEach((crtc, index) => {
                        if (crtc && crtc.length > 0) {
                            const action: CrossRefAction = {
                                text : crtc,
                                onClick : () => openRefWindow(crossRefs[index])
                            }
                            crossRefActions.push(action);
                        }
                    });
                    const cr = <CrossRef actions={ crossRefActions } />
                    finalContentList.push(cr);
                    break;
                }
                case Marker.DESCRIPTIVE_TITLE: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    const dt = <DescriptiveTitle text={ content } />
                    finalContentList.push(dt);
                    break;
                }
                case Marker.BREAK: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    finalContentList.push(<LineBreak />);
                    break;
                }
                case Marker.PARAGRAPH: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    parentMarker = markerView.syntax;
                    if (!TextUtils.isNullOrBlank(verseNum)) {
                        contents.push(getVerseSegment(markerData));
                    }
                    break;
                }
                case Marker.CONTINUATION_PARAGRAPGH: {
                    parentMarker = Marker.PARAGRAPH;
                    if (!TextUtils.isNullOrBlank(verseNum)) {
                        contents.push(getVerseSegment(markerData));
                    }
                    break;
                }
                case Marker.VERSE: {
                    if (!TextUtils.isNullOrBlank(verseNum)) {
                        contents.push(getVerseSegment(markerData));
                    }
                    break;
                }
                case Marker.EMBEDDED_TEXT_OPENING: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    parentMarker = Marker.EMBEDDED_TEXT_OPENING;
                    if (!TextUtils.isNullOrBlank(verseNum)) {
                        contents.push(getVerseSegment(markerData));
                    }
                    break;
                }
                case Marker.QUOTE:
                case Marker.QUOTE_1: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    parentMarker = markerView.syntax;
                    if (!TextUtils.isNullOrBlank(verseNum)) {
                        const vs = getVerseSegment(markerData);
                        finalContentList.push(constructView([vs], parentMarker));
                    }
                    break;
                }
                case Marker.QUOTE_2:
                case Marker.QUOTE_3: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    parentMarker = markerView.syntax;
                    if (!TextUtils.isNullOrBlank(verseNum)) {
                        const vs = getVerseSegment(markerData);
                        finalContentList.push(constructView([vs], parentMarker));
                    }
                    break;
                }
                case Marker.LIST_ENTRY:
                case Marker.LIST_ENTRY_1:
                case Marker.LIST_ENTRY_2:
                case Marker.LIST_ENTRY_3: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    parentMarker = markerView.syntax
                    if (!TextUtils.isNullOrBlank(verseNum)) {
                        const vs = getVerseSegment(markerData);
                        const view = constructView([vs], parentMarker);
                        finalContentList.push(view)
                    }
                    break;
                }
                case Marker.CENTERED_PARAGRAPH: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    parentMarker = markerView.syntax;
                    if (!TextUtils.isNullOrBlank(verseNum)) {
                        const vs = getVerseSegment(markerData);
                        const view = constructView([vs], parentMarker);
                        finalContentList.push(view)
                    }
                    break;
                }
                case Marker.HEBREW_NOTE: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    const vs = getVerseSegment(markerData);
                    finalContentList.push(<HebrewNote verseSegment={ vs } />);
                    break;
                }
                case Marker.QUOTE_RIGHT_ALIGNED: {
                    if (contents.length > 0) {
                        const view = constructView(contents, parentMarker);
                        finalContentList.push(view);
                        contents = [];
                    }
                    const vs = getVerseSegment(markerData);
                    finalContentList.push(<QuoteRightAligned verseSegment={ vs } />);
                    break;
                }
                default: {
                    console.warn(`No Marker defined for: ${markerView.syntax}`);
                }
            }
        });
        if (contents.length > 0) {
            const view = constructView(contents, parentMarker);
            finalContentList.push(view);
            contents = [];
        } 
    }

    return (
        <div className="container-fluid usfm-view">
            { finalContentList }
        </div>
    );
};

export default USFMView;
