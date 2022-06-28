import type { Command } from 'prosemirror-state';
export declare type Keymap = Record<string, Command>;
export declare type AddKey = (key: string, ...cmds: Command[]) => void;
export declare type CommandList = Record<string, Command[]>;
export declare function createBind(): {
    keys: CommandList;
    bind: (key: string, ...cmds: Command[]) => void;
};
export declare function flattenCommandList(keys: CommandList): Keymap;
