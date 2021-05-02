import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
declare const CiteView: (node: Node<any>, view: EditorView<any>, getPos: boolean | (() => number)) => import("./NodeView").ReactWrapper;
export default CiteView;
