import type { Command } from 'prosemirror-state';
import { chainCommands } from 'prosemirror-commands';

export type Keymap = Record<string, Command>;

export type AddKey = (key: string, ...cmds: Command[]) => void;
export type CommandList = Record<string, Command[]>;

export function createBind() {
  const keys: CommandList = {};
  const bind = (key: string, ...cmds: Command[]) => {
    keys[key] = keys[key] ? [...keys[key], ...cmds] : [...cmds];
  };
  return { keys, bind };
}

export function flattenCommandList(keys: CommandList): Keymap {
  return Object.fromEntries(
    Object.entries(keys).map(([o, k]) => {
      if (k.length === 1) return [o, k[0]];
      return [o, chainCommands(...k)];
    }),
  );
}
