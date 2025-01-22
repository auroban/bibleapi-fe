import { useState } from "react"
import { BookOverview, TranslationOverview } from "../../models/dto"
import "./DetailedView.css"

interface Props {
    selectedTranslation: TranslationOverview
}

const DetailedView = (props: Props) => {

    const onReadByChapter = (tCode: string, book: BookOverview) => {
        window.open(`/${tCode}/${book.code ?? ""}/chapter`, "_blank", "noreferrer");
    }

    const onReadByVerse = (tCode: string, book: BookOverview) => {
        window.open(`/${tCode}/${book.code ?? ""}/verse`, "_blank", "noreferrer");
    }

    const bookList = props.selectedTranslation.books?.map((val, index) => {

        const headingId = `heading-${index}`;
        const collapseId = `collapse-${index}`;

        return (
            <div className="accordion-item">
                <h2 className="accordion-header" id={headingId}>
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseId}`} aria-expanded="false" aria-controls={collapseId}>
                        {index + 1}# {val.name}
                    </button>
                </h2>
                <div id={collapseId} className="accordion-collapse collapse show" aria-labelledby={headingId} data-bs-parent="#custom-accordion">
                    <div className="accordion-body">
                        <h4>Total Chapters: {val?.totalChapters}</h4>
                        <div className="container-fluid">
                            <button 
                                type="button" 
                                className="btn btn-outline-primary" 
                                style={{marginRight: "50px"}}
                                onClick={() => onReadByChapter(props.selectedTranslation.code ?? "", val)}>
                                    Read By Chapter
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-outline-primary"
                                onClick={() => onReadByVerse(props.selectedTranslation.code ?? "", val)}>
                                    Read By Verse
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    });


    return (
        <div className="container-fluid detailed-view">
            <div className="detailed-view__header">
                <h1>{ `${props.selectedTranslation.name} (${props.selectedTranslation.code})` }</h1>
                <h3>Total Books: {props.selectedTranslation.totalBooks}</h3>
            </div>
            <div className="container-fluid detailed-view__books">
                <div className="detailed-view__books__header">
                    <h4>Books:</h4>
                </div>
                <div className="accordion" id="custom-accordion">
                    { bookList }
                </div>
            </div>
        </div>
    );
};

export default DetailedView;