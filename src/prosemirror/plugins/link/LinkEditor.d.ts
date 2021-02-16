import { Component } from 'react';
declare type Props = {};
declare type State = {
    viewId: string;
    open: boolean;
    edit: boolean;
    href: string;
    onEdit: null | (() => void);
    onDelete: null | (() => void);
};
declare class LinkEditor extends Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
export default LinkEditor;
