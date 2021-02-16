/// <reference types="react" />
declare type Props = {
    viewId: string;
    open: boolean;
    edit: boolean;
    href: string;
    onDelete: null | (() => void);
    onEdit: null | (() => void);
};
declare const LinkToolbar: (props: Props) => JSX.Element | null;
export default LinkToolbar;
