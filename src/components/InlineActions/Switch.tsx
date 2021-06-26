import React from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import { State } from '../../store/types';
import { SelectionKinds as Kinds } from '../../store/ui/types';
import {
  getEditorUIStateAndViewIds,
  getInlineActionAnchorEl,
  getInlineActionKind,
} from '../../store/ui/selectors';
import LinkActions from './LinkActions';
import AlignActions from './AlignActions';
import CalloutActions from './CalloutActions';
import TimeActions from './TimeActions';
import HeadingActions from './HeadingActions';
import EquationActions from './EquationActions';

export function useInlineActionProps() {
  const { stateId, viewId } = useSelector(
    (state: State) => getEditorUIStateAndViewIds(state),
    isEqual,
  );
  const kind = useSelector((state: State) => getInlineActionKind(state));
  const anchorEl = useSelector((state: State) => getInlineActionAnchorEl(state));
  return {
    stateId,
    viewId,
    kind,
    anchorEl,
  };
}

const InlineActionSwitch: React.FC = () => {
  const { stateId, viewId, kind, anchorEl } = useInlineActionProps();
  return (
    <>
      {kind === Kinds.link && <LinkActions {...{ stateId, viewId, anchorEl }} />}
      {kind === Kinds.image && <AlignActions showCaption {...{ stateId, viewId, anchorEl }} />}
      {kind === Kinds.iframe && <AlignActions {...{ stateId, viewId, anchorEl }} />}
      {kind === Kinds.callout && <CalloutActions {...{ stateId, viewId, anchorEl }} />}
      {kind === Kinds.heading && <HeadingActions {...{ stateId, viewId, anchorEl }} />}
      {/* {kind === Kinds.math && <AlignActions view={view} />} */}
      {kind === Kinds.equation && <EquationActions {...{ stateId, viewId, anchorEl }} />}
      {kind === Kinds.time && <TimeActions {...{ stateId, viewId, anchorEl }} />}
    </>
  );
};

export default InlineActionSwitch;
