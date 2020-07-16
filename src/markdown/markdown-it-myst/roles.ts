/* eslint-disable no-param-reassign */
import { escapeHtml } from 'markdown-it/lib/common/utils';
import Token from 'markdown-it/lib/token';
import MarkdownIt from 'markdown-it';

const ABBR_PATTERN = /^(.+?)\(([^()]+)\)$/; // e.g. 'CSS (Cascading Style Sheets)'

type Attrs = Record<string, any>;

export type Role = {
  token: string;
  content: string;
  attrs: Attrs;
};

type RoleConstructor = {
  token: string;
  attrs?: Attrs;
  getAttrs?: (content: string) => { attrs: Attrs; content?: string };
  renderer: (tokens: Token[], idx: number) => string;
};

const knownRoles: Record<string, RoleConstructor> = {
  math: {
    token: 'math_inline',
    attrs: {},
    renderer: (tokens, idx) => {
      const token = tokens[idx];
      return `<span class="math">${escapeHtml(token.content)}</span>`;
    },
  },
  abbr: {
    token: 'abbr',
    getAttrs(content) {
      const match = ABBR_PATTERN.exec(content);
      if (match == null) return { attrs: { title: '' }, content };
      const [, modified, title] = match;
      return { attrs: { title }, content: modified.trim() };
    },
    renderer: (tokens, idx) => {
      const token = tokens[idx];
      return `<abbr title="${escapeHtml(token.attrGet('title') ?? '')}">${escapeHtml(token.content)}</abbr>`;
    },
  },
};

const genericRole: RoleConstructor = {
  token: 'myst_role',
  renderer: (tokens, idx) => {
    const token = tokens[idx];
    const name = token.meta?.name ?? 'unknown';
    return (
      `<code class="myst-role">\n{{${name}}}[${escapeHtml(token.content)}]\n</code>`
    );
  },
};

export function getRole(name: string, content: string): Role {
  const roleF = knownRoles[name] ?? genericRole;
  if (roleF.getAttrs) {
    const { attrs, content: modified } = roleF.getAttrs(content);
    return { token: roleF.token, attrs: attrs ?? {}, content: modified ?? content };
  }
  return { token: roleF.token, attrs: roleF.attrs ?? {}, content };
}

export function addRenderers(md: MarkdownIt) {
  Object.entries(knownRoles).forEach(([, { token, renderer }]) => {
    // Early return if the role is already defined
    // e.g. math_inline might be better handled by another plugin
    if (md.renderer.rules[token]) return;
    md.renderer.rules[token] = renderer;
  });
}
