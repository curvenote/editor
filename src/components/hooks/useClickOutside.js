import { useEffect } from 'react';
export default function useClickOutside(ref, callback) {
    function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    }
    useEffect(function () {
        document.addEventListener('click', handleClick);
        return function () {
            document.removeEventListener('click', handleClick);
        };
    });
}
//# sourceMappingURL=useClickOutside.js.map