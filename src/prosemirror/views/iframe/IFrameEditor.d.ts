import { Component } from 'react';
import { AlignOptions } from './IFrameToolbar';
declare type Props = {
    onAlign: (align: AlignOptions) => void;
    onWidth: (width: number) => void;
    onDelete: () => void;
};
declare type State = {
    viewId: string;
    open: boolean;
    edit: boolean;
    src: string;
    width: number;
    align: AlignOptions;
};
declare class IFrameEditor extends Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
export default IFrameEditor;
