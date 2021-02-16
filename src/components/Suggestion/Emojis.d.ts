import React from 'react';
import { EmojiResult } from '../../store/suggestion/types';
declare type Props = {
    selected: number;
    results: EmojiResult[];
    onClick: (index: number) => void;
    onHover: (index: number) => void;
};
declare const _default: import("react-redux").ConnectedComponent<React.FC<Props>, Pick<Props, never>>;
export default _default;
