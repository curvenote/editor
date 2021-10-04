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
import { LanguageNames } from '../../views/types';
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

    dropdownContainer: {
      width: 100,
    },
    popover: {
      overflow: 'visible',
    },
  }),
);

const SUPPORTED_LANGUAGE = [
  { name: LanguageNames.Js, label: 'JavaScript' },
  { name: LanguageNames.Python, label: 'Python' },
  { name: LanguageNames.R, label: 'R' },
  { name: LanguageNames.Ts, label: 'TypeScript' },
  { name: LanguageNames.Jsx, label: 'JSX' },
  { name: LanguageNames.Swift, label: 'Swift' },
  { name: LanguageNames.Php, label: 'PHP' },
  { name: LanguageNames.C, label: 'C' },
  { name: LanguageNames.Cpp, label: 'Cpp' },
  { name: LanguageNames.Csharp, label: 'C#' },
  { name: LanguageNames.ObjC, label: 'Objective-C' },
  { name: LanguageNames.Java, label: 'Java' },
  { name: LanguageNames.Scala, label: 'Scala' },
  { name: LanguageNames.Julia, label: 'Julia' },
  { name: LanguageNames.Html, label: 'HTML' },
  { name: LanguageNames.Sql, label: 'SQL' },
];

const Select = styled(MuiSelect)(() => ({
  root: {
    zIndex: 1302,
  },
  '& .MuiSelect-select': {
    padding: 2,
  },
}));

function LanguageSeletionDropdown({ onChanged }: { onChanged: (lang: string) => void }) {
  const [selectedLanguage, setSelectedLanguage] = React.useState(SUPPORTED_LANGUAGE[0].name);
  return (
    <FormControl fullWidth>
      <Select
        onChange={(e) => {
          const value = e.target.value as LanguageNames;
          setSelectedLanguage(value);
          onChanged(value);
        }}
        value={selectedLanguage}
        MenuProps={{
          className: 'above-modals',
        }}
      >
        {SUPPORTED_LANGUAGE.map(({ name, label }) => (
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
          onChanged={(language) => {
            dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { language }, false));
          }}
        />
      </div>
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default CodeActions;
