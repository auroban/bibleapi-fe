import { ReactElement, useEffect, useState } from "react"
import { BookOverview, ChapterDetailedView } from "../../models/dto"
import "./ChapterView.css"
import BibleApi from "../../helpers/BibleApi"
import { useParams } from "react-router-dom"
import Dropdown from "../Dropdown/Dropdown"
import { ChapterDetailedViewRequest } from "../../models/request"
import USFMView from "../USFMView/USFMView"
import PlainView from "../PlainView/PlainView"

interface State {
    allChapters: Array<ChapterDetailedView>
    currentChapter?: ChapterDetailedView | null
    bookOverview: BookOverview | null
}

const ChapterView = () => {

    const { tCode } = useParams();
    const { bCode } = useParams();

    const initState: State = {
        allChapters : [],
        bookOverview : null
    }

    const [state, setState] = useState<State>(initState)

    useEffect(() => {
        fetchAndUpdate()
    }, [])


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
        for (let i = 0; i < state.allChapters.length; i++) {
            if (state.allChapters[i].chapterNum === index) {
                chapter = state.allChapters[i];
                break;
            }
        }
        if (chapter) {
            setState(prevState => ({
                ...prevState,
                currentChapter : chapter
            }));
        }
    }

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
            <div className="container-fluid chapter-view--vl">
                { content }
            </div>
        </div>
    );
}

export default ChapterView;