export enum CommandNames {
  'link' = 'link',
  'callout' = 'callout',
  'aside' = 'aside',
  'math' = 'math',
  'equation' = 'equation',
  'horizontal_rule' = 'horizontal_rule',
  'bullet_list' = 'bullet_list',
  'ordered_list' = 'ordered_list',
  'emoji' = 'emoji',
  'paragraph' = 'paragraph',
  'heading1' = 'heading1',
  'heading2' = 'heading2',
  'heading3' = 'heading3',
  'heading4' = 'heading4',
  'heading5' = 'heading5',
  'heading6' = 'heading6',
  'code' = 'code',
  'variable' = 'variable',
  'display' = 'display',
  'range' = 'range',
  'dynamic' = 'dynamic',
  'switch' = 'switch',
  'button' = 'button',
}

export interface CommandResult {
  name: CommandNames;
  title: string;
  description: string;
  image?: string;
  shortcut?: string;
}

export const commands: CommandResult[] = [
  {
    name: CommandNames.callout,
    title: 'Callout Panel',
    description: 'Callout information in a panel',
  },
  {
    name: CommandNames.aside,
    title: 'Aside',
    description: 'Add a section in the right-hand column',
  },
  {
    name: CommandNames.math,
    title: 'Inline Math',
    description: 'Add some inline math!',
    shortcut: '$$',
  },
  {
    name: CommandNames.equation,
    title: 'Equation',
    description: 'Add a standalone math equation',
    shortcut: '$$',
  },
  {
    name: CommandNames.horizontal_rule,
    title: 'Divider',
    description: 'Insert a horizontal rule',
    shortcut: '---',
  },
  {
    name: CommandNames.bullet_list,
    title: 'Bullet list',
    description: 'Insert an unordered list',
    shortcut: '⌘⇧8',
  },
  {
    name: CommandNames.ordered_list,
    title: 'Numbered list',
    description: 'Insert an ordered list',
    shortcut: '⌘⇧7',
  },
  {
    name: CommandNames.emoji,
    title: 'Emoji',
    description: 'Add some emotion to your work 🎉',
    shortcut: ':',
  },
  {
    name: CommandNames.code,
    title: 'Code Block',
    description: 'Add a block of code',
    shortcut: '```',
  },
  {
    name: CommandNames.variable,
    title: 'Variable',
    description: 'Add a variable, make your document dynamic',
    shortcut: 'x=',
  },
  {
    name: CommandNames.display,
    title: 'Display',
    description: 'Display a variable or expression',
    shortcut: '{{',
  },
  {
    name: CommandNames.range,
    title: 'Slider',
    description: 'Insert a slider over a range',
    shortcut: '==x==',
  },
  {
    name: CommandNames.dynamic,
    title: 'Dynamic Text',
    description: 'Insert dynamic text that acts as an inline slider',
    shortcut: '<x>',
  },
  {
    name: CommandNames.switch,
    title: 'Inline Switch',
    description: 'Insert a switch for a boolean value',
  },
  {
    name: CommandNames.button,
    title: 'Inline Button',
    description: 'Insert a button',
  },
  {
    name: CommandNames.paragraph,
    title: 'Paragraph',
    description: 'Turn header into a paragraph',
    shortcut: '⌘⌥0',
  },
  {
    name: CommandNames.heading1,
    title: 'Heading 1',
    description: 'Insert the biggest header',
    shortcut: '⌘⌥1',
  },
  {
    name: CommandNames.heading2,
    title: 'Heading 2',
    description: 'Insert a big header',
    shortcut: '⌘⌥2',
  },
  {
    name: CommandNames.heading3,
    title: 'Heading 3',
    description: 'Insert a medium sized header',
    shortcut: '⌘⌥3',
  },
  {
    name: CommandNames.heading4,
    title: 'Heading 4',
    description: 'Insert a small header',
    shortcut: '⌘⌥4',
  },
  {
    name: CommandNames.heading5,
    title: 'Heading 5',
    description: 'Insert a tiny header',
    shortcut: '⌘⌥5',
  },
  {
    name: CommandNames.heading6,
    title: 'Heading 6',
    description: 'Insert a teensy-tiny header',
    shortcut: '⌘⌥6',
  },
];
