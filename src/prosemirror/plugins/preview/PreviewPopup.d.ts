/// <reference types="react" />
declare type Props = {
    viewId: string;
    uid: string;
    open: boolean;
    edit: boolean;
};
declare const PreviewPopup: (props: Props) => JSX.Element | null;
export default PreviewPopup;
