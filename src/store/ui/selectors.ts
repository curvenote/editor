import { State } from "../types";

export function selectedSidenote(state: State, docId?: string | null) {
  if (docId == null) return null;
  return state.sidenotes.ui.docs[docId]?.selectedSidenote;
}

export function isSidenoteSelected(
  state: State,
  docId?: string | null,
  sidenoteId?: string | null
) {
  if (docId == null || sidenoteId == null) return false;
  return state.sidenotes.ui.docs[docId]?.selectedSidenote === sidenoteId;
}

export function sidenoteTop(
  state: State,
  docId?: string | null,
  sidenoteId?: string | null
) {
  if (docId == null || sidenoteId == null) return 0;
  return state.sidenotes.ui.docs[docId]?.sidenotes[sidenoteId]?.top ?? 0;
}

export function isAnchorSelected(
  state: State,
  docId: string | null,
  anchorId: string | null
) {
  if (docId == null || anchorId == null) return false;
  return state.sidenotes.ui.docs[docId]?.selectedAnchor === anchorId;
}
