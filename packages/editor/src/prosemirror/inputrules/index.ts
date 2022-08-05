import { inputRules } from 'prosemirror-inputrules';
import type { Schema } from 'prosemirror-model';
import codemark from 'prosemirror-codemark';

import type { Plugin } from 'prosemirror-state';
import * as rules from './rules';

export * from './rules';

const inputrules = (schema: Schema): Plugin[] => [
  inputRules({
    rules: [
      ...rules.quotes(schema),
      ...rules.ellipsis(schema),
      ...rules.blockquote(schema),
      ...rules.arrows(schema),
      ...rules.emojis(schema),
      ...rules.fractions(schema),
      ...rules.emdash(schema),
      ...rules.copyright(schema),
      ...rules.link(schema),
      ...rules.lists(schema),
      ...rules.codeBlock(schema),
      ...rules.strong(schema),
      ...rules.em(schema),
      ...rules.hr(schema), // Comes above strikethrough!
      ...rules.strikethrough(schema),
      ...rules.headings(schema),
      ...rules.equation(schema),
      ...rules.mathInline(schema),
      ...rules.slider(schema),
    ],
  }),
  ...codemark(),
];

export default inputrules;
