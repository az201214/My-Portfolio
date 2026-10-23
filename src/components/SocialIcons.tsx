import { FaGithub, FaEnvelope } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect, useRef } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const social = sectionRef.current;
    if (
      !social ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const cleanups: (() => void)[] = [];
    social.querySelectorAll<HTMLElement>("span").forEach((item) => {
      const link = item.querySelector<HTMLElement>("a");
      if (!link) return;
      let frame = 0;
      let mouseX = item.clientWidth / 2;
      let mouseY = item.clientHeight / 2;
      let currentX = mouseX;
      let currentY = mouseY;
      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);
        frame = requestAnimationFrame(updatePosition);
      };
      const onMouseMove = (event: MouseEvent) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };
      item.addEventListener("mousemove", onMouseMove, { passive: true });
      frame = requestAnimationFrame(updatePosition);
      cleanups.push(() => {
        item.removeEventListener("mousemove", onMouseMove);
        cancelAnimationFrame(frame);
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" ref={sectionRef}>
        <span>
          <a
            href="https://github.com/az201214"
            target="_blank"
            rel="noreferrer"
            aria-label="Ali Zain on GitHub"
          >
            <FaGithub aria-hidden="true" />
          </a>
        </span>
        <span>
          <a
            href="mailto:energetickids02@gmail.com"
            aria-label="Email Ali Zain"
          >
            <FaEnvelope aria-hidden="true" />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href={`${import.meta.env.BASE_URL}Ali_Zain_Resume.pdf`}
        target="_blank"
        rel="noreferrer"
        aria-label="Open Ali Zain resume PDF"
      >
        <HoverLinks text="RESUME" />
        <span aria-hidden="true">
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
