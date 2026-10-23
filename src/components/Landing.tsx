import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => (
  <section
    className="landing-section"
    id="landingDiv"
    aria-labelledby="intro-heading"
  >
    <div className="landing-container">
      <div className="landing-intro">
        <div className="system-status">
          <span className="status-dot" aria-hidden="true" />
          Student developer
        </div>
        <p className="landing-greeting">Hello, I’m</p>
        <h1 id="intro-heading">
          ALI
          <br />
          <span>ZAIN</span>
        </h1>
      </div>
      <div className="landing-info">
        <h2 className="landing-title">
          Full-stack.
          <br />
          <span>AI builder.</span>
        </h2>
        <p className="landing-description">
          I turn ideas into web, mobile, and AI-powered products.
        </p>
        <div className="landing-actions">
          <a className="hero-primary" href="#work">
            Explore my work <span aria-hidden="true">↗</span>
          </a>
          <a href="#contact">Let’s connect</a>
        </div>
      </div>
    </div>
    {children}
  </section>
);
export default Landing;
