import { useState } from "react"
import "./Dropdown.css"

interface Props {
    title: string
    options: Array<string>
    onSelect: (index: number) => void
}

interface State {
    currentSelection: string
}

const Dropdown = (props: Props) => {

    const initState: State = {
        currentSelection : props.title
    }

    const [state, setState] = useState<State>(initState)

    const onSelect = (index: number) => {
        setState(prevState => ({
            ...prevState,
            currentSelection: props.options[index]
        }))
        props.onSelect(index)
    }

    const options = props.options.map((item, index) => {
        return <li className="bhv--poh"><a className="dropdown-item" onClick={ () => onSelect(index) }>{item}</a></li>
    })

    return (
        <div className="custom-dropdown dropdown">
            <a className="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                { state.currentSelection }
            </a>
            <ul className="dropdown-menu dd--scrollable" aria-labelledby="dropdownMenuLink">
                { options }
            </ul>
        </div>
    );

}

export default Dropdown;