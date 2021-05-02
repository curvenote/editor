export var CommandNames;
(function (CommandNames) {
    CommandNames["link"] = "link";
    CommandNames["callout"] = "callout";
    CommandNames["aside"] = "aside";
    CommandNames["math"] = "math";
    CommandNames["equation"] = "equation";
    CommandNames["horizontal_rule"] = "horizontal_rule";
    CommandNames["bullet_list"] = "bullet_list";
    CommandNames["ordered_list"] = "ordered_list";
    CommandNames["emoji"] = "emoji";
    CommandNames["paragraph"] = "paragraph";
    CommandNames["heading1"] = "heading1";
    CommandNames["heading2"] = "heading2";
    CommandNames["heading3"] = "heading3";
    CommandNames["heading4"] = "heading4";
    CommandNames["heading5"] = "heading5";
    CommandNames["heading6"] = "heading6";
    CommandNames["code"] = "code";
    CommandNames["quote"] = "quote";
    CommandNames["variable"] = "variable";
    CommandNames["display"] = "display";
    CommandNames["range"] = "range";
    CommandNames["dynamic"] = "dynamic";
    CommandNames["switch"] = "switch";
    CommandNames["button"] = "button";
    CommandNames["youtube"] = "youtube";
    CommandNames["loom"] = "loom";
    CommandNames["vimeo"] = "vimeo";
    CommandNames["miro"] = "miro";
    CommandNames["iframe"] = "iframe";
    CommandNames["citation"] = "citation";
})(CommandNames || (CommandNames = {}));
export var commands = [
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
        shortcut: ['$$ Type $Ax=b$ or two dollar signs in a paragraph'],
    },
    {
        name: CommandNames.equation,
        title: 'Equation',
        description: 'Add a standalone math equation',
        shortcut: ['$$ Start the line with two dollar signs'],
    },
    {
        name: CommandNames.horizontal_rule,
        title: 'Divider',
        description: 'Insert a horizontal rule',
        shortcut: ['--- Insert three -, ~, or * on a new line'],
    },
    {
        name: CommandNames.bullet_list,
        title: 'Bullet list',
        description: 'Insert an unordered list',
        shortcut: 'Mod-Shift-8',
    },
    {
        name: CommandNames.ordered_list,
        title: 'Numbered list',
        description: 'Insert an ordered list',
        shortcut: 'Mod-Shift-7',
    },
    {
        name: CommandNames.citation,
        title: 'Reference',
        description: 'Cite existing literature',
        shortcut: ['[[ To access existing ciations'],
    },
    {
        name: CommandNames.emoji,
        title: 'Emoji',
        description: 'Add some emotion to your work 🎉',
        shortcut: [':'],
    },
    {
        name: CommandNames.code,
        title: 'Code Block',
        description: 'Add a block of code',
        shortcut: ['```'],
    },
    {
        name: CommandNames.quote,
        title: 'Quote',
        description: 'Add a blockquote',
        shortcut: ['>'],
    },
    {
        name: CommandNames.variable,
        title: 'Variable',
        description: 'Add a variable, make your document dynamic',
        shortcut: ['x='],
    },
    {
        name: CommandNames.display,
        title: 'Display',
        description: 'Display a variable or expression',
        shortcut: ['{{'],
    },
    {
        name: CommandNames.range,
        title: 'Slider',
        description: 'Insert a slider over a range',
        shortcut: ['==x=='],
    },
    {
        name: CommandNames.dynamic,
        title: 'Dynamic Text',
        description: 'Insert dynamic text that acts as an inline slider',
        shortcut: ['<x>'],
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
        shortcut: 'Mod-Alt-0',
    },
    {
        name: CommandNames.heading1,
        title: 'Heading 1',
        description: 'Insert the biggest header',
        shortcut: 'Mod-Alt-1',
    },
    {
        name: CommandNames.heading2,
        title: 'Heading 2',
        description: 'Insert a big header',
        shortcut: 'Mod-Alt-2',
    },
    {
        name: CommandNames.heading3,
        title: 'Heading 3',
        description: 'Insert a medium sized header',
        shortcut: 'Mod-Alt-3',
    },
    {
        name: CommandNames.heading4,
        title: 'Heading 4',
        description: 'Insert a small header',
        shortcut: 'Mod-Alt-4',
    },
    {
        name: CommandNames.heading5,
        title: 'Heading 5',
        description: 'Insert a tiny header',
        shortcut: 'Mod-Alt-5',
    },
    {
        name: CommandNames.heading6,
        title: 'Heading 6',
        description: 'Insert a teensy-tiny header',
        shortcut: 'Mod-Alt-6',
    },
    {
        name: CommandNames.youtube,
        title: 'YouTube',
        description: 'Embed a video',
    },
    {
        name: CommandNames.vimeo,
        title: 'Vimeo',
        description: 'Embed a video',
    },
    {
        name: CommandNames.loom,
        title: 'Loom',
        description: 'Embed a video',
    },
    {
        name: CommandNames.miro,
        title: 'Miro',
        description: 'Embed a Miro board',
    },
    {
        name: CommandNames.iframe,
        title: 'IFrame',
        description: 'Embed an IFrame',
    },
];
//# sourceMappingURL=commands.js.map