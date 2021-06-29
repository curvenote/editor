import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
export declare const key: PluginKey<any, any>;
export interface PromptState {
    prompt: DecorationSet;
}
declare const getPromptPlugin: () => Plugin<PromptState>;
export default getPromptPlugin;
