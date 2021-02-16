import { AttributesActionTypes } from './types';
import { AppThunk } from '../types';
export declare const openAttributeEditor: (show: boolean, pos: number, dom: Element) => AppThunk<void>;
export declare function closeAttributeEditor(): AttributesActionTypes;
