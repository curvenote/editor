import { ActionProps } from './utils';
export declare function useLinkBlockActions(stateId: any, viewId: string | null): {
    attrs: import("prosemirror-model").Attrs | null;
    tooltip: any;
    onOpen: () => void;
    onDelete: () => void;
    onEdit: (newHref: string) => void;
    node: import("prosemirror-model").Node | undefined;
};
declare function LinkBlockActions(props: ActionProps): JSX.Element | null;
export default LinkBlockActions;
