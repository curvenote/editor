import { Schema } from 'prosemirror-model';
import { AppThunk } from '../../types';
import { LinkResult } from '../types';
import { SearchContext } from '../../../connect';
export declare const startingSuggestions: (search: string, create?: boolean) => Promise<LinkResult[]>;
export declare function setSearchContext(searchContext: SearchContext): void;
export declare function chooseSelection(result: LinkResult): AppThunk<boolean>;
export declare function filterResults(schema: Schema, search: string, callback: (results: LinkResult[]) => void): void;
