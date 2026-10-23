import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";

const Navbar = () => (
  <>
    <nav className="header" aria-label="Primary navigation">
      <a
        href={`${import.meta.env.BASE_URL}#`}
        className="navbar-title"
        data-cursor="disable"
      >
        AZ
      </a>
      <a
        href="mailto:energetickids02@gmail.com"
        className="navbar-connect"
        data-cursor="disable"
      >
        energetickids02@gmail.com
      </a>
      <ul>
        <li>
          <a href="#about">
            <HoverLinks text="ABOUT" />
          </a>
        </li>
        <li>
          <a href="#work">
            <HoverLinks text="WORK" />
          </a>
        </li>
        <li>
          <a href="#contact">
            <HoverLinks text="CONTACT" />
          </a>
        </li>
      </ul>
    </nav>
    <div className="landing-circle1" aria-hidden="true" />
    <div className="landing-circle2" aria-hidden="true" />
    <div className="nav-fade" aria-hidden="true" />
  </>
);

export default Navbar;
