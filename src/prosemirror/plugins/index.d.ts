import * as views from '../views';
export declare function getPlugins(stateKey: any, version: number, startEditable: boolean): (import("prosemirror-state").Plugin<any, any> | import("prosemirror-state").Plugin<import("./comments").CommentState, any> | views.image.ImagePlaceholderPlugin)[];
