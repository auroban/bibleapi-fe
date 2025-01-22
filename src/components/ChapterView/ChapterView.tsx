import { ReactElement, useEffect, useState } from "react"
import { BookOverview, ChapterDetailedView, ChapterOverview } from "../../models/dto"
import "./ChapterView.css"
import BibleApi from "../../helpers/BibleApi"
import { useParams } from "react-router-dom"
import Dropdown from "../Dropdown/Dropdown"
import { ChapterDetailedViewRequest, ChapterOverviewRequest } from "../../models/request"
import USFMView from "../USFMView/USFMView"
import PlainView from "../PlainView/PlainView"
import { ResourceURL } from "../../constants/ResourceURL"
import AudioPlayer from "../AudioPlayer/AudioPlayer"

interface State {
    allChapters: Array<ChapterDetailedView>
    currentChapter?: ChapterDetailedView | null
    currentChapterOverview?: ChapterOverview | null,
    bookOverview: BookOverview | null
    chapterOverviews: Array<ChapterOverview>
}

const ChapterView = () => {

    const { tCode } = useParams();
    const { bCode } = useParams();

    const initState: State = {
        allChapters : [],
        bookOverview : null,
        chapterOverviews : []
    }

    const [state, setState] = useState<State>(initState)

    useEffect(() => {
        fetchAndUpdate()
    }, [])


    const fetchAndUpdate = async () => {

        const bookOverview = await getBookOverview();
        const allChapters: Array<ChapterDetailedView> = [];
        const allChapterOverviews: Array<ChapterOverview> = [];
        const totalChapters = bookOverview?.totalChapters ?? 0;
        for(let i = 1; i <= totalChapters; i++) {
            const chapterDetailedReq: ChapterDetailedViewRequest = {
                translationCode : tCode ?? "",
                bookCode : bCode ?? "",
                chapterNum : i
            }

            const chapterOverviewReq: ChapterOverviewRequest = {
                translationCode : tCode ?? "",
                bookCode : bCode ?? "",
                chapterNum : i
            }
            
            const chapterDetailedView = await BibleApi.getInstance().getChapterDetailedView(chapterDetailedReq);
            const chapterOverview = await BibleApi.getInstance().getChapterOverview(chapterOverviewReq);
            allChapters.push(chapterDetailedView);
            allChapterOverviews.push(chapterOverview);
        }
        setState(prevState => ({
            ...prevState,
            allChapters : allChapters,
            chapterOverviews : allChapterOverviews,
            bookOverview : bookOverview
        }));
    }

    const getBookOverview = async () : Promise<BookOverview | null> => {
        const translationOverview = await BibleApi.getInstance().getTranslationOverview({ translationCode : tCode ?? "" });
        if (translationOverview.books) {
            return translationOverview.books.find((b) => b.code === bCode) ?? null;
        }
        return null;
    }

    const createRangeList = (high: number) : Array<string> => {
        const arr: string[] = [];
        for (let i = 1; i <= high; i++) {
            arr.push(i.toString())
        }
        return arr
    }

    const onChapterSelect = async (index: number) => {
        let chapter: ChapterDetailedView | null = null;
        let chapterOverview: ChapterOverview | null = null;
        for (let i = 0; i < state.allChapters.length; i++) {
            if (state.allChapters[i].chapterNum === index) {
                chapter = state.allChapters[i];
                chapterOverview = state.chapterOverviews[i];
                break;
            }
        }
        if (chapter) {
            setState(prevState => ({
                ...prevState,
                currentChapter : chapter,
                currentChapterOverview : chapterOverview,
            }));
        }
    }

    const showAudioPlayer = () : ReactElement => {
        const url = `${ResourceURL.AUDIO}?tCode=${tCode}&bCode=${bCode}&cNum=${state.currentChapter?.chapterNum}`;
        const skipFirst = tCode == "BSB";
        return <AudioPlayer skipFirst={ skipFirst } url={ url } timestamps={ state.currentChapter?.audioTimestamps?.timestamps } />;
    };

    let content: ReactElement = <></>

    if (state.currentChapter) {
        if (state.currentChapter.usfm && Object.keys(state.currentChapter.usfm).length !== 0) {
            content = <USFMView chapter={ state.currentChapter } />
        } else {
            content = <PlainView chapter={ state.currentChapter } />
        }
    }

    return (
        <div className="container-fluid chapter-view">
            <div className="container-fluid chapter-view--head">
                <h4>Translation Code: { tCode }</h4>
                <h4>Book Name: { state.bookOverview?.name }</h4>
            </div>
            <div className="container-fluid chapter-view--dd">
                <Dropdown 
                    options={ createRangeList(state.bookOverview?.totalChapters ?? 0) }
                    title="Select a chapter"
                    onSelect={ (i) => onChapterSelect(i+1) } />
            </div>
            {
                state.currentChapterOverview && state.currentChapterOverview.audioAvailable ? 
                    showAudioPlayer() : <></>
            }
            <div className="container-fluid chapter-view--vl">
                { content }
            </div>
        </div>
    );
}

export default ChapterView;