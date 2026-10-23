import { lazy, Suspense } from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import MainContainer from "./components/MainContainer";
import CharacterStill from "./components/Character/CharacterStill";

const CharacterModel = lazy(() => import("./components/Character"));

// The character is always part of the page. Reduced-motion visitors get a still
// render of the model from the Scene itself; the static image covers loading
// and any failure, so the character is never simply absent.
const App = () => (
  <LoadingProvider>
    <MainContainer>
      <ErrorBoundary fallback={<CharacterStill />}>
        <Suspense fallback={<CharacterStill />}>
          <CharacterModel />
        </Suspense>
      </ErrorBoundary>
    </MainContainer>
  </LoadingProvider>
);
export default App;
