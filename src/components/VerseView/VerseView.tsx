import { useParams } from "react-router-dom";
import "./VerseView.css";
import { BookOverview, ChapterDetailedView, TextSegmentView, VerseDetailedView, VerseSegment } from "../../models/dto";
import { ReactElement, useEffect, useState } from "react";
import BibleApi from "../../helpers/BibleApi";
import { ChapterDetailedViewRequest } from "../../models/request";
import Dropdown from "../Dropdown/Dropdown";
import { MarkerUtil } from "../../utils/MarkerUtils";
import { TextSegmentAction } from "../../models/actions";

interface State {
    allChapters: Array<ChapterDetailedView>
    currentChapter: ChapterDetailedView | null
    bookOverview: BookOverview | null
    totalVerses: number
    currentVerse: VerseDetailedView | null
}

const VerseView = () => {

    const { tCode } = useParams();
    const { bCode } = useParams();

    const initState: State = {
        allChapters : [],
        currentChapter : null,
        bookOverview : null,
        totalVerses : -1,
        currentVerse : null
    }

    const [state, setState] = useState<State>(initState);

    const getBookOverview = async () : Promise<BookOverview | null> => {
        const translationOverview = await BibleApi.getInstance().getTranslationOverview({ translationCode : tCode ?? "" });
        if (translationOverview.books) {
            return translationOverview.books.find((b) => b.code === bCode) ?? null;
        }
        return null;
    }


    useEffect(() => {
        fetchAndUpdate();
    }, []);

    const fetchAndUpdate = async () => {

        const bookOverview = await getBookOverview();
        const allChapters: Array<ChapterDetailedView> = [];
        const totalChapters = bookOverview?.totalChapters ?? 0;
        for(let i = 1; i <= totalChapters; i++) {
            const request: ChapterDetailedViewRequest = {
                translationCode : tCode ?? "",
                bookCode : bCode ?? "",
                chapterNum : i
            }
            const chapterDetailedView = await BibleApi.getInstance().getChapterDetailedView(request);
            allChapters.push(chapterDetailedView);
        }
        setState(prevState => ({
            ...prevState,
            allChapters : allChapters,
            bookOverview : bookOverview
        }));
    }

    const createRangeList = (high: number) : Array<string> => {
        const arr: string[] = [];
        for (let i = 1; i <= high; i++) {
            arr.push(i.toString())
        }
        return arr
    }

    const onChapterSelect = (index: number) => {
        let chapter: ChapterDetailedView | null = null;
        for (let i = 0; i < state.allChapters.length; i++) {
            if (state.allChapters[i].chapterNum === index) {
                chapter = state.allChapters[i];
                break;
            }
        }
        if (chapter) {
            const totalVerses = chapter.verses ? Object.keys(chapter.verses).length : -1;
            setState(prevState => ({
                ...prevState,
                currentChapter : chapter,
                totalVerses : totalVerses,
                currentVerse : null
            }));
        }
    }

    const onVerseSelect = (verseNum: number) => {
        if (state.currentChapter && state.currentChapter.verses && state.totalVerses > 0) {
            const currentVerse = state.currentChapter.verses[verseNum];
            setState(prevState => ({
                ...prevState,
                currentVerse : currentVerse
            }));
        }
    }

    const onTextSegmentViewClick = (tv: TextSegmentView) => {

    }

    const buildWithTextBlocks = (vs: VerseSegment) : ReactElement => {

        const blocks = MarkerUtil.constructTextBlocks(vs);
        return <span className="mc-vr-t">{ blocks }</span>;
    }

    const buildWithoutTextBlocks = (vs: VerseSegment) : ReactElement => {
        return <span className="mc-vr-t">{ vs.text }</span>;
    }


    let content: ReactElement = <></>;

    if (state.currentVerse) {
        let inner: ReactElement = <></>;

        if (state.currentVerse.textSegments && state.currentVerse.textSegments.length > 0) {
            const textSegmentActions: Array<TextSegmentAction> = state.currentVerse.textSegments.map((tv) => {
                return {
                    textSegmentView : tv,
                    onClick : () => onTextSegmentViewClick(tv)
                }
            });
            const verseSegment: VerseSegment = {
                verseNum : `${state.currentVerse.num}`,
                text : state.currentVerse.text ?? "",
                textSegmentActions : textSegmentActions
            }
            inner = buildWithTextBlocks(verseSegment);
        } else {
            inner = <span className="mc-vr-t">{ state.currentVerse.text }</span>;
        }

        content = (
            <div className="container-fluid verse-view--inner--vr">
                <label className="mc-vr-n">{ state.currentVerse.num }</label>
                { inner }
            </div>
        );
    }

    return (
        <div className="container-fluid verse-view">
            <div className="container-fluid verse-view--head">
                <h4>Translation Code: { tCode }</h4>
                <h4>Book Name: { state.bookOverview?.name }</h4>
            </div>
            <div className="container-fluid verse-view--dd">
                <div className="container-fluid">
                    <Dropdown 
                        options={ createRangeList(state.bookOverview?.totalChapters ?? 0) }
                        title="Select a chapter"
                        onSelect={ (i) => onChapterSelect(i+1) } />
                </div>
                <div className="container-fluid">
                    <Dropdown 
                        options={ createRangeList(state.totalVerses ?? 0) }
                        title="Select a Verse"
                        onSelect={ (i) => onVerseSelect(i+1) } />
                </div>
            </div>
            <div>
                { content }
            </div>
        </div>
    );
}

export default VerseView;