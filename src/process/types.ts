import { ReferenceKind } from '../nodes/types';

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

export type CiteReference = Reference<ReferenceKind.cite, { level: number }>;
export type SectionReference = Reference<ReferenceKind.sec, { level: number }>;
export type FigureReference = Reference<ReferenceKind.fig, { src: string; caption: boolean }>;
export type EquationReference = Reference<ReferenceKind.eq, { math: string }>;
export type CodeReference = Reference<
  ReferenceKind.code,
  { code: string; language: string | null }
>;
export type TableReference = Reference<ReferenceKind.table>;
export type LinkReference = Reference<ReferenceKind.link, { url: string }>;

export type StateCounter = {
  [ReferenceKind.cite]: Counter<CiteReference>;
  [ReferenceKind.sec]: Counter<SectionReference>;
  [ReferenceKind.fig]: Counter<FigureReference>;
  [ReferenceKind.eq]: Counter<EquationReference>;
  [ReferenceKind.code]: Counter<CodeReference>;
  [ReferenceKind.table]: Counter<TableReference>;
  [ReferenceKind.link]: Counter<LinkReference>;
};
