import { State } from '../types';
export declare const showAttributeEditor: (state: State) => boolean;
export declare const getAttributeEditorLocation: (state: State) => {
    top: number;
    left: number;
} | null;
export declare const getAttributeEditorPos: (state: State) => number;
