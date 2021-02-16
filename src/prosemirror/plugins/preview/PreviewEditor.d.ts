import { Component } from 'react';
declare type Props = {};
declare type State = {
    viewId: string;
    uid: string;
    open: boolean;
    edit: boolean;
};
declare class PreviewEditor extends Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
export default PreviewEditor;
