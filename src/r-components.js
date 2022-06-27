import { register as basicRegister } from '@curvenote/components';
var isSetup = false;
export default function setup(store) {
    if (isSetup)
        return;
    basicRegister(store);
    isSetup = true;
}
//# sourceMappingURL=r-components.js.map