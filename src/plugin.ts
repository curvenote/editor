import { Plugin } from 'prosemirror-state';
import { inputRules } from 'prosemirror-inputrules';
import { Options } from './types';
import { getDecorationPlugin } from './decoration';
import { createInputRule } from './inputRules';

const defaultOptions: Required<Options> = {
  reducer: () => false,
  triggers: [],
};

export function autocomplete(opts: Options = {}) {
  const options: Required<Options> = { ...defaultOptions, ...opts };
  const { reducer: handler, triggers } = options;

  const plugin = getDecorationPlugin(handler);

  const rules: Plugin[] = [
    plugin,
    inputRules({
      // Create an input rule for each trigger
      rules: triggers.map((type) => createInputRule(plugin, type)),
    }),
  ];
  return rules;
}
