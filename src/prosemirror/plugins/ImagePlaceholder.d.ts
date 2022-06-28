import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet, EditorView } from 'prosemirror-view';
import { UploadImageState } from '../../connect';
export declare const key: PluginKey<any>;
export declare type ImagePlaceholderPlugin = Plugin<DecorationSet>;
interface PromptProps {
    view: EditorView;
    remove: (targetId?: string) => void;
    success: (state: UploadImageState[]) => void;
}
interface PromptActionProps extends PromptProps {
    id: string;
    pos: number;
}
interface PromptAction {
    prompt: PromptActionProps;
}
interface AddAction {
    add: {
        id: string;
        pos: number;
        dataUrls: string[];
    };
}
interface RemoveAction {
    remove: {
        id: string;
    };
}
export declare type Action = AddAction | RemoveAction | PromptAction;
export declare const getImagePlaceholderPlugin: () => ImagePlaceholderPlugin;
export declare function addImagePrompt(view: EditorView): void;
export declare function uploadAndInsertImages(view: EditorView, data: DataTransfer | null): boolean;
export {};
