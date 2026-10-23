import { useState, useCallback, useEffect, useRef } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "NexusInsight CRM",
    category: "Built by Ali Zain",
    tools: "TypeScript, Next.js, Supabase, B2B Workspace",
    image: `${import.meta.env.BASE_URL}images/nexus.webp`,
    link: "https://github.com/az201214/nexus-insight-crm",
  },
  {
    title: "Rally",
    category: "Built by Ali Zain",
    tools: "Dart, Flutter, Firebase",
    image: `${import.meta.env.BASE_URL}images/rally.webp`,
    link: "https://github.com/az201214/rally-app",
  },
  {
    title: "FormBridge",
    category: "Built by Ali Zain to simplify scholarship applications",
    tools: "HTML, CSS, JavaScript · Guided checklist, application question helper",
    image: `${import.meta.env.BASE_URL}images/formbridge.webp`,
    link: "https://formbridge-october.vercel.app/",
    linkLabel: "View FormBridge live demo",
  },
  {
    title: "Meetily",
    category: "Open-source contribution",
    tools: "Rust, AI Tooling, Whisper, Ollama",
    image: `${import.meta.env.BASE_URL}images/meetily.webp`,
    link: "https://github.com/az201214/meetily",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimer = useRef<number>();
  useEffect(
    () => () => {
      if (animationTimer.current) window.clearTimeout(animationTimer.current);
    },
    [],
  );
  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentIndex) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      animationTimer.current = window.setTimeout(
        () => setIsAnimating(false),
        500,
      );
    },
    [currentIndex, isAnimating],
  );
  const goToPrev = useCallback(
    () =>
      goToSlide(currentIndex === 0 ? projects.length - 1 : currentIndex - 1),
    [currentIndex, goToSlide],
  );
  const goToNext = useCallback(
    () =>
      goToSlide(currentIndex === projects.length - 1 ? 0 : currentIndex + 1),
    [currentIndex, goToSlide],
  );
  return (
    <section className="work-section" id="work" aria-labelledby="work-heading">
      <div className="work-container section-container">
        <h2 id="work-heading">
          My <span>Work</span>
        </h2>
        <div
          className="carousel-wrapper"
          role="region"
          aria-roledescription="carousel"
          aria-label="Selected projects"
        >
          <p className="carousel-status" aria-live="polite">
            Project {currentIndex + 1} of {projects.length}:{" "}
            {projects[currentIndex].title}
          </p>
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack aria-hidden="true" />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward aria-hidden="true" />
          </button>
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projects.map((project, index) => (
                <div
                  className="carousel-slide"
                  key={project.title}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${projects.length}: ${project.title}`}
                  aria-hidden={index !== currentIndex}
                  ref={(element) => {
                    if (element) element.inert = index !== currentIndex;
                  }}
                >
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">{project.category}</p>
                        <div className="carousel-tools">
                          <span className="tools-label">
                            Tools &amp; Features
                          </span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                        linkLabel={project.linkLabel}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="carousel-dots"
            role="group"
            aria-label="Choose project"
          >
            {projects.map((project, index) => (
              <button
                key={project.title}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-pressed={index === currentIndex}
                aria-label={`Show ${project.title}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Work;
