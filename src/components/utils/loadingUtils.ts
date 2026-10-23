export const setProgress = (setLoading: (value: number) => void) => {
  let percent = 0;
  let interval: number | undefined;
  let settled = false;
  const clearIntervalSafe = () => {
    if (interval !== undefined) window.clearInterval(interval);
    interval = undefined;
  };
  interval = window.setInterval(() => {
    if (percent < 50) {
      percent = Math.min(
        50,
        percent + Math.max(1, Math.round(Math.random() * 5)),
      );
      setLoading(percent);
    } else {
      clearIntervalSafe();
      interval = window.setInterval(() => {
        percent = Math.min(
          92,
          percent + Math.max(1, Math.round(Math.random())),
        );
        setLoading(percent);
        if (percent >= 92) clearIntervalSafe();
      }, 2000);
    }
  }, 100);
  function clear() {
    if (settled) return;
    settled = true;
    clearIntervalSafe();
  }
  function loaded() {
    if (settled) return Promise.resolve(percent);
    clearIntervalSafe();
    return new Promise<number>((resolve) => {
      interval = window.setInterval(() => {
        percent = Math.min(100, percent + 1);
        setLoading(percent);
        if (percent >= 100) {
          settled = true;
          clearIntervalSafe();
          resolve(percent);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
