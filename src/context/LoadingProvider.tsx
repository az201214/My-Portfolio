import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { LoadingContext, LoadingType } from "./LoadingContext";

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const watchdog = window.setTimeout(() => {
      setLoading((value) => Math.max(value, 100));
    }, 1000);
    return () => window.clearTimeout(watchdog);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    let active = true;
    let cleanup: (() => void) | undefined;
    import("../components/utils/initialFX").then(({ initialFX }) => {
      if (active) cleanup = initialFX();
    });
    return () => {
      active = false;
      cleanup?.();
    };
  }, [isLoading]);

  const value = { isLoading, setIsLoading, setLoading };
  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <div className="main-body">{children}</div>
    </LoadingContext.Provider>
  );
};
