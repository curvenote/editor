import React from 'react';
import { types } from '@curvenote/schema';
import { ActionProps } from './utils';
export declare function useLinkActions(stateId: any, viewId: string | null): {
    attrs: types.LinkAttrs | null;
    tooltip: string;
    bounds: {
        from: number;
        to: number;
        mark: import("prosemirror-model").Mark<any>;
    } | null;
    onOpen: () => Window | null;
    onDelete: () => void;
    onEdit: (newHref: string) => void;
};
declare const LinkActions: React.FC<ActionProps>;
export default LinkActions;
