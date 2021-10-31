/* eslint-disable import/no-extraneous-dependencies */
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { exampleSetup } from 'prosemirror-example-setup';
import codemark from '../src';
import '../src/codemark.css';
import { basicPlugin } from './compare';

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

// This is showing what not to do!!
const editor1 = document.querySelector('#editor1') as HTMLDivElement;
const content1 = document.querySelector('#content1') as HTMLDivElement;
(window as any).view1 = new EditorView(editor1, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(content1),
    plugins: [...basicPlugin(schema), ...exampleSetup({ schema, menuBar: false })],
  }),
});
