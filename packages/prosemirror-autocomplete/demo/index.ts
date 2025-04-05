/* eslint-disable import/no-extraneous-dependencies */
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { exampleSetup } from 'prosemirror-example-setup';
import { autocomplete, Options } from '../src';
import { reducer } from './reducer';

const editor = document.querySelector('#editor') as HTMLDivElement;
const content = document.querySelector('#content') as HTMLDivElement;

const options: Options = {
  reducer,
  triggers: [
    // For demo purposes, make the `#` and `@` easier to create
    { name: 'hashtag', trigger: /(#)$/, cancelOnSpace: true },
    { name: 'mention', trigger: /(@)$/ },
    { name: 'emoji', trigger: ':' },
    { name: 'link', trigger: '[[', cancelOnFirstSpace: false },
    { name: 'jinja', trigger: '{{', cancelOnFirstSpace: false },
    { name: 'command', trigger: '/', decorationAttrs: { class: 'command' } },
    { name: 'variable', trigger: /((?:^[a-zA-Z0-9_]+)\s?=)$/, cancelOnFirstSpace: false },
    { name: 'code', trigger: /((?:[a-zA-Z0-9_]+)\.)$/ },
  ],
};

(window as any).view = new EditorView(editor, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(content),
    plugins: [...autocomplete(options), ...exampleSetup({ schema, menuBar: false })],
  }),
});
