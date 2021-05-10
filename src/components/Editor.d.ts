/// <reference types="react" />
declare type Props = {
    stateKey: any;
    viewId: string;
    className?: string;
    autoUnsubscribe?: boolean;
};
declare const Editor: {
    (props: Props): JSX.Element;
    defaultProps: {
        autoUnsubscribe: boolean;
        className: string;
    };
};
export default Editor;
