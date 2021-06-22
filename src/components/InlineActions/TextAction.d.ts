import React from 'react';
declare type Props = {
    text: string;
    help: string;
    validate: (text: string) => boolean | Promise<boolean>;
    onSubmit: (text: string) => void;
    onCancel: () => void;
};
declare const TextAction: React.FC<Props>;
export default TextAction;
