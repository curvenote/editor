import type { ReferenceKind } from '../nodes/types';

export type CounterMeta = Record<string, string | number | boolean | null>;

export type Reference<K = ReferenceKind, T = CounterMeta> = {
  id: string | null;
  kind: K;
  label: string | null;
  numbered: boolean;
  number: number | null;
  title: string;
  meta: T;
};

export type Counter<R extends Reference> = {
  kind: R['kind'];
  total: number;
  all: R[];
};

export type SectionReference = Reference<
  ReferenceKind.sec,
  { level: number; section: string | null }
>;
export type FigureReference = Reference<ReferenceKind.fig, { src: string; alt: string }>;
export type EquationReference = Reference<ReferenceKind.eq, { math: string }>;
export type CodeReference = Reference<
  ReferenceKind.code,
  { code: string; language: string | null }
>;
export type TableReference = Reference<ReferenceKind.table>;
export type LinkReference = Reference<ReferenceKind.link, { url: string }>;
export type CiteReference = Reference<ReferenceKind.cite, { key: string }>;

export type AnyReference =
  | SectionReference
  | FigureReference
  | EquationReference
  | CodeReference
  | TableReference
  | CiteReference
  | LinkReference;

export type StateCounter = {
  [ReferenceKind.sec]: Counter<SectionReference>;
  [ReferenceKind.fig]: Counter<FigureReference>;
  [ReferenceKind.eq]: Counter<EquationReference>;
  [ReferenceKind.code]: Counter<CodeReference>;
  [ReferenceKind.table]: Counter<TableReference>;
  [ReferenceKind.link]: Counter<LinkReference>;
  [ReferenceKind.cite]: Counter<CiteReference>;
};

export type WordCounter = {
  words: number;
  characters_excluding_spaces: number;
  characters_including_spaces: number;
};
