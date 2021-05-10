/// <reference types="react" />
import { EditorView } from 'prosemirror-view';
declare type Props = {
    view: EditorView;
    showCaption?: boolean;
};
declare const AlignActions: {
    (props: Props): JSX.Element | null;
    defaultProps: {
        showCaption: boolean;
    };
};
export default AlignActions;
