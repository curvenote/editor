/// <reference types="react" />
declare type Props = {
    stateId: any;
    viewId: string | null;
    anchorEl: HTMLElement | Element | null | undefined;
};
declare const CalloutActions: (props: Props) => JSX.Element | null;
export default CalloutActions;
