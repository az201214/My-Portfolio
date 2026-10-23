import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingContext";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (percent < 100) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const completeTimer = window.setTimeout(
      () => setLoaded(true),
      reduced ? 0 : 100,
    );
    const revealTimer = window.setTimeout(
      () => setIsLoaded(true),
      reduced ? 0 : 250,
    );
    return () => {
      window.clearTimeout(completeTimer);
      window.clearTimeout(revealTimer);
    };
  }, [percent]);
  useEffect(() => {
    if (!isLoaded) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const transitionTimer = window.setTimeout(
      () => {
        setClicked(true);
        setIsLoading(false);
      },
      reduced ? 0 : 150,
    );
    return () => window.clearTimeout(transitionTimer);
  }, [isLoaded, setIsLoading]);
  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    target.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }
  const safePercent = Math.min(100, Math.max(0, percent));
  return (
    <>
      <div className="loading-header">
        <a
          href={`${import.meta.env.BASE_URL}#`}
          className="loader-title"
          data-cursor="disable"
        >
          AZ
        </a>
        <div className={`loaderGame ${clicked ? "loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index} />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>
      <div
        className="loading-screen"
        role="status"
        aria-live="polite"
        aria-label={`Loading portfolio ${safePercent}%`}
      >
        <div className="loading-marquee" aria-hidden="true">
          <div className="loading-marquee-track">
            <span> Student Developer</span>
            <span>AI Builder</span>
            <span> Student Developer</span>
            <span>AI Builder</span>
          </div>
        </div>
        <div
          className={`loading-wrap ${clicked ? "loading-clicked" : ""}`}
          onMouseMove={handleMouseMove}
        >
          <div className="loading-hover" />
          <div className={`loading-button ${loaded ? "loading-complete" : ""}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{safePercent}%</span>
                </div>
              </div>
              <div className="loading-box" />
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Loading;
