import { Step as PMStep } from 'prosemirror-transform';
import { EditorState } from 'prosemirror-state';
import { collab, receiveTransaction } from 'prosemirror-collab';
import { Node } from 'prosemirror-model';
import { fromHTML } from './parse/html';

import { Parser } from './parse/types';
import { getSchema, UseSchema } from './schemas';

export { EditorState };

function serverPlugins(version: number) {
  return [collab({ version })];
}

export function docToEditorState(doc: Node, version: number) {
  return EditorState.create({
    doc,
    plugins: serverPlugins(version),
  });
}

export function getEditorState(
  useSchema: UseSchema,
  content: string,
  version: number,
  document: Document,
  DOMParser: Parser,
) {
  const schema = getSchema(useSchema);
  try {
    const data = JSON.parse(content);
    return EditorState.fromJSON(
      { schema, plugins: serverPlugins(version) },
      { doc: data, selection: { type: 'text', anchor: 0, head: 0 } },
    );
  } catch (error) {
    const doc = fromHTML(content, useSchema, document, DOMParser);
    return docToEditorState(doc, version);
  }
}

export function applySteps(state: EditorState, stepsData: any[], client: string | number) {
  const steps: PMStep[] = [];
  const clientIDs: (string | number)[] = [];
  stepsData.forEach((data: any) => {
    const stepPM = PMStep.fromJSON(state.schema, data);
    steps.push(stepPM);
    clientIDs.push(client);
  });
  const tr = receiveTransaction(state, steps, clientIDs);
  const nextState = state.apply(tr);
  return {
    state: nextState,
    tr,
  };
}
