import type {
  PhrasingContent,
  FlowContent,
  Math as SpecMath,
  Heading as SpecHeading,
  TableCell as SpecTableCell,
  StaticPhrasingContent,
} from 'myst-spec';

export {
  Text,
  Abbreviation,
  Emphasis,
  InlineCode,
  Link,
  Node as MystNode,
  PhrasingContent,
  FlowContent,
  StaticPhrasingContent,
  Strong,
  Subscript,
  Superscript,
  Underline,
  Blockquote,
  Break,
  List,
  ListContent,
  ListItem,
  Paragraph,
  ThematicBreak,
  Admonition,
  CrossReference,
  Code,
  InlineMath,
  Caption,
  Container,
  Image,
  Legend,
  Table,
  TableRow,
  FootnoteDefinition,
  FootnoteReference,
  Root,
} from 'myst-spec';

export type NoAttrs = Record<string, never>;

type Identifier = {
  identifier: string;
  label?: string;
};

export type OptionalNumbered = {
  numbered?: boolean;
  number?: string;
};

// Marks

export type Strikethrough = {
  type: 'delete'; // https://github.com/syntax-tree/mdast#delete
  children: PhrasingContent[];
};

// Nodes

export type Margin = {
  type: 'margin';
  children: FlowContent[];
};

export type Cite = {
  type: 'cite';
  identifier?: string;
  label?: string;
};

export type CiteGroup = {
  type: 'citeGroup';
  kind: 'narrative' | 'parenthetical';
  children: Cite[]; // can maybe have cross references?
};

export type InlineFootnote = {
  type: 'inlineFootnote';
  children: FlowContent[];
};

export type Math = SpecMath & OptionalNumbered;
export type Heading = SpecHeading & OptionalNumbered;

export type Iframe = {
  type: 'iframe';
  src: string;
  width: string | number | null;
};

export type Time = {
  type: 'time';
  time: string;
  value: string;
};

export type Mention = {
  type: 'mention';
  value: string;
} & Identifier;

export type TableCell = SpecTableCell & {
  colspan?: number;
  rowspan?: number;
};

export type LinkBlock = {
  type: 'linkBlock';
  url: string;
  thumbnail?: string;
  title?: string;
  children: StaticPhrasingContent[];
};

// Reactive nodes
export type Button = {
  type: 'reactiveButton';
  label?: string;
  labelFunction?: string;
  disabled?: string;
  disabledFunction?: string;
  clickFunction?: string;
};

export type Display = {
  type: 'reactiveDisplay';
  value?: string;
  valueFunction?: string;
  format?: string;
  transformFunction?: string;
};

export type Dynamic = {
  type: 'reactiveDynamic';
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  format?: string;
  min?: string;
  minFunction?: string;
  max?: string;
  maxFunction?: string;
  step?: string;
  stepFunction?: string;
};

export type Range = {
  type: 'reactiveRange';
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  format?: string;
  min?: string;
  minFunction?: string;
  max?: string;
  maxFunction?: string;
  step?: string;
  stepFunction?: string;
};

export type Switch = {
  type: 'reactiveSwitch';
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  label?: string;
};

export type Variable = {
  type: 'reactiveVariable';
  name: string;
  value?: string;
  valueFunction?: string;
  format?: string;
};
