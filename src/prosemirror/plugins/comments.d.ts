import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet, EditorView } from 'prosemirror-view';
export interface CommentState {
    decorations: DecorationSet;
}
export declare const key: PluginKey<any>;
interface CommentAddAction {
    type: 'add';
    commentId: string;
}
interface CommentRemoveAction {
    type: 'remove';
    commentId: string;
}
declare type CommentAction = CommentAddAction | CommentRemoveAction;
export declare function dispatchCommentAction(view: EditorView, action: CommentAction): void;
declare const getCommentsPlugin: () => Plugin<CommentState>;
export default getCommentsPlugin;
