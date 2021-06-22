import React from 'react';
import { SelectionKinds as Kinds } from '../../store/ui/types';
export declare function useInlineActionProps(): {
    stateId: string | null;
    viewId: string | null;
    kind: Kinds | null;
    anchorEl: Element | null;
};
declare const InlineActionSwitch: React.FC;
export default InlineActionSwitch;
