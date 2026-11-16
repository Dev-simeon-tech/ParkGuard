import { useEffect } from 'react';

export function useClickOutside(ref: React.RefObject<HTMLElement | null>, callback: () => void) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
}
