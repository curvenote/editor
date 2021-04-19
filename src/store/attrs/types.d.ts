export declare const ATTRIBUTES_SHOW_EDITOR = "ATTRIBUTES_SHOW_EDITOR";
export declare type AttributesState = {
    show: boolean;
    pos: number;
    location: {
        top: number;
        left: number;
    } | null;
};
export declare type AttributesSetEditing = {
    type: typeof ATTRIBUTES_SHOW_EDITOR;
    payload: {
        show: boolean;
        location: AttributesState['location'];
        pos: number;
    };
};
export declare type AttributesActionTypes = AttributesSetEditing;
