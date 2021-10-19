import React from 'react';
import {
  FormControl,
  Select as MuiSelect,
  MenuItem,
  styled,
  makeStyles,
  createStyles,
  Grid,
} from '@material-ui/core';
import { findParentNode } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';
import { nodeNames } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageNames, SUPPORTED_LANGUAGES } from '../../views/types';
import MenuIcon from '../Menu/Icon';
import { deleteNode } from '../../store/actions';
import { updateNodeAttrs } from '../../store/actions/editor';
import { getEditorState } from '../../store/state/selectors';
import { Dispatch, State } from '../../store';
import { ActionProps, positionPopper } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'fit-content',
      paddingLeft: '0.5rem',
      fontSize: 20,
      flexWrap: 'nowrap',
    },
    menulist: {
      maxHeight: '15rem',
    },
    dropdownContainer: {
      width: 100,
    },
    popover: {
      overflow: 'visible',
    },
  }),
);

const Select = styled(MuiSelect)(() => ({
  root: {
    zIndex: 1302,
  },
  '& .MuiSelect-select': {
    padding: 2,
  },
}));

function LanguageSeletionDropdown({
  value,
  onChanged,
}: {
  onChanged: (lang: string) => void;
  value: LanguageNames;
}) {
  const classes = useStyles();
  return (
    <FormControl fullWidth>
      <Select
        disableUnderline
        onChange={(e) => {
          onChanged(e.target.value as LanguageNames);
        }}
        value={value || SUPPORTED_LANGUAGES[0].name}
        MenuProps={{
          className: 'above-modals',
          MenuListProps: {
            className: classes.menulist,
          },
        }}
      >
        {SUPPORTED_LANGUAGES.map(({ name, label }) => (
          <MenuItem key={name} value={name}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

const CodeActions: React.FC<ActionProps> = (props) => {
  const { stateId, viewId } = props;
  const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();

  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  const parent =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.code_block)(selection);
  const node = parent?.node ?? getNodeFromSelection(selection);
  const pos = parent?.pos ?? selection?.from;

  if (!node || pos == null) return null;
  positionPopper();

  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));
  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <div className={classes.dropdownContainer}>
        <LanguageSeletionDropdown
          value={node.attrs.language}
          onChanged={(language) => {
            dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { language }, false));
          }}
        />
      </div>

      <MenuIcon kind="divider" />
      <MenuIcon
        kind="lineNumber"
        onClick={() => {
          dispatch(
            updateNodeAttrs(
              stateId,
              viewId,
              { node, pos },
              { linenumber: !node.attrs.linenumber },
              false,
            ),
          );
        }}
        active={node.attrs.linenumber}
      />

      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default CodeActions;
