import { gsap } from "gsap";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return () => undefined;
  const context = gsap.context(() => {
    gsap.from(".landing-intro, .landing-info", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
      clearProps: "opacity,transform",
    });
  });
  return () => context.revert();
}
