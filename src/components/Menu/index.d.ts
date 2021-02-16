/// <reference types="react" />
interface Props {
    standAlone?: boolean;
    disabled?: boolean;
}
declare const EditorMenu: {
    (props: Props): JSX.Element;
    defaultProps: {
        standAlone: boolean;
        disabled: boolean;
    };
};
export default EditorMenu;
