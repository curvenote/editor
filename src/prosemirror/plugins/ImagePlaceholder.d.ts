import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet, EditorView } from 'prosemirror-view';
export declare const key: PluginKey<any, any>;
export declare type ImagePlaceholderPlugin = Plugin<DecorationSet>;
export declare type Action = ({
    add: {
        id: string;
        pos: number;
        dataUrl: string;
    };
} | {
    remove: {
        id: string;
    };
});
export declare const getImagePlaceholderPlugin: () => ImagePlaceholderPlugin;
export declare const addImagePlaceholder: (view: EditorView, dataUrl: string) => {
    success: (url: string) => void;
    fail: () => void;
};
export declare const uploadAndInsertImages: (view: EditorView, data: DataTransfer | null) => boolean;
