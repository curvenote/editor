import { GenericNode } from 'mystjs';

export type Props = {
  key: string;
  children?: GenericNode[];
} & Record<string, any>;

export type Component = (props: Props) => GenericNode;

// Nodes

export type NodeTypes = {
  blockquote: Component;
  horizontal_rule: Component;
} & Record<string, Component>;

// Marks

// export type LinkProps = {
//   href: string;
//   kind?: 'external';
// };

export type MarkTypes = {
  link: Component;
};

export type NodesAndMarks = NodeTypes & MarkTypes;
