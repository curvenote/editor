import { Store } from '../src';
import 'codemirror/lib/codemirror.css';
import '../styles/index.scss';
import 'sidenotes/dist/sidenotes.css';
declare global {
    interface Window {
        [index: string]: any;
    }
}
export declare function createStore(): Store;
export declare function DemoEditor({ content, store }: {
    content: string;
    store?: Store;
}): JSX.Element;
