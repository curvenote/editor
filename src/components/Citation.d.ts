/// <reference types="react" />
import { CitationFormat } from '../types';
export declare const useCitation: (uid: string) => {
    loading: boolean;
    json: CitationFormat | null;
    inline: string | null;
    error: boolean;
};
declare type Props = {
    uid: string;
};
declare const Citation: (props: Props) => JSX.Element;
export default Citation;
