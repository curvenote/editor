import { useSelector } from 'react-redux';
import { isNodeSelection } from 'prosemirror-utils';
import { getEditorState } from '../../store/state/selectors';
import { getNodeFromSelection } from '../../store/ui/utils';
export function useInlineActionNode(stateId) {
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    if (!selection || !isNodeSelection(selection))
        return null;
    return getNodeFromSelection(selection);
}
//# sourceMappingURL=hooks.js.map