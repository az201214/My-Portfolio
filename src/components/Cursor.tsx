import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (
      !cursor ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let hover = false;
    let frame = 0;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    const onMouseMove = (event: MouseEvent) => {
      cursor.style.opacity = "1";
      mousePos.x = event.clientX;
      mousePos.y = event.clientY;
    };
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cursor]"),
    );
    const handlers = targets.map((element) => {
      const enter = () => {
        const rect = element.getBoundingClientRect();
        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
          gsap.to(cursor, {
            x: rect.left,
            y: rect.top,
            duration: 0.1,
            overwrite: true,
          });
        }
        if (element.dataset.cursor === "disable")
          cursor.classList.add("cursor-disable");
      };
      const leave = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };
      element.addEventListener("mouseenter", enter);
      element.addEventListener("mouseleave", leave);
      return { element, enter, leave };
    });
    const loop = () => {
      if (!hover) {
        cursorPos.x += (mousePos.x - cursorPos.x) / 6;
        cursorPos.y += (mousePos.y - cursorPos.y) / 6;
        gsap.set(cursor, { x: cursorPos.x, y: cursorPos.y });
      }
      frame = requestAnimationFrame(loop);
    };
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frame);
      handlers.forEach(({ element, enter, leave }) => {
        element.removeEventListener("mouseenter", enter);
        element.removeEventListener("mouseleave", leave);
      });
      gsap.killTweensOf(cursor);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef} aria-hidden="true" />;
};

export default Cursor;
