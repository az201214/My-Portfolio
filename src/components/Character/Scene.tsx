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
    const progress = setProgress(setLoading);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      progress.clear();
      setLoading(100);
      return;
    }
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.innerWidth > 768,
      });
    } catch (error) {
      console.warn("3D character disabled: WebGL is unavailable", error);
      progress.clear();
      setLoading(100);
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
    const light = setLighting(scene);
    const characterApi = setCharacter(renderer, scene, camera);
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
    document.addEventListener("mousemove", onMouseMove);
    landingDiv?.addEventListener("touchstart", onTouchStart);
    landingDiv?.addEventListener("touchend", onTouchEnd);
    const onResize = () => handleResize(renderer, camera, canvasDiv);
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
      renderer.render(scene, camera);
    };
    animate();
    characterApi
      .loadCharacter()
      .then((gltf) => {
        if (disposed) return;
        if (!gltf) {
          progress.clear();
          setLoading(100);
          return;
        }
        canvasNode.dataset.sceneStatus = "ready";
        const root = gltf.scene;
        if (!root) return;
        headBone = root.getObjectByName("spine006") ?? null;
        screenLight = root.getObjectByName("screenlight") as THREE.Mesh | null;
        animationApi = setAnimations(gltf);
        if (hoverDivRef.current)
          hoverCleanup = animationApi.hover(gltf, hoverDivRef.current);
        progress.loaded().then(() => {
          if (!disposed) {
            light.turnOnLights();
            animationApi?.startIntro();
          }
        });
      })
      .catch((error) => {
        if (!disposed) {
          console.warn("Character unavailable; continuing without 3D", error);
          progress.clear();
          setLoading(100);
        }
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
        <div className="character-rim" />
        <div className="character-hover" ref={hoverDivRef} />
      </div>
    </div>
  );
};
export default Scene;
