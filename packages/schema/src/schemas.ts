import { Schema } from 'prosemirror-model';

import * as basic from './nodes/basic';
import { createTableNodeSpec } from './nodes/table';
import * as basicMarks from './marks';
import * as Nodes from './nodes';
import { nodeNames } from './types';
import { createFigureNodeSpec } from './nodes/figure';
import { createImageNodeSpec } from './nodes/image';
import type { NodeGroup } from './nodes/types';
import { LEGACY_NODE_GROUPS, ARTICLE_NODE_GROUPS } from './nodes/types';
import { createCodeBlockSpec } from './nodes/code';

export function createListNodeSpec(nodeGroup: NodeGroup) {
  const basicNodeSpecs = basic.createBasicNodeSpecs(nodeGroup);
  return {
    ordered_list: basicNodeSpecs.ordered_list,
    bullet_list: basicNodeSpecs.bullet_list,
    list_item: basicNodeSpecs.list_item,
  };
}

export function createPresentationNodeSpec(nodeGroup: NodeGroup) {
  return {
    aside: Nodes.Aside.createAsideNodeSpec(nodeGroup),
    callout: Nodes.Callout.createCalloutNodeSpec(nodeGroup),
    link_block: Nodes.LinkBlock.createLinkBlockNodeSpec(nodeGroup),
    iframe: Nodes.IFrame.createIframeSpec(nodeGroup),
  };
}

export function createCitationNodeSpec(nodeGroup: NodeGroup) {
  return {
    cite: Nodes.Cite.createCiteNodeSpec(nodeGroup),
    cite_group: Nodes.CiteGroup.createCiteGroup(nodeGroup),
  };
}

export function createMathNodeSpecNoDisplay(nodeGroup: NodeGroup) {
  return {
    math: Nodes.Math.createMathNodeSpec(nodeGroup).mathNoDisplay,
    equation: Nodes.Equation.createEquationNodeSpec(nodeGroup).equationNoDisplay,
  };
}
export function createMathNodeSpec(nodeGroup: NodeGroup) {
  return {
    math: Nodes.Math.createMathNodeSpec(nodeGroup).math,
    equation: Nodes.Equation.createEquationNodeSpec(nodeGroup).equation,
  };
}
export function createReactiveDisplayNodes(nodeGroup: NodeGroup) {
  return {
    display: Nodes.Display.createNodeSpec(nodeGroup),
    dynamic: Nodes.Dynamic.createNodeSpec(nodeGroup),
    range: Nodes.Range.createNodeSpec(nodeGroup),
    switch: Nodes.Switch.createNodeSpec(nodeGroup),
    button: Nodes.Button.createNodeSpec(nodeGroup),
  };
}

export function createReactiveNodeSpec(nodeGroup: NodeGroup) {
  return {
    variable: Nodes.Variable.createNodeSpec(nodeGroup),
    ...createReactiveDisplayNodes(nodeGroup),
  };
}
export function createArticleNodeSpecs() {
  const nodeGroup = ARTICLE_NODE_GROUPS;
  const specs = basic.createBasicNodeSpecs(nodeGroup);
  return {
    doc: basic.docWithBlock,
    [nodeNames.block]: basic.block,
    text: specs.text,
    paragraph: specs.paragraph,
    heading: Nodes.Heading.createHeadingNodeSpec(nodeGroup),
    footnote: Nodes.Footnote.default,
    blockquote: specs.blockquote,
    code_block: createCodeBlockSpec(nodeGroup),
    figure: createFigureNodeSpec(nodeGroup),
    figcaption: Nodes.Figcaption.default,
    image: createImageNodeSpec(nodeGroup),
    horizontal_rule: specs.horizontal_rule,
    hard_break: specs.hard_break,
    time: Nodes.Time.default,
    ...createListNodeSpec(nodeGroup),
    ...createTableNodeSpec(nodeGroup),
    // Presentational components
    ...createPresentationNodeSpec(nodeGroup),
    ...createCitationNodeSpec(nodeGroup),
    ...createMathNodeSpec(nodeGroup),
    ...createReactiveNodeSpec(nodeGroup),
  };
}

export function createLegacyNodeSpecs() {
  const nodeGroup = LEGACY_NODE_GROUPS;
  const specs = basic.createBasicNodeSpecs(nodeGroup);
  return {
    doc: basic.doc,
    text: specs.text,
    paragraph: specs.paragraph,
    heading: Nodes.Heading.createHeadingNodeSpec(nodeGroup),
    footnote: Nodes.Footnote.default,
    blockquote: specs.blockquote,
    code_block: createCodeBlockSpec(nodeGroup),
    figure: createFigureNodeSpec(nodeGroup),
    figcaption: Nodes.Figcaption.default,
    image: createImageNodeSpec(nodeGroup),
    horizontal_rule: specs.horizontal_rule,
    hard_break: specs.hard_break,
    time: Nodes.Time.default,
    ...createListNodeSpec(nodeGroup),
    ...createTableNodeSpec(nodeGroup),
    // Presentational components
    ...createPresentationNodeSpec(nodeGroup),
    ...createCitationNodeSpec(nodeGroup),
    ...createMathNodeSpec(nodeGroup),
    ...createReactiveNodeSpec(nodeGroup),
  };
}

export const marks = {
  link: basicMarks.link,
  code: basicMarks.code,
  em: basicMarks.em,
  strong: basicMarks.strong,
  superscript: basicMarks.superscript,
  subscript: basicMarks.subscript,
  strikethrough: basicMarks.strikethrough,
  underline: basicMarks.underline,
  abbr: basicMarks.abbr,
};

function createPresets() {
  const legacyBasicNodeSpecs = basic.createBasicNodeSpecs(LEGACY_NODE_GROUPS);
  const legacyNodeSpecs = createLegacyNodeSpecs();
  const articleNodeSpecs = createArticleNodeSpecs();
  return {
    article: {
      nodes: articleNodeSpecs,
      marks,
    },
    full: {
      nodes: legacyNodeSpecs,
      marks,
    },
    paragraph: {
      nodes: {
        doc: legacyBasicNodeSpecs.docParagraph,
        paragraph: legacyNodeSpecs.paragraph,
        text: legacyNodeSpecs.text,
        hard_break: legacyNodeSpecs.hard_break,
        time: Nodes.Time.default,
        footnote: Nodes.Footnote.default,
        ...createCitationNodeSpec(LEGACY_NODE_GROUPS),
        math: createMathNodeSpec(LEGACY_NODE_GROUPS).math,
        ...createReactiveDisplayNodes(LEGACY_NODE_GROUPS),
      },
      marks,
    },
    comment: {
      nodes: {
        doc: legacyBasicNodeSpecs.docComment,
        paragraph: legacyNodeSpecs.paragraph,
        heading: Nodes.Heading.createHeadingNodeSpec(LEGACY_NODE_GROUPS),
        text: legacyNodeSpecs.text,
        blockquote: legacyNodeSpecs.blockquote,
        footnote: Nodes.Footnote.default,
        code_block: createCodeBlockSpec(LEGACY_NODE_GROUPS),
        horizontal_rule: legacyNodeSpecs.horizontal_rule,
        hard_break: legacyNodeSpecs.hard_break,
        time: Nodes.Time.default,
        mention: Nodes.Mention.default,
        ...createListNodeSpec(LEGACY_NODE_GROUPS),
        ...createCitationNodeSpec(LEGACY_NODE_GROUPS),
        ...createMathNodeSpecNoDisplay(LEGACY_NODE_GROUPS),
      },
      marks,
    },
  };
}

export type PresetSchemas = keyof ReturnType<typeof createPresets>;
export type UseSchema = PresetSchemas | { nodes: Record<string, Node> } | Schema;

export function getSchema(useSchema: UseSchema) {
  const presets = createPresets();
  if (typeof useSchema === 'string') {
    switch (useSchema) {
      case 'article':
        return new Schema(presets.article);
      case 'full':
        return new Schema(presets.full);
      case 'paragraph':
        return new Schema(presets.paragraph);
      case 'comment':
        return new Schema(presets.comment);
      default:
        throw new Error(`Schema '${useSchema}' is not defined.`);
    }
  }
  if ('spec' in useSchema) return useSchema;
  return new Schema(useSchema);
}
