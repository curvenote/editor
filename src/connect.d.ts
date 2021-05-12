import { Theme } from '@material-ui/core';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node, Slice } from 'prosemirror-model';
import { DirectEditorProps, EditorView } from 'prosemirror-view';
import { Store } from './store/types';
import { CitationFormat } from './types';
export declare type SearchContext = {
    ids: string[];
    search: (query: string) => string[];
};
export declare type Options = {
    transformKeyToId: (key: any) => string | null;
    handlePaste?: (view: EditorView, event: ClipboardEvent, slice: Slice) => boolean;
    uploadImage: (file: File, node: Node | null) => Promise<string | null>;
    modifyTransaction?: (stateKey: any, viewId: string, state: EditorState, transaction: Transaction) => Transaction;
    getDocId: () => string;
    addComment?: (stateKey: any, state: EditorState) => boolean;
    onDoubleClick?: (stateKey: any, viewId: string | null, view: EditorView<any>, pos: number, event: MouseEvent) => boolean;
    theme: Theme;
    citationPrompt: () => Promise<string[] | null>;
    citationKeyToJson: (key: string) => Promise<CitationFormat | null>;
    createCitationSearch: () => Promise<SearchContext>;
    throttle: number;
    nodeViews?: DirectEditorProps['nodeViews'];
};
declare type Ref<T> = {
    store: () => T;
    _store?: T;
    opts: () => Options;
    _opts?: Options;
};
export declare const ref: Ref<Store>;
export declare function setup(store: Store, opts: Options): void;
export declare const store: Pick<Store, 'getState' | 'dispatch'>;
export declare const opts: Required<Options>;
export {};
