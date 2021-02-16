/// <reference types="react" />
export declare type AlignOptions = 'left' | 'center' | 'right';
declare type Props = {
    viewId: string;
    open: boolean;
    align: AlignOptions;
    width: number;
    onAlign: (align: AlignOptions) => void;
    onWidth: (width: number) => void;
    onDelete: () => void;
};
declare const IFrameToolbar: (props: Props) => JSX.Element | null;
export default IFrameToolbar;
