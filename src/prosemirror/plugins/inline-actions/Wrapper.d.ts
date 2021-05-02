import { Component } from 'react';
import { PopperPlacementType } from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import { SelectionKinds } from './types';
declare type Props = {
    view: EditorView;
};
declare type State = {
    open: boolean;
    edit: boolean;
    kind: SelectionKinds | null;
    anchorEl: any;
    placement: PopperPlacementType;
};
declare class Wrapper extends Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
export default Wrapper;
