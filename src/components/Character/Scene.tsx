import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter, { disposeObject } from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingContext";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../utils/loadingUtils";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();
  useEffect(() => {
    const canvasNode = canvasDiv.current;
    if (!canvasNode) return;
    // Reduced motion keeps the character on screen as a still pose: no loader,
    // no mouse tracking, no idle or intro animation, no scroll choreography,
    // and no continuous render loop (the model is drawn once and on resize).
    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const progress = setProgress(setLoading);
    if (reducedMotion) progress.clear();
    // A static character scrolls away with the hero instead of staying pinned.
    canvasNode.classList.toggle("character-static", reducedMotion);
    // The static image in the markup stays visible unless the live model is ready.
    const showStill = (reason: string, error: unknown) => {
      console.error(
        `3D character unavailable (${reason}); showing the static image.`,
        error,
      );
      canvasNode.dataset.sceneStatus = "still";
      progress.clear();
      setLoading(100);
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.innerWidth > 768,
      });
    } catch (error) {
      showStill("WebGL", error);
      return;
    }
    let disposed = false,
      frame = 0,
      debounce: number | undefined;
    const scene = new THREE.Scene();
    const rect = canvasNode.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    canvasNode.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(
      14.5,
      rect.width / Math.max(rect.height, 1),
      0.1,
      1000,
    );
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();
    const renderFrame = () => renderer.render(scene, camera);
    const light = setLighting(scene, () => {
      if (reducedMotion && !disposed) renderFrame();
    });
    const characterApi = setCharacter(renderer, scene, camera, {
      animate: !reducedMotion,
    });
    let hoverCleanup: (() => void) | undefined;
    let animationApi: ReturnType<typeof setAnimations> | undefined;
    const clock = new THREE.Clock();
    let mouse = { x: 0, y: 0 },
      interpolation = { x: 0.1, y: 0.2 },
      headBone: THREE.Object3D | null = null,
      screenLight: THREE.Mesh | null = null;
    const onMouseMove = (event: MouseEvent) =>
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    const onTouchMove = (event: TouchEvent) =>
      handleTouchMove(event, (x, y) => {
        mouse = { x, y };
      });
    const onTouchStart = () => {
      debounce = window.setTimeout(
        () => canvasNode.addEventListener("touchmove", onTouchMove),
        200,
      );
    };
    const onTouchEnd = () =>
      handleTouchEnd((x, y, ix, iy) => {
        if (!disposed) {
          mouse = { x, y };
          interpolation = { x: ix, y: iy };
        }
      });
    const landingDiv = document.getElementById("landingDiv");
    if (!reducedMotion) {
      document.addEventListener("mousemove", onMouseMove);
      landingDiv?.addEventListener("touchstart", onTouchStart);
      landingDiv?.addEventListener("touchend", onTouchEnd);
    }
    const onResize = () => {
      handleResize(renderer, camera, canvasDiv);
      // A resize clears the canvas, so a still model must be drawn again.
      if (reducedMotion) renderFrame();
    };
    window.addEventListener("resize", onResize);
    const animate = () => {
      if (disposed) return;
      frame = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp,
        );
        light.setPointLight(screenLight);
      }
      animationApi?.mixer.update(clock.getDelta());
      renderFrame();
    };
    // Reduced motion never starts the frame loop; it draws once the model is ready.
    if (!reducedMotion) animate();
    characterApi
      .loadCharacter()
      .then((gltf) => {
        if (disposed) return;
        headBone = gltf.scene.getObjectByName("spine006") ?? null;
        screenLight = gltf.scene.getObjectByName(
          "screenlight",
        ) as THREE.Mesh | null;
        animationApi = setAnimations(gltf);
        if (reducedMotion) {
          animationApi.showStillPose();
        } else if (hoverDivRef.current) {
          hoverCleanup = animationApi.hover(gltf, hoverDivRef.current);
        }
        canvasNode.dataset.sceneStatus = "ready";
        if (reducedMotion) {
          light.turnOnLights(true);
          onResize();
        } else {
          onResize();
          progress.loaded().then(() => {
            if (!disposed) {
              light.turnOnLights();
              animationApi?.startIntro();
            }
          });
        }
      })
      .catch((error: unknown) => {
        if (!disposed) showStill("model", error);
      });
    return () => {
      disposed = true;
      progress.clear();
      cancelAnimationFrame(frame);
      clearTimeout(debounce);
      canvasNode.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mousemove", onMouseMove);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      hoverCleanup?.();
      animationApi?.dispose();
      characterApi.dispose();
      light.dispose();
      disposeObject(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === canvasNode)
        canvasNode.removeChild(renderer.domElement);
    };
  }, [setLoading]);
  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <img
          className="character-still"
          src={`${import.meta.env.BASE_URL}images/character-still.webp`}
          alt=""
          decoding="async"
        />
        <div className="character-rim" />
        <div className="character-hover" ref={hoverDivRef} />
      </div>
    </div>
  );
};
export default Scene;
