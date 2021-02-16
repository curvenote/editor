import { AppThunk } from '../../types';
import { LinkResult } from '../types';
export declare const startingSuggestions: () => Promise<import("../../../types").CitationFormat[]>;
export declare function chooseSelection(result: LinkResult): AppThunk<boolean>;
export declare function filterResults(search: string, callback: (results: LinkResult[]) => void): void;
