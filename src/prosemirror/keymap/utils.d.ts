import { Command, Keymap } from 'prosemirror-commands';
export declare type AddKey = (key: string, ...cmds: Command[]) => void;
export declare type CommandList = Record<string, Command[]>;
export declare function createBind(): {
    keys: CommandList;
    bind: (key: string, ...cmds: Command[]) => void;
};
export declare function flattenCommandList(keys: CommandList): Keymap;
