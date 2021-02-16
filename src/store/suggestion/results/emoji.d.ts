import { AppThunk } from '../../types';
import { EmojiResult } from '../types';
export declare const startingSuggestions: {
    c: string;
    n: string;
    s: string;
    o: string;
}[];
export declare function chooseSelection(result: EmojiResult): AppThunk<boolean>;
export declare function filterResults(search: string, callback: (results: EmojiResult[]) => void): void;
