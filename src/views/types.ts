import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export type NodeViewProps = {
  node: Node;
  view: EditorView;
  getPos: () => number;
  open: boolean;
  edit: boolean;
};

// See languages modes names on https://codemirror.net/mode/index.html#
export enum LanguageNames {
  Js = 'javascript',
  Jsx = 'jsx',
  Ts = 'typescript',
  Python = 'python',
  Swift = 'swift',
  Php = 'php',
  Cpp = 'text/x-c++src',
  ObjC = 'text/x-objectivec',
  Java = 'text/x-java',
  Scala = 'text/x-scala',
  C = 'text/x-csrc',
  Csharp = 'text/x-csharp',
  Julia = 'julia',
  Html = 'htmlmixed',
  R = 'r',
  Sql = 'sql',
  Ruby = 'ruby',
  Rust = 'rust',
  Go = 'go',
}

export const SUPPORTED_LANGUAGES = [
  { name: LanguageNames.Python, label: 'Python' },
  { name: LanguageNames.R, label: 'R' },
  { name: LanguageNames.Julia, label: 'Julia' },
  { name: LanguageNames.Html, label: 'HTML' },
  { name: LanguageNames.Js, label: 'JavaScript' },
  { name: LanguageNames.Jsx, label: 'JSX' },
  { name: LanguageNames.Go, label: 'Go' },
  { name: LanguageNames.Ts, label: 'TypeScript' },
  { name: LanguageNames.Swift, label: 'Swift' },
  { name: LanguageNames.Php, label: 'PHP' },
  { name: LanguageNames.C, label: 'C' },
  { name: LanguageNames.Cpp, label: 'Cpp' },
  { name: LanguageNames.Csharp, label: 'C#' },
  { name: LanguageNames.ObjC, label: 'Objective-C' },
  { name: LanguageNames.Java, label: 'Java' },
  { name: LanguageNames.Scala, label: 'Scala' },
  { name: LanguageNames.Sql, label: 'SQL' },
  { name: LanguageNames.Ruby, label: 'Ruby' },
  { name: LanguageNames.Rust, label: 'Rust' },
];

export type GetPos = () => number;
