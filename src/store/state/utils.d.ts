import { EditorState } from 'prosemirror-state';
export declare type Counter = {
    label: string;
    number: number;
};
export declare type StateCounter = {
    figures: Counter[];
    equations: Counter[];
    code: Counter[];
    headings: Counter[];
};
export declare function countState(state: EditorState): {
    figures: Counter[];
    equations: Counter[];
    code: Counter[];
    headings: Counter[];
};
