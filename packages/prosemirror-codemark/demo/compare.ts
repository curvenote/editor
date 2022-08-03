import { InputRule, inputRules } from 'prosemirror-inputrules';
import { MarkType, Schema } from 'prosemirror-model';

// https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/11
function markInputRule(regexp: RegExp, markType: MarkType) {
  return new InputRule(regexp, (state, match, start, end) => {
    const { tr } = state;
    if (state.doc.rangeHasMark(start, end, markType)) {
      return null;
    }
    const mark = markType.create();
    tr.delete(start, end);
    const text = match[1];
    tr.insertText(text);
    tr.addMark(start, start + text.length, mark);
    tr.removeStoredMark(markType);
    return tr;
  });
}

const codeInline = (schema: Schema) => [markInputRule(/`([\W\w]+)`$/, schema.marks.code)];

export function basicPlugin(schema: Schema) {
  return [inputRules({ rules: codeInline(schema) })];
}
