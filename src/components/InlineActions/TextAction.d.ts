/// <reference types="react" />
declare type Props = {
    text: string;
    help: string;
    validate: (text: string) => boolean | Promise<boolean>;
    onSubmit: (text: string) => void;
    onCancel: () => void;
};
declare const TextAction: (props: Props) => JSX.Element;
export default TextAction;
