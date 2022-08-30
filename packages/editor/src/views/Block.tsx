import React from 'react';
import { styled, keyframes } from '@stitches/react';
import { violet, mauve, blackA } from '@radix-ui/colors';
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import type { Node } from 'prosemirror-model';
import { render } from 'react-dom';
import type { NodeView, EditorView, Decoration } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import type { GetPos } from './types';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { nodeNames } from '@curvenote/schema';
import classNames from 'classnames';
import { v4 } from 'uuid';

function addBlock(view: EditorView, node: Node, getPos: GetPos, before: boolean) {
  const blockPos = getPos();
  const { state, dispatch } = view;
  const blockNode = state.schema.nodes[nodeNames.block];
  // create a new node before pos
  const paragraph = state.schema.nodes.paragraph.createAndFill({}) as Node;
  const newNode = blockNode.createAndFill({ id: v4() }, [paragraph]) as Node;

  const tr = before
    ? state.tr.insert(blockPos, newNode)
    : state.tr.insert(blockPos + node.content.size + 1, newNode);

  dispatch(tr);

  if (before) {
    const resolvedPos = view.state.tr.doc.resolve(getPos() - 2);
    view.dispatch(view.state.tr.setSelection(new TextSelection(resolvedPos)));
  } else {
    const resolvedPos = view.state.tr.doc.resolve(getPos() + node.content.size + 3);
    view.dispatch(view.state.tr.setSelection(new TextSelection(resolvedPos)));
  }

  view.focus();
}

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const contentStyles = {
  minWidth: 220,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: 5,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
};

const StyledContent = styled(DropdownMenuPrimitive.Content, { ...contentStyles });

const StyledArrow = styled(DropdownMenuPrimitive.Arrow, {
  fill: 'white',
});

function Content({ children, ...props }: any) {
  return (
    <DropdownMenuPrimitive.Portal>
      <StyledContent {...props}>
        {children}
        <StyledArrow />
      </StyledContent>
    </DropdownMenuPrimitive.Portal>
  );
}

const StyledSubContent = styled(DropdownMenuPrimitive.SubContent, { ...contentStyles });

function SubContent(props: any) {
  return (
    <DropdownMenuPrimitive.Portal>
      <StyledSubContent {...props} />
    </DropdownMenuPrimitive.Portal>
  );
}

const itemStyles = {
  all: 'unset',
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 5px',
  position: 'relative',
  paddingLeft: 25,
  userSelect: 'none',

  '&[data-disabled]': {
    color: mauve.mauve8,
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },
};

const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles });
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, { ...itemStyles });
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, { ...itemStyles });
const StyledSubTrigger = styled(DropdownMenuPrimitive.SubTrigger, {
  '&[data-state="open"]': {
    backgroundColor: violet.violet4,
    color: violet.violet11,
  },
  ...itemStyles,
});

const StyledLabel = styled(DropdownMenuPrimitive.Label, {
  paddingLeft: 25,
  fontSize: 12,
  lineHeight: '25px',
  color: mauve.mauve11,
});

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: violet.violet6,
  margin: 5,
});

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Exports
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = Content;
export const DropdownMenuItem = StyledItem;
export const DropdownMenuCheckboxItem = StyledCheckboxItem;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuRadioItem = StyledRadioItem;
export const DropdownMenuItemIndicator = StyledItemIndicator;
export const DropdownMenuLabel = StyledLabel;
export const DropdownMenuSeparator = StyledSeparator;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuSubTrigger = StyledSubTrigger;
export const DropdownMenuSubContent = SubContent;

// Your app...
const Box = styled('div', {});

const RightSlot = styled('div', {
  marginLeft: 'auto',
  paddingLeft: 20,
  color: mauve.mauve11,
  '[data-highlighted] > &': { color: 'white' },
  '[data-disabled] &': { color: mauve.mauve8 },
});

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 35,
  width: 35,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: violet.violet11,
  backgroundColor: 'white',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  '&:hover': { backgroundColor: violet.violet3 },
  '&:focus': { boxShadow: `0 0 0 2px black` },
});

export const DropdownMenuDemo = ({ buttonRef }: { buttonRef: any }) => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');

  return (
    <Box>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label="Customise options" ref={buttonRef}>
            <HamburgerMenuIcon />
          </IconButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={5}>
          <DropdownMenuItem>
            New Tab <RightSlot>⌘+T</RightSlot>
          </DropdownMenuItem>
          <DropdownMenuItem>
            New Window <RightSlot>⌘+N</RightSlot>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            New Private Window <RightSlot>⇧+⌘+N</RightSlot>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              More Tools
              <RightSlot>
                <ChevronRightIcon />
              </RightSlot>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={2} alignOffset={-5}>
              <DropdownMenuItem>
                Save Page As… <RightSlot>⌘+S</RightSlot>
              </DropdownMenuItem>
              <DropdownMenuItem>Create Shortcut…</DropdownMenuItem>
              <DropdownMenuItem>Name Window…</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Developer Tools</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            <DropdownMenuItemIndicator>
              <CheckIcon />
            </DropdownMenuItemIndicator>
            Show Bookmarks <RightSlot>⌘+B</RightSlot>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={urlsChecked} onCheckedChange={setUrlsChecked}>
            <DropdownMenuItemIndicator>
              <CheckIcon />
            </DropdownMenuItemIndicator>
            Show Full URLs
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>People</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={person} onValueChange={setPerson}>
            <DropdownMenuRadioItem value="pedro">
              <DropdownMenuItemIndicator>
                <DotFilledIcon />
              </DropdownMenuItemIndicator>
              Pedro Duarte
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="colm">
              <DropdownMenuItemIndicator>
                <DotFilledIcon />
              </DropdownMenuItemIndicator>
              Colm Tuite
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};

function BlockControlMenu({ buttonRef }: { buttonRef: React.RefObject<HTMLButtonElement> }) {
  return (
    <div>
      <DropdownMenuDemo buttonRef={buttonRef} />
    </div>
  );
}

type Props = {
  view: EditorView;
  node: Node;
  getPos: GetPos;
  selected?: boolean;
  ref: React.RefObject<HTMLButtonElement>;
};

function FancyControl({ view, node, getPos, selected, ref }: Props) {
  return (
    <div
      className={classNames('block-controls', {
        'selected-block-control': selected,
      })}
    >
      <button
        onClick={() => {
          addBlock(view, node, getPos, true);
        }}
      >
        +
      </button>
      <BlockControlMenu buttonRef={ref} />
      <button
        onClick={() => {
          addBlock(view, node, getPos, false);
        }}
      >
        +
      </button>
    </div>
  );
}

function FancyBlockControls({ view, node, getPos, selected, ref }: Props) {
  // console.log('we be rendering', { view, node, getPos, selected });
  return (
    // <Provider store={ref.store()}> we bring this back if needed
    <FancyControl view={view} node={node} getPos={getPos} selected={selected} ref={ref} />
    // </Provider>
  );
}

function isSelected(decorations: readonly Decoration[]) {
  return !!decorations.find((deco) => {
    return (deco as any).type.attrs.selected === 'true'; // decorations here has type passed from selected decoration
  });
}

class BlockNodeView implements NodeView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLDivElement;
  contentDOM: HTMLDivElement;
  blockControls: HTMLDivElement;

  node: Node;

  view: EditorView;

  getPos: GetPos;

  dotMenuToggleBtn = React.createRef<HTMLButtonElement>();

  constructor(node: Node, view: EditorView, getPos: GetPos, decorations: readonly Decoration[]) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');
    this.dom.setAttribute('id', node.attrs.id);

    const selected = isSelected(decorations);

    console.log('create new ', node.attrs.id);
    const blockControls = document.createElement('div');
    this.blockControls = blockControls;
    blockControls.setAttribute('contenteditable', 'false');

    this.renderFansyBlockControls(node, selected);
    this.dom.appendChild(blockControls);

    const contentContainer = document.createElement('div');
    this.dom.appendChild(contentContainer);

    this.dom.classList.add('block-node-view');
    this.contentDOM = contentContainer; // tells prosemirror to render children here
  }

  deselectNode() {
    if (!isEditable(this.view.state) || !this.getPos) return;
    this.dom.classList.remove('ProseMirror-selectednode');
  }

  renderFansyBlockControls(node: Node, selected?: boolean) {
    render(
      <FancyBlockControls
        view={this.view}
        node={node}
        getPos={this.getPos}
        ref={this.dotMenuToggleBtn}
        selected={selected}
      />,
      this.blockControls,
    );
  }

  update(node: Node, decorations: readonly any[]) {
    console.log('update', node.attrs.id);
    if (!this.view || !this.getPos) return false;
    if (decorations.length === 0) {
      this.renderFansyBlockControls(node);
      return true;
    }

    const selected = isSelected(decorations);

    this.renderFansyBlockControls(node, selected);
    return true;
  }

  selectNode() {
    if (!isEditable(this.view.state) || !this.getPos) return;
    this.dom.classList.add('ProseMirror-selectednode');
  }

  ignoreMutation(mutation: MutationRecord) {
    return mutation.target !== this.dotMenuToggleBtn.current;
  }
}

export function createTopBlockView(
  node: Node,
  view: EditorView,
  getPos: GetPos,
  decorations: readonly Decoration[],
) {
  return new BlockNodeView(node, view, getPos, decorations);
}
