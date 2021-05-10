/// <reference types="react" />
import { EditorView } from 'prosemirror-view';
import { SelectionKinds } from './types';
declare type Props = {
    view: EditorView;
    open: boolean;
    edit: boolean;
    kind: SelectionKinds | null;
};
declare const Toolbar: (props: Props) => JSX.Element | null;
export default Toolbar;
