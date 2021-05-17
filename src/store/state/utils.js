import { schemas } from '@curvenote/schema';
export function countState(state) {
    var counts = {
        figures: [],
        equations: [],
        code: [],
        headings: [],
    };
    state.doc.content.descendants(function (node) {
        switch (node.type.name) {
            case schemas.nodeNames.image: {
                var _a = node.attrs, caption = _a.caption, label = _a.label, numbered = _a.numbered;
                if (!numbered || !caption)
                    return false;
                counts.figures.push({ label: label, number: counts.figures.length + 1 });
                return false;
            }
            case schemas.nodeNames.code_block: {
                var label = node.attrs.label;
                counts.code.push({ label: label, number: counts.code.length + 1 });
                return false;
            }
            case schemas.nodeNames.equation: {
                var label = node.attrs.label;
                counts.equations.push({ label: label, number: counts.equations.length + 1 });
                return false;
            }
            case schemas.nodeNames.heading: {
                var _b = node.attrs, label = _b.label, numbered = _b.numbered;
                if (!numbered)
                    return false;
                counts.headings.push({ label: label, number: counts.headings.length + 1 });
                return false;
            }
            case schemas.nodeNames.aside:
            case schemas.nodeNames.callout:
                return true;
            default:
                return false;
        }
    });
    return counts;
}
//# sourceMappingURL=utils.js.map