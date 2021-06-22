import { ATTRIBUTES_SHOW_EDITOR } from './types';
export var openAttributeEditor = function (show, pos, dom) {
    return function (dispatch) {
        var location = { top: 0, left: 0 };
        var rect = dom.getBoundingClientRect();
        location.top =
            rect.top < window.innerHeight - 300 - 50 ? rect.bottom + 10 : rect.top - 300 - 10;
        location.left = rect.left;
        dispatch({
            type: ATTRIBUTES_SHOW_EDITOR,
            payload: { show: show, location: location, pos: pos },
        });
    };
};
export function closeAttributeEditor() {
    return {
        type: ATTRIBUTES_SHOW_EDITOR,
        payload: { show: false, location: null, pos: 0 },
    };
}
//# sourceMappingURL=actions.js.map