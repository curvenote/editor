/* eslint-disable no-param-reassign */
import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { escapeHtml } from 'markdown-it/lib/common/utils';
import Token from 'markdown-it/lib/token';
import { RuleCore } from 'markdown-it/lib/parser_core';

type ContainerOpts = Parameters<typeof container>[2];

const admonitionTypes = new Set(['attention', 'caution', 'danger', 'error', 'important', 'hint', 'note', 'seealso', 'tip', 'warning']);
const ADMONITIONS = /^\{?([a-z]*)\}?\s*(.*)$/;
const QUICK_PARAMETERS = /^:([a-z-]+):(.*)$/;

const admonitions: ContainerOpts = {
  validate(params) {
    const match = params.trim().match(ADMONITIONS);
    return match != null && admonitionTypes.has(match[1]);
  },
  render(tokens, idx) {
    const title = tokens[idx].attrGet('title') ?? '';
    if (tokens[idx].nesting === 1) return `<details><summary>${escapeHtml(title)}</summary>\n`;
    return '</details>\n';
  },
};

function stripParams(content: string) {
  const data = {};
  return { data, modified: content };
}

function stripYaml(content: string) {
  const data = {};
  return { data, modified: content };
}

function addDirectiveOptions(parent: Token, token: Token) {
  const { content } = token;
  const firstLine = content.split('\n')[0].trim();
  const isYaml = firstLine === '---';
  const isQuickParams = QUICK_PARAMETERS.test(firstLine);
  if (!isYaml && !isQuickParams) return;
  const strip = isYaml ? stripYaml : stripParams;
  const { data, modified } = strip(token.content);
  parent.meta = data;
  token.content = modified;
}

const stripOptions: RuleCore = (state) => {
  const { tokens } = state;
  let inContainer: Token | false = false;
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type.startsWith('container_') && token.type.endsWith('_open')) {
      inContainer = token;
      const match = token.info.trim().match(ADMONITIONS);
      token.attrSet('kind', match?.[1] ?? '');
      token.attrSet('title', (match?.[2] ?? '').trim());
    }
    if (token.type.startsWith('container_') && token.type.endsWith('_close')) inContainer = false;
    if (inContainer && token.type === 'inline') {
      addDirectiveOptions(inContainer, token);
    }
  }
  return true;
};

export function myst_directives_plugin(md: MarkdownIt) {
  md.use(container, 'admonitions', admonitions);
  md.use(container, 'admonitions', { ...admonitions, marker: '`' });
  md.core.ruler.after('block', 'strip_options', stripOptions);
}

