import { DOMParser as DOMParserPM, DOMSerializer } from 'prosemirror-model';
import { Step as PMStep } from 'prosemirror-transform';
import { EditorState } from 'prosemirror-state';
import { collab, receiveTransaction } from 'prosemirror-collab';
import { schema } from './schema';
import * as types from './types';
import { upgrade } from './migrate';
import { Parser } from './types';

export { schema, nodes, marks } from './schema';
export { types, upgrade };

export function exampleSetupServer(version: number) {
  return [collab({ version })];
}

// TODO: Bring kind back into this function, test deployment ...
export function getEditorState(
  content: string, version: number, document: Document, DOMParser: Parser,
) {
  try {
    const data = JSON.parse(content);
    return EditorState.fromJSON(
      { schema, plugins: exampleSetupServer(version) },
      { doc: data, selection: { type: 'text', anchor: 0, head: 0 } },
    );
  } catch (error) {
    const element = upgrade(content, document, DOMParser);
    return EditorState.create({
      doc: DOMParserPM.fromSchema(schema).parse(element),
      plugins: exampleSetupServer(version),
    });
  }
}

// This is a Step[] ... can't import blocks on GCB????!?!
export function applySteps(state: EditorState, stepsData: any) {
  const steps: PMStep[] = [];
  const clientIDs: (string | number)[] = [];
  stepsData.forEach((data: any) => {
    const stepPM = PMStep.fromJSON(state.schema, data.step);
    steps.push(stepPM);
    clientIDs.push(data.client);
  });
  const tr = receiveTransaction(state, steps, clientIDs);
  return state.apply(tr);
}

export function getHTML(state: EditorState, document: Document) {
  const doc = document.createElement('div');
  const frag = DOMSerializer
    .fromSchema(state.schema)
    .serializeFragment(state.doc.content, { document });
  doc.appendChild(frag);
  return doc.innerHTML.toString();
}
