import { createElement, ReactElement } from "react";
import { CrossRefView, MarkerView } from "../models/dto";

const prepareHeader = (markerView: MarkerView, contentList: Array<ReactElement>) => {
    const content = markerView.data ? markerView.data['content'] : "";
    const c = createElement("label", { className : "uv__header" }, content);
    contentList.push(c);
}

const prepareCrossRef = (
    markerView: MarkerView, 
    contentList: Array<ReactElement>,
    crossRefs: Array<CrossRefView>,
) => {
    let content = markerView.data ? markerView.data['content'] : "";
    content = content.replace("(", "").replace(")", "");
    const components = content.split(";");
    const list: Array<ReactElement> = [];
    list.push(createElement("label",{ className: "uv__cf" }, "("));
    for (let i = 0; i < components.length; i++) {
        const text = components[i];
        let cf: CrossRefView | null = null;
        if (i < crossRefs.length) {
            cf = crossRefs[i];
        }

        let link: ReactElement | null = null;
        if(cf) {
            link = createElement(
                "label",
                {
                    className: "uv__cf",
                    href: "",
                    onClick: () => null
                },
                text
            );
        } else {
            link = createElement(
                "label",
                {
                    className: "uv__cf",
                    href: "",
                },
                text
            );
        }
        list.push(link);
        if(i < components.length - 1) {
            const seperator = createElement("label",{ className: "uv__cf" }, ";");
            list.push(seperator);
        }
    }
    list.push(createElement("label",{ className: "uv__cf" }, ")"));
    const final = createElement("div", {}, list);
    contentList.push(final);
}

const prepareDescriptiveTitle = (marker: MarkerView, contentList: Array<ReactElement>) => {
    const content = marker.data ? marker.data['content'] : "";
    const inner = createElement("p", { className : "uv__dt--inner" }, content);
    const outer = createElement("div", { className : "uv__dt--outer" }, inner);
    contentList.push(outer)
}

const prepareVerse = (
    currentBlock: Array<ReactElement>, 
    verseNum: number,
    text: string) => {
    
    console.info("Verse-Num: ", verseNum);
    console.info("Text: ", text);
    const num = createElement("label", { className : "uv__v--n" }, verseNum);
    const vText = createElement("p", { className : "uv__v--t" }, text);

    const list: Array<ReactElement> = [num, vText];
    const final = createElement("div", { className : "uv__v--f" }, list);
    currentBlock.push(final);
        
}

export const MarkerHelper = {
    prepareHeader : prepareHeader,
    prepareCrossRef : prepareCrossRef,
    prepareDescriptiveTitle : prepareDescriptiveTitle,
    prepareVerse : prepareVerse,
}