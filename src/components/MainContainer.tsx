import { PropsWithChildren, useEffect, useRef, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState(
    () => window.innerWidth > 1024,
  );
  const splitCleanup = useRef<(() => void) | undefined>();
  useEffect(() => {
    const rebuild = () => {
      splitCleanup.current?.();
      splitCleanup.current = setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    rebuild();
    window.addEventListener("resize", rebuild);
    return () => {
      window.removeEventListener("resize", rebuild);
      splitCleanup.current?.();
      splitCleanup.current = undefined;
    };
  }, []);
  return (
    <div className="container-main">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="container-main" id="main-content" tabIndex={-1}>
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            <Contact />
          </main>
        </div>
      </div>
    </div>
  );
};
export default MainContainer;
