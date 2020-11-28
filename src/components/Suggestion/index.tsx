import React from 'react';
import { connect } from 'react-redux';
import { State } from '../../store/types';
import EmojiSuggestions from './Emojis';
import CommandSuggestions from './Commands';
import VariableSuggestions from './Variables';
import { SuggestionKind, Location } from '../../store/suggestion/types';
import { selectors } from '../../store';

type Props = {
  open: boolean;
  kind: SuggestionKind | null;
  location: Location | null;
  results: any[];
};

const Suggestion: React.FC<Props> = (props) => {
  const {
    kind, open, location, results,
  } = props;
  if (!open || results.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: location?.bottom,
      left: location?.left,
      minWidth: 300,
      maxHeight: 350,
      overflowY: 'scroll',
      backgroundColor: 'rgba(250, 250, 250, 0.9)',
      boxShadow: '0 0 7px rgba(0, 0, 0, 0.1)',
      border: '1px solid silver',
      backdropFilter: 'blur(2px)',
    }}
    >
      {kind === SuggestionKind.emoji && <EmojiSuggestions />}
      {kind === SuggestionKind.command && <CommandSuggestions />}
      {
        (kind === SuggestionKind.variable || kind === SuggestionKind.display)
        && <VariableSuggestions />
      }
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const {
    open, kind, location, results,
  } = selectors.getSuggestion(state);
  return {
    open,
    kind,
    location,
    results,
  };
};

export default connect(
  mapStateToProps,
)(Suggestion);
