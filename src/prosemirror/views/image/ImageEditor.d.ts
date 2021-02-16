import { Component } from 'react';
import { AlignOptions } from './ImageToolbar';
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
    alt: string;
    title: string;
    width: number;
    align: AlignOptions;
};
declare class ImageEditor extends Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
}
export default ImageEditor;
