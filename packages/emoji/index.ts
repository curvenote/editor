import emojis_untyped from './data.json';

type Entry = { c: string; n: string; s: string; o: string };

const emojis: { default: Entry[]; emoji: Entry[] } = emojis_untyped;

export default emojis;
