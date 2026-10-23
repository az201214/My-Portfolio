import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <div className="system-status">
              <span className="status-dot"></span>
              System Status: Online | AI Core Active
            </div>
            <h2>Hello! I'm</h2>
            <h1 className="glitch-name" data-text="ALI ZAIN">
              ALI
              <br />
              <span>ZAIN</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Student Developer &</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Full-Stack</div>
              <div className="landing-h2-2">AI Builder</div>
            </h2>
            <h2>
              <div className="landing-h2-info">AI Builder</div>
              <div className="landing-h2-info-1">Full-Stack</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
