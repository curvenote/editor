import { schemas } from '@curvenote/schema';
import { EditorState } from 'prosemirror-state';

export type Counter = {
  label: string;
  number: number;
};

export type StateCounter = {
  figures: Counter[];
  equations: Counter[];
  code: Counter[];
  headings: Counter[];
};

export function countState(state: EditorState) {
  const counts = {
    figures: [] as Counter[],
    equations: [] as Counter[],
    code: [] as Counter[],
    headings: [] as Counter[],
  };
  state.doc.content.descendants((node) => {
    switch (node.type.name) {
      case schemas.nodeNames.image: {
        const { caption, label, numbered } = node.attrs;
        if (!numbered || !caption) return false;
        counts.figures.push({ label, number: counts.figures.length + 1 });
        return false;
      }
      case schemas.nodeNames.code_block: {
        const { label } = node.attrs;
        counts.code.push({ label, number: counts.code.length + 1 });
        return false;
      }
      case schemas.nodeNames.equation: {
        const { label } = node.attrs;
        counts.equations.push({ label, number: counts.equations.length + 1 });
        return false;
      }
      case schemas.nodeNames.heading: {
        const { label, numbered } = node.attrs;
        if (!numbered) return false;
        counts.headings.push({ label, number: counts.headings.length + 1 });
        return false;
      }
      // Continue to search
      case schemas.nodeNames.aside:
      case schemas.nodeNames.callout:
        return true;
      default:
        return false;
    }
  });
  return counts;
}
