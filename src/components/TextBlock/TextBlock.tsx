import { ReactElement, Ref, useState } from "react";
import Popover from "../Popover/Popover";
import "./TextBlock.css";
import { CustomMap, SpecialTextSegment, TextSegmentView } from "../../models/dto";
import { FootnoteAction, TextSegmentAction } from "../../models/actions";
import { v4 as uuid } from "uuid";

interface Props {
    text: string,
    textSegmentViewActions?: Array<TextSegmentAction>
    specialTextInfo?: CustomMap<SpecialTextSegment> | null
    footnoteActions?: Array<FootnoteAction>
}

const TextBlock = (props: Props) => {

    const [highlights, setHighlights] = useState<Set<string>>(new Set());
    console.info("Text being constructed: ", props.text);
    console.info("With Text Segment Actions: ", props.textSegmentViewActions);
    console.info("With Special Texts: ", props.specialTextInfo);
    console.info("With Footnotes: ", props.footnoteActions);

    const getChildren = (parentId?: string | null) : CustomMap<SpecialTextSegment> => {

        if (!parentId) {
            return {};
        }

        const children: CustomMap<SpecialTextSegment> = {};
        if (props.specialTextInfo) {
            Object.keys(props.specialTextInfo).forEach((key) => {
                const id = key;
                const spTextSegment = props.specialTextInfo!![id];
                if (spTextSegment.parent == parentId) {
                    children[id] = spTextSegment;
                }
            });
        }
        return children;
    }


    const closePopover = (id: string) => {
        if (highlights.has(id)) {
            const newHighlights = new Set(highlights);
            newHighlights.delete(id);
            setHighlights(newHighlights);
        }
    }

    const openPopover = (id: string, lexiInfo?: CustomMap<string>) => {
        if (lexiInfo) {
            const newHighlights = new Set(highlights);
            newHighlights.add(id);
            setHighlights(newHighlights);
        }
    }

    const isParentNode = (spTextSegment: SpecialTextSegment) : Boolean => {
        return spTextSegment.parent ===  null;
    }

    const getTextSegmentsWithinBoundaries = (textSegments: Array<TextSegmentAction>, sIndex: number, eIndex: number) : Array<TextSegmentAction> => {

        console.info("Text Segment before processing: ", textSegments);
        const ts = textSegments.filter((item) => {
            if (item.textSegmentView.startIndex && 
                    item.textSegmentView.endIndex &&
                    item.textSegmentView.endIndex !== -1 &&
                    item.textSegmentView.startIndex >= sIndex &&
                    item.textSegmentView.endIndex <= eIndex) {

                        return item;

                    }
        }) ?? [];

        console.info("Text Segment after processing: ", ts);
        return ts;
    }

    const modifyTextSegmentsWithBoundary = (textSegments: Array<TextSegmentAction>, boundary: number) : Array<TextSegmentAction> => {

        return textSegments
            .filter((item) => item.textSegmentView.startIndex && item.textSegmentView.endIndex && item.textSegmentView.endIndex != -1)
            .map((item) => {
                const modifiedStart = item.textSegmentView.startIndex!! - boundary;
                const modifiedEnd = item.textSegmentView.endIndex!! - boundary;
                const modifiedTextSegmentView: TextSegmentView = {
                    startIndex : modifiedStart,
                    endIndex : modifiedEnd,
                    lexicographyInfo : item.textSegmentView.lexicographyInfo
                };
                const modifiedTextSegmentAction: TextSegmentAction = {
                    onClick : item.onClick,
                    textSegmentView : modifiedTextSegmentView
                }
                return modifiedTextSegmentAction;

        });

    }

    const getCSSClassBySpecialTextType = (type: string) : string => {
        if (type === "word-of-jesus") {
            return "spt--wj";
        }
        if (type === "translator-addition") {
            return "spt--ta";
        }
        if (type === "transliterated") {
            return "spt--t";
        }
        return "";
    }

    const buildHoverableElement = (key: string, text: string, lexInfo?: CustomMap<string>) : ReactElement => {

        return (
            <span 
                className={ highlights.has(key) ? "text-block--highlight" : "text-block" }
                onMouseEnter={ () => openPopover(key, lexInfo) } 
                onMouseLeave={ () => closePopover(key) }>
                    <Popover 
                        show={ false } 
                        lexiInfo={ lexInfo } />
                    <span>{ text }</span>
            </span>
        );
    }

    const buildTextElementWithTextSegments = (text: string, textSegments: Array<TextSegmentAction>) : ReactElement => {
        console.info(`Building Text Element with Text Segment: => Text: [${text}], Text Segments: `, textSegments);
        let nextIndex = 0;
        if (textSegments.length === 0) {
            return <span>{ text }</span>;
        }
        const components: Array<ReactElement> = [];
        textSegments.forEach((item) => {
            if ((item.textSegmentView.startIndex ?? -1) >= 0 && (item.textSegmentView.endIndex ?? -1) >= 0) {
                const sIndex = item.textSegmentView.startIndex ?? -1;
                const eIndex = item.textSegmentView.endIndex ?? -1;
                const key = `${text}-${sIndex}-${eIndex}`;  
                if (sIndex === 0) {
                    const portion = text.substring(sIndex, eIndex + 1);
                    const textElement = buildHoverableElement(key, portion, item.textSegmentView.lexicographyInfo)
                    components.push(textElement);
                } else {
                    const portion1 = text.substring(nextIndex, sIndex);
                    const textElement1 = (<span>{ portion1 }</span>);
                    components.push(textElement1);

                    const portion2 = text.substring(sIndex, eIndex + 1);
                    const textElement2 = buildHoverableElement(key, portion2, item.textSegmentView.lexicographyInfo);
                    components.push(textElement2);
                }
                nextIndex = eIndex + 1;
            }
        });
        if (nextIndex < text.length) {
            const portion = text.substring(nextIndex);
            const textElement = (<span>{ portion }</span>);
            components.push(textElement);
        }
        return (<span>{ components }</span>);
    }

    const buildTextElement = (
        text: string, 
        spTextSegment: SpecialTextSegment, 
        id: string, 
        textSegments: Array<TextSegmentAction>) : ReactElement => {

        if (!spTextSegment.type) {
            throw new Error(`No type found for SpecialTextSegment: ${JSON.stringify(spTextSegment)}`);
        }

        const children = getChildren(id);
        const cssClass = getCSSClassBySpecialTextType(spTextSegment.type)
        
        if (Object.keys(children).length > 0) {
            const components: Array<ReactElement> = [];
            let nextIndex = 0;
            Object.keys(children).forEach((key) => {
                const c = children[key];
                if (c.startIndex && c.endIndex) {
                    if (c.startIndex === 0) {
                        const portion = text.substring(c.startIndex, c.endIndex + 1);
                        let tSegments = getTextSegmentsWithinBoundaries(textSegments, c.startIndex, c.endIndex);
                        tSegments = modifyTextSegmentsWithBoundary(tSegments, c.startIndex); 
                        const textElement = buildTextElement(portion, c, key, tSegments);
                        components.push(textElement);
                    } else {
                        const portion1 = text.substring(nextIndex, c.startIndex);
                        const portion2 = text.substring(c.startIndex, c.endIndex + 1);

                        let tSegments1 = getTextSegmentsWithinBoundaries(textSegments, nextIndex, c.startIndex);
                        tSegments1 = modifyTextSegmentsWithBoundary(tSegments1, nextIndex); 

                        let tSegments2 = getTextSegmentsWithinBoundaries(textSegments, c.startIndex, c.endIndex);
                        tSegments1 = modifyTextSegmentsWithBoundary(tSegments2, c.startIndex); 

                        const textElement1 = buildTextElementWithTextSegments(portion1, tSegments1);
                        const textElement2 = buildTextElement(portion2, c, key, tSegments2);
                        components.push(textElement1);
                        components.push(textElement2);
                    }
                    nextIndex = c.endIndex + 1
                }
            });
            if (nextIndex < text.length) {
                const portion = text.substring(nextIndex);
                let tSegments = getTextSegmentsWithinBoundaries(textSegments, nextIndex, text.length);
                tSegments = modifyTextSegmentsWithBoundary(tSegments, nextIndex); 
                const c = buildTextElementWithTextSegments(portion, tSegments);
                components.push(c);
            }
            return <span className={ cssClass }>{ components }</span>
        } else {
            let tSegments = getTextSegmentsWithinBoundaries(textSegments, 0, text.length);
            tSegments = modifyTextSegmentsWithBoundary(tSegments, 0); 
            const c = buildTextElementWithTextSegments(text, tSegments);
            return <span className={ cssClass }>{ c }</span>
        }
    }



    let content: Array<ReactElement> = [];
    let nextIndex = 0;
    if (props.specialTextInfo && Object.keys(props.specialTextInfo).length > 0) {
        Object.keys(props.specialTextInfo).forEach((key) => {
            const spTextId = key;
            const spTextSegment = props.specialTextInfo!![spTextId];
            console.info(`Processing SP ID: ${key}`);
            if (isParentNode(spTextSegment)) {
                const sIndex = spTextSegment.startIndex;
                const eIndex = spTextSegment.endIndex;
                if(sIndex && eIndex) {
                    if (sIndex === 0) {
                        const textPortion = props.text.substring(sIndex, eIndex + 1);
                        let textSegments = getTextSegmentsWithinBoundaries(props.textSegmentViewActions ?? [], sIndex, eIndex);
                        textSegments = modifyTextSegmentsWithBoundary(textSegments, sIndex);
                        const textElement = buildTextElement(textPortion, spTextSegment, spTextId, textSegments);
                        content.push(textElement);
                    } else {
                        const textPortion1 = props.text.substring(nextIndex, sIndex);
                        const textPortion2 = props.text.substring(sIndex, eIndex + 1);

                        let textSegments1 = getTextSegmentsWithinBoundaries(props.textSegmentViewActions ?? [], nextIndex, sIndex - 1);
                        textSegments1 = modifyTextSegmentsWithBoundary(textSegments1, nextIndex);

                        let textSegments2 = getTextSegmentsWithinBoundaries(props.textSegmentViewActions ?? [], sIndex, eIndex);
                        textSegments2 = modifyTextSegmentsWithBoundary(textSegments2, sIndex);

                        const textElement1 = buildTextElementWithTextSegments(textPortion1, textSegments1);
                        const textElement2 = buildTextElement(textPortion2, spTextSegment, spTextId, textSegments2);
                        content.push(textElement1);
                        content.push(textElement2);
                    }
                    nextIndex = eIndex + 1;
                }
            }    
        });
        if (nextIndex < props.text.length) {
            const portion = props.text.substring(nextIndex);
            let textSegments = getTextSegmentsWithinBoundaries(props.textSegmentViewActions ?? [], nextIndex, props.text.length);
            textSegments = modifyTextSegmentsWithBoundary(textSegments, nextIndex);
            const textElement = buildTextElementWithTextSegments(portion, textSegments);
            content.push(<span>{ textElement }</span>);
        }
    } else if (props.textSegmentViewActions && props.textSegmentViewActions.length > 0) {
        let nextIndex = 0;
        props.textSegmentViewActions.forEach((item) => {
            if ((item.textSegmentView.startIndex ?? -1) >= 0 && (item.textSegmentView.endIndex ?? -1) >= 0) {
                    console.info("Processing TSA: ", item);
                    const sIndex = item.textSegmentView.startIndex ?? -1;
                    const eIndex = item.textSegmentView.endIndex ?? -1;
                    if (sIndex === 0) {
                        const textPortion = props.text.substring(sIndex, eIndex + 1);
                        const textElement = buildTextElementWithTextSegments(textPortion, [item]);
                        content.push(textElement);
                    } else {
                        const textPortion1 = props.text.substring(nextIndex, sIndex);
                        const textPortion2 = props.text.substring(sIndex, eIndex + 1);

                        const textElement1 = (<span className="text-block">{ textPortion1 }</span>);
                        const modifiedItems = modifyTextSegmentsWithBoundary([item], sIndex);
                        const textElement2 = buildTextElementWithTextSegments(textPortion2, modifiedItems);
                        content.push(textElement1);
                        content.push(textElement2);
                    }
                    nextIndex = eIndex + 1;
            }
        });
        if (nextIndex < props.text.length) {
            content.push(<span className="text-block">{ props.text.substring(nextIndex) }</span>);
        }
    } else {
        content.push(<span className="text-block">{ props.text.substring(nextIndex) }</span>)
    }

    return (
        <span>
            { content }
        </span>
    );
}

export default TextBlock;