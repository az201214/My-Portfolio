import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4 style={{ fontSize: "2rem", marginBottom: "20px", color: "var(--accentColor)" }}>Have an idea?<br/>Let's build it.</h4>
            <p>
              <a
                href="mailto:energetickids02@gmail.com"
                data-cursor="disable"
              >
                Email — energetickids02@gmail.com
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/az201214"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>


          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Ali Zain</span>
            </h2>
            <h5 style={{ marginTop: "10px" }}>
              Inspired by 3d-portfolio
            </h5>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
