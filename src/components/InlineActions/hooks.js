import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isNodeSelection } from 'prosemirror-utils';
import debounce from 'lodash.debounce';
import { getEditorState } from '../../store/state/selectors';
import { getNodeFromSelection } from '../../store/ui/utils';
export function useInlineActionNode(stateId) {
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    if (!selection || !isNodeSelection(selection))
        return null;
    return getNodeFromSelection(selection);
}
export function usePopper(currentEl) {
    var _a = useState(null), popper = _a[0], setPopper = _a[1];
    var popperRef = useCallback(function (popperInstance) { return setPopper(popperInstance); }, []);
    var updatePopper = useMemo(function () {
        if (!popper)
            return function () { };
        return debounce(function () {
            if (popper && popper.reference.isConnected) {
                popper.update();
            }
        }, 0);
    }, [popper]);
    useEffect(function () {
        if (!currentEl || !updatePopper)
            return function () { };
        updatePopper();
        var observer = new ResizeObserver(function () {
            updatePopper();
        });
        observer.observe(currentEl);
        return function () {
            observer.disconnect();
        };
    }, [currentEl, updatePopper]);
    return [popperRef];
}
//# sourceMappingURL=hooks.js.map