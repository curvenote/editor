import React from 'react';
declare const icons: {
    math: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    code: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    hr: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    youtube: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    video: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    iframe: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    link: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
};
export declare type IconTypes = keyof typeof icons;
export declare type MenuActionProps = {
    kind: IconTypes;
    title?: string | React.ReactNode;
    action?: (() => void) | null;
    disabled?: boolean;
};
export declare const Action: {
    (props: MenuActionProps): JSX.Element;
    defaultProps: {
        title: string;
        action: () => null;
        disabled: boolean;
    };
};
export default Action;
