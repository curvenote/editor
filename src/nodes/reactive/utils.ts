import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Node, NodeSpec, AttributeSpec } from 'prosemirror-model';
import { NodeDef, Attr } from '../types';

export const DEFAULT_FORMAT = '.1f';

export const createAttr = (
  name: string,
  func: boolean | 'only' = true,
  defaultValue: string | false = '',
): Attr => {
  if (defaultValue === false) {
    return {
      name,
      func,
      default: false,
      optional: false,
    };
  }
  return {
    name,
    func,
    default: defaultValue,
    optional: true,
  };
};

type DomAttrs = Record<string, string>;

export const createSpec = (def: NodeDef, domAttrs?: (props: DomAttrs) => DomAttrs): NodeSpec => {
  const attrs: Record<string, AttributeSpec> = {};
  def.attrs.forEach((attr) => {
    if (attr.func !== 'only') {
      attrs[attr.name] = !attr.optional ? {} : { default: attr.default ?? '' };
    }
    if (attr.func) {
      attrs[`${attr.name}Function`] = { default: '' };
    }
  });
  const spec: NodeSpec = {
    inline: def.inline,
    group: def.group,
    attrs,
    toDOM(node) {
      const props: DomAttrs = {};
      def.attrs.forEach((attr) => {
        const [value, valueFunction] = [node.attrs[attr.name], node.attrs[`${attr.name}Function`]];
        if (value && attr.func !== 'only') props[attr.name] = value;
        if (attr.func && valueFunction) props[`:${attr.name}`] = valueFunction;
      });
      return [def.tag, domAttrs ? domAttrs(props) : props];
    },
    parseDOM: [
      {
        tag: def.tag,
        getAttrs(dom: any) {
          const props: Record<string, string> = {};
          def.attrs.forEach((attr) => {
            if (attr.func !== 'only')
              props[attr.name] = dom.getAttribute(attr.name) ?? attr.default;
            if (attr.func) props[`${attr.name}Function`] = dom.getAttribute(`:${attr.name}`) ?? '';
          });
          return props;
        },
      },
    ],
  };
  return spec;
};

export const nodeToMystRole = (state: MarkdownSerializerState, node: Node, def: NodeDef) => {
  state.write(`{${def.name}}\`<`);
  const values = def.attrs.map((attr) => {
    if (attr.func) {
      const value = node.attrs[attr.name];
      const valueFunction = node.attrs[`${attr.name}Function`];
      const prop = `${attr.name}=${state.quote(value ?? '')}`;
      const propFunction = `:${attr.name}=${state.quote(valueFunction)}`;
      if (valueFunction || attr.func === 'only') return propFunction;
      return value === attr.default ? null : prop;
    }
    const value = node.attrs[attr.name];
    return value === attr.default ? null : `${attr.name}=${state.quote(value)}`;
  });
  state.write(values.filter((v) => v !== null).join(' '));
  state.write('>`');
};

export const nodeToMystDirective = (state: MarkdownSerializerState, node: Node, def: NodeDef) => {
  state.ensureNewLine();
  state.write(`\`\`\`{${def.name}}`);
  state.ensureNewLine();
  const values = def.attrs.map((attr) => {
    if (attr.func) {
      const value = node.attrs[attr.name];
      const valueFunction = node.attrs[`${attr.name}Function`];
      const prop = `:${attr.name}: ${state.quote(value ?? '')}`;
      const propFunction = `:${attr.name}Function: ${state.quote(valueFunction)}`;
      if (valueFunction || attr.func === 'only') return propFunction;
      return prop;
    }
    const value = node.attrs[attr.name];
    return value ? `:${attr.name}: ${state.quote(value)}` : null;
  });
  state.write(values.filter((v) => v !== null).join('\n'));
  state.write('\n```');
  state.closeBlock(node);
};
