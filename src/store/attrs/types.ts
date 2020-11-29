export const ATTRIBUTES_SHOW_EDITOR = 'ATTRIBUTES_SHOW_EDITOR';

export type AttributesState = {
  showAttributeEditor: boolean;
  attributePos: {top: number; left: number};
};

interface AttributesSetEditing {
  type: typeof ATTRIBUTES_SHOW_EDITOR;
  payload: {
    show: boolean;
    dom: Element | null;
  };
}

export type AttributesActionTypes = AttributesSetEditing;
