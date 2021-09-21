import { useEffect, MutableRefObject } from 'react';

export default function useClickOutside(
  ref: MutableRefObject<Element | null>,
  callback: () => void,
) {
  function handleClick(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
}
