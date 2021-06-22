import { v4 as uuid } from 'uuid';
export function createId(prepend) {
    if (prepend === void 0) { prepend = ''; }
    var id = uuid().split('-')[0];
    if (!prepend) {
        return "a" + id.slice(1);
    }
    return prepend + "-" + id;
}
//# sourceMappingURL=utils.js.map