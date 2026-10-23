import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

interface AnimatedElement extends HTMLElement {
  anim?: gsap.core.Tween;
  split?: SplitText;
}

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function setSplitText() {
  const paras: NodeListOf<AnimatedElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<AnimatedElement> =
    document.querySelectorAll(".title");
  const splits: SplitText[] = [];
  const animations: gsap.core.Tween[] = [];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.innerWidth < 900 || reduced) {
    [...paras, ...titles].forEach((element) =>
      element.classList.add("visible"),
    );
    return () => undefined;
  }

  const triggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const makeAnimation = (element: AnimatedElement, type: "words" | "chars") => {
    element.split = new SplitText(element, {
      type: type === "words" ? "lines,words" : "chars,lines",
      linesClass: "split-line",
    });
    splits.push(element.split);
    const tween = gsap.fromTo(
      element.split[type],
      type === "words"
        ? { autoAlpha: 0, y: 80 }
        : { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: element.parentElement?.parentElement,
          toggleActions: "play pause resume reverse",
          start: triggerStart,
        },
        duration: type === "words" ? 1 : 0.8,
        ease: type === "words" ? "power3.out" : "power2.inOut",
        y: 0,
        ...(type === "chars" ? { rotate: 0 } : {}),
        stagger: type === "words" ? 0.02 : 0.03,
      },
    );
    element.anim = tween;
    animations.push(tween);
  };
  paras.forEach((element) => {
    element.classList.add("visible");
    makeAnimation(element, "words");
  });
  titles.forEach((element) => makeAnimation(element, "chars"));

  return () => {
    animations.forEach((animation) => {
      animation.scrollTrigger?.kill();
      animation.kill();
    });
    splits.forEach((split) => split.revert());
  };
}
