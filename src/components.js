import { register as articleRegister } from '@curvenote/article';
import { register as basicRegister } from '@curvenote/components';
export default function setup(store) {
    basicRegister(store);
    articleRegister(store);
}
//# sourceMappingURL=components.js.map