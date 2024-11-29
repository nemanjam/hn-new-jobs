import { useEffect } from 'react';

import { WEBSITE } from '@/constants/website';

const { scrollPositionSessionStorageKey } = WEBSITE;

// todo: reset on changed page

const useScrollRestoration = () => {
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem(scrollPositionSessionStorageKey, window.scrollY.toString());
    };

    const restoreScrollPosition = () => {
      const position = sessionStorage.getItem(scrollPositionSessionStorageKey);
      if (!position) return;

      window.scrollTo(0, parseInt(position, 10));
    };

    restoreScrollPosition();

    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);
};

export default useScrollRestoration;
