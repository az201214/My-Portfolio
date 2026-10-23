import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import MainContainer from "./components/MainContainer";

const CharacterModel = lazy(() => import("./components/Character"));

const App = () => {
  const [showCharacter, setShowCharacter] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShowCharacter(!preference.matches);
    const timer = window.setTimeout(update, 100);
    preference.addEventListener("change", update);
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener("change", update);
    };
  }, []);
  return (
    <LoadingProvider>
      <MainContainer>
        {showCharacter && (
          <ErrorBoundary>
            <Suspense fallback={null}>
              <CharacterModel />
            </Suspense>
          </ErrorBoundary>
        )}
      </MainContainer>
    </LoadingProvider>
  );
};
export default App;
