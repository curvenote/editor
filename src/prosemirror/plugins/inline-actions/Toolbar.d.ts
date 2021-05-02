/// <reference types="react" />
import { EditorView } from 'prosemirror-view';
import { SelectionKinds } from './types';
declare type Props = {
    view: EditorView;
    open: boolean;
    edit: boolean;
    kind: SelectionKinds | null;
};
declare const LinkToolbar: (props: Props) => JSX.Element | null;
export default LinkToolbar;
