/// <reference types="react" />
declare type Props = {
    stateKey: any;
    viewId: string;
    autoUnsubscribe?: boolean;
};
declare const Editor: {
    (props: Props): JSX.Element;
    defaultProps: {
        autoUnsubscribe: boolean;
    };
};
export default Editor;
