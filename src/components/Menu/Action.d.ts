import React from 'react';
declare const icons: {
    math: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    code: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    hr: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    youtube: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    video: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    iframe: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    link: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
    table: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core").SvgIconTypeMap<{}, "svg">>;
};
export declare type IconTypes = keyof typeof icons;
export declare type MenuActionProps = {
    kind?: IconTypes;
    title?: string | React.ReactNode;
    children?: React.ReactNode;
    action?: () => void;
    disabled?: boolean;
    selected?: boolean;
};
declare const MenuAction: React.FC<MenuActionProps>;
export default MenuAction;
