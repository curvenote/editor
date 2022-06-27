/// <reference types="react" />
import { ActionProps } from './utils';
export declare function useLinkBlockActions(stateId: any, viewId: string | null): {
    attrs: any;
    tooltip: any;
    onOpen: () => void;
    onDelete: () => void;
    onEdit: (newHref: string) => void;
    node: any;
};
declare function LinkBlockActions(props: ActionProps): JSX.Element | null;
export default LinkBlockActions;
