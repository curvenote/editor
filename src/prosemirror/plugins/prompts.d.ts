import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
export declare const key: PluginKey<any>;
declare const getPromptPlugin: () => Plugin<DecorationSet>;
export default getPromptPlugin;
