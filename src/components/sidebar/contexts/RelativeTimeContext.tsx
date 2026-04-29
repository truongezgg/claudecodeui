import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const RelativeTimeContext = createContext<Date>(new Date());

export function RelativeTimeProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return <RelativeTimeContext.Provider value={now}>{children}</RelativeTimeContext.Provider>;
}

export function useRelativeTime(): Date {
  return useContext(RelativeTimeContext);
}
