import "./LandingView.css"
import bgLanding from "../../resources/images/bg_landing-view.jpg"
import Dropdown from "../Dropdown/Dropdown";
import { TranslationOverview } from "../../models/dto";
import { StringConstant } from "../../constants/StringConstant";

interface Props {
    availableTranslations: Array<TranslationOverview>
    onTranslationSelection: (i: number) => void
}

const LandingView = (props: Props) => {

    const translationNames = props.availableTranslations.map( item => item.name ?? "" )

    return (
        <div className="container-fluid landing-view bhv--ns">
            <img className="dim-img--stretched landing-view__bg-image" src={ bgLanding }/>
            <div className="container-fluid landing-view__overlay">
                <label className="text-style-header bhv-label-cn">Welcome to the Bible API</label>
                <Dropdown 
                    title={ StringConstant.DD_TITLE_LANDING } 
                    options={ translationNames } 
                    onSelect={ props.onTranslationSelection } />
            </div>
        </div>
    );
}

export default LandingView;