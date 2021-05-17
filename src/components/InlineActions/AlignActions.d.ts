/// <reference types="react" />
import { ActionProps } from './utils';
declare type Props = ActionProps & {
    showCaption?: boolean;
};
declare const AlignActions: {
    (props: Props): JSX.Element | null;
    defaultProps: {
        showCaption: boolean;
    };
};
export default AlignActions;
