import {JSX} from "react";

export interface MenuComponentProps {
    content: JSX.Element,
}


export default function MenuComponent(props: MenuComponentProps): JSX.Element {
    // const [contents, setContents] = useState<JSX.Element>(<div>MenuComponent</div>);

    return props.content
}