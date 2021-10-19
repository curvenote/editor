import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
export declare type NodeViewProps = {
    node: Node;
    view: EditorView;
    getPos: () => number;
    open: boolean;
    edit: boolean;
};
export declare enum LanguageNames {
    Js = "javascript",
    Jsx = "jsx",
    Ts = "typescript",
    Python = "python",
    Shell = "shell",
    Swift = "swift",
    Php = "php",
    Cpp = "text/x-c++src",
    ObjC = "text/x-objectivec",
    Java = "text/x-java",
    Scala = "text/x-scala",
    C = "text/x-csrc",
    Csharp = "text/x-csharp",
    Julia = "julia",
    Html = "htmlmixed",
    R = "r",
    Sql = "sql",
    Ruby = "ruby",
    Rust = "rust",
    Go = "go"
}
export declare const SUPPORTED_LANGUAGES: {
    name: LanguageNames;
    label: string;
}[];
export declare type GetPos = () => number;
