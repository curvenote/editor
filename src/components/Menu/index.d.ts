/// <reference types="react" />
interface Props {
    standAlone?: boolean;
    disabled?: boolean;
}
declare function EditorMenu(props: Props): JSX.Element;
declare namespace EditorMenu {
    var defaultProps: {
        standAlone: boolean;
        disabled: boolean;
    };
}
export default EditorMenu;
