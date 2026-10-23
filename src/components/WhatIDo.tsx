import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };
  useEffect(() => {
    if (!ScrollTrigger.isTouch) return;
    const containers = containerRef.current.filter(
      (container): container is HTMLDivElement => Boolean(container),
    );
    containers.forEach((container) =>
      container.classList.remove("what-noTouch"),
    );
    return () =>
      containers.forEach((container) =>
        container.classList.add("what-noTouch"),
      );
  }, []);
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    container: HTMLDivElement | null,
  ) => {
    if ((event.key === "Enter" || event.key === " ") && container) {
      event.preventDefault();
      handleClick(container);
    }
  };
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          {[
            {
              title: "AI & AUTOMATION",
              subtitle: "Workflow Intelligence for Organizations",
              text: "AI specialist helping organizations automate workflows—internal ops and customer-facing—so teams ship faster with less manual work.",
              tags: [
                "LLMs & agents",
                "Workflow design",
                "RAG & retrieval",
                "Evals & guardrails",
                "Integrations",
                "Product strategy",
              ],
            },
            {
              title: "BUILD & SCALE",
              subtitle: "Shipping AI in Production",
              text: "I build the systems behind it: APIs, data, voice/real-time, and full-stack products—production-ready, not slide decks.",
              tags: [
                "Node.js",
                "Python",
                "REST & real-time APIs",
                "PostgreSQL",
                "MongoDB",
                "React",
                "Cloud & infra",
              ],
            },
          ].map((item, index) => (
            <div
              className="what-content what-noTouch"
              key={item.title}
              ref={(el) => setRef(el, index)}
              role="button"
              tabIndex={0}
              aria-expanded={false}
              onClick={(event) => handleClick(event.currentTarget)}
              onKeyDown={(event) => onKeyDown(event, event.currentTarget)}
            >
              <div className="what-border1">
                <svg height="100%">
                  <line
                    x1="0"
                    y1={index ? "100%" : "0"}
                    x2="100%"
                    y2={index ? "100%" : "0"}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </svg>
              </div>
              <div className="what-corner" />
              <div className="what-content-in">
                <h3>{item.title}</h3>
                <h4>{item.subtitle}</h4>
                <p>{item.text}</p>
                <h5>Skillset &amp; tools</h5>
                <div className="what-content-flex">
                  {item.tags.map((tag) => (
                    <div className="what-tags" key={tag}>
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="what-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  const active = !container.classList.contains("what-content-active");
  container.classList.toggle("what-content-active", active);
  container.setAttribute("aria-expanded", String(active));
  container.classList.remove("what-sibling");
  Array.from(container.parentElement?.children ?? []).forEach((sibling) => {
    if (sibling !== container) {
      sibling.classList.remove("what-content-active");
      sibling.classList.add("what-sibling");
      sibling.setAttribute("aria-expanded", "false");
    }
  });
}
