import { useParams } from "react-router-dom";
import "./VerseView.css";
import { BookOverview, ChapterDetailedView, TextSegmentView, VerseDetailedView, VerseSegment } from "../../models/dto";
import { ReactElement, useEffect, useRef, useState } from "react";
import BibleApi from "../../helpers/BibleApi";
import { ChapterDetailedViewRequest } from "../../models/request";
import Dropdown from "../Dropdown/Dropdown";
import { MarkerUtil } from "../../utils/MarkerUtils";
import { TextSegmentAction } from "../../models/actions";
import { ResourceURL } from "../../constants/ResourceURL";

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

    const verseMapper = [ 
        5.16,
        4,
        9.8,
        4.6,
        5.52,
        8.36,
        7.16,
        7.2,
        6.56,
        8.68,
        8.8,
        11.4,
        11.32,
        4.48,
        10.76,
        6.64,
        9.08,
        4.04,
        8.24,
        3.88,
        8.36,
        13.2,
        9.08,
        4.04,
        11.64,
        12.56,
        14.04,
        8.6,
        11.96,
        11,
        12.68
    ]

    const audioRef = useRef<HTMLAudioElement | null>(null); 

    const initState: State = {
        allChapters : [],
        currentChapter : null,
        bookOverview : null,
        totalVerses : -1,
        currentVerse : null
    }

    

    const [state, setState] = useState<State>(initState);

    useEffect(() => {

        console.info("Coming here");

        if (audioRef.current && state.currentVerse && state.currentVerse.num) {
            let currentTime = 0;
            for (let i = 0; i < state.currentVerse.num; i++)  {
                currentTime = currentTime + verseMapper[i];
            }

            console.info("Current Time: ", currentTime)
            audioRef.current.currentTime = currentTime
            audioRef.current.play();
        }

    }, [state.currentVerse])

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