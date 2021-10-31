/* eslint-disable import/no-extraneous-dependencies */
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { exampleSetup } from 'prosemirror-example-setup';
import codemark from '../src';
import '../src/codemark.css';

const editor = document.querySelector('#editor') as HTMLDivElement;
const content = document.querySelector('#content') as HTMLDivElement;

(window as any).view = new EditorView(editor, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(content),
    plugins: [
      ...codemark({ markType: schema.marks.code }),
      ...exampleSetup({ schema, menuBar: false }),
    ],
  }),
});
