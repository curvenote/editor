import React from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import { State } from '../../store/types';
import { SelectionKinds as Kinds } from '../../store/ui/types';
import { getEditorUIStateAndViewIds, getInlineActionKind } from '../../store/ui/selectors';
import LinkActions from './LinkActions';
import AlignActions from './AlignActions';
import CalloutActions from './CalloutActions';
import TimeActions from './TimeActions';
import HeadingActions from './HeadingActions';
import EquationActions from './EquationActions';
import TableActions from './TableActions';
import CodeActions from './CodeActions';

export function useInlineActionProps() {
  const { stateId, viewId } = useSelector(
    (state: State) => getEditorUIStateAndViewIds(state),
    isEqual,
  );
  const kind = useSelector((state: State) => getInlineActionKind(state));
  return {
    stateId,
    viewId,
    kind,
  };
}

const InlineActionSwitch: React.FC = () => {
  const { stateId, viewId, kind } = useInlineActionProps();
  return (
    <>
      {kind === Kinds.link && <LinkActions {...{ stateId, viewId }} />}
      {kind === Kinds.image && <AlignActions showCaption {...{ stateId, viewId }} />}
      {kind === Kinds.iframe && <AlignActions {...{ stateId, viewId }} />}
      {kind === Kinds.callout && <CalloutActions {...{ stateId, viewId }} />}
      {kind === Kinds.heading && <HeadingActions {...{ stateId, viewId }} />}
      {/* {kind === Kinds.math && <AlignActions view={view} />} */}
      {kind === Kinds.equation && <EquationActions {...{ stateId, viewId }} />}
      {kind === Kinds.time && <TimeActions {...{ stateId, viewId }} />}
      {kind === Kinds.table && <TableActions {...{ stateId, viewId }} />}
      {kind === Kinds.code && <CodeActions stateId={stateId} viewId={viewId} />}
    </>
  );
};

export default InlineActionSwitch;
