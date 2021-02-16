import { Component } from 'react';
declare type Props = {
    onDelete: () => void;
};
declare type State = {
    viewId: string;
    open: boolean;
    edit: boolean;
    uid: string;
};
declare class CiteEditor extends Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
export default CiteEditor;
