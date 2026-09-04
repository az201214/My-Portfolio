import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Tech Stack <span>&</span>
          <br /> Skills
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Frontend & Mobile</h4>
              </div>
            </div>
            <p>TypeScript, JavaScript, React, Next.js, Flutter / Dart, Three.js / R3F, GSAP</p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Backend & Cloud</h4>
              </div>
            </div>
            <p>Node.js, Supabase, Firebase, Rust, Testing & QA</p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI, Automation & Marketing</h4>
              </div>
            </div>
            <p>AI / LLM Integration, Ollama / Whisper, Automation, Meta Ads</p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Design & Tools</h4>
              </div>
            </div>
            <p>UI/UX, Responsive Design, Git / GitHub, VS Code</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
