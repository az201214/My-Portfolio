import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { eyebrowBoneNames, typingBoneNames } from "../../../data/boneData";

const setAnimations = (gltf: GLTF) => {
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const timers: number[] = [];
  const introClip = gltf.animations.find(
    (clip) => clip.name === "introAnimation",
  );
  if (introClip) {
    const action = mixer.clipAction(introClip);
    action.clampWhenFinished = true;
    action.setLoop(THREE.LoopOnce, 1).play();
  }
  ["key1", "key2", "key5", "key6"].forEach((name) => {
    const clip = THREE.AnimationClip.findByName(gltf.animations, name);
    if (clip) {
      const action = mixer.clipAction(clip);
      action.timeScale = 1.2;
      action.play();
    }
  });
  const typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
  if (typingAction) {
    typingAction.enabled = true;
    typingAction.timeScale = 1.2;
    typingAction.play();
  }
  function startIntro() {
    if (!introClip) return;
    mixer.clipAction(introClip).reset().setLoop(THREE.LoopOnce, 1).play();
    const timer = window.setTimeout(() => {
      const blink = THREE.AnimationClip.findByName(gltf.animations, "Blink");
      if (blink) mixer.clipAction(blink).fadeIn(0.5).play();
    }, 2500);
    timers.push(timer);
  }
  // Reduced motion: hold the intro's final frame and never advance the mixer.
  function showStillPose() {
    if (introClip) {
      const action = mixer.clipAction(introClip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.time = introClip.duration;
      action.play();
    }
    mixer.update(0);
  }
  function hover(_gltf: GLTF, hoverDiv: HTMLDivElement) {
    const eyebrow = createBoneAction(gltf, mixer, "browup", eyebrowBoneNames);
    let hovering = false;
    if (eyebrow) {
      eyebrow.setLoop(THREE.LoopOnce, 1);
      eyebrow.clampWhenFinished = true;
    }
    const onEnter = () => {
      if (eyebrow && !hovering) {
        hovering = true;
        eyebrow.reset().setEffectiveWeight(4).fadeIn(0.5).play();
      }
    };
    const onLeave = () => {
      if (eyebrow && hovering) {
        hovering = false;
        eyebrow.fadeOut(0.6);
      }
    };
    hoverDiv.addEventListener("mouseenter", onEnter);
    hoverDiv.addEventListener("mouseleave", onLeave);
    return () => {
      hoverDiv.removeEventListener("mouseenter", onEnter);
      hoverDiv.removeEventListener("mouseleave", onLeave);
    };
  }
  return {
    mixer,
    startIntro,
    showStillPose,
    hover,
    dispose: () => {
      timers.forEach(window.clearTimeout);
      mixer.stopAllAction();
      mixer.uncacheRoot(gltf.scene);
    },
  };
};
const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clipName: string,
  boneNames: string[],
) => {
  const clip = THREE.AnimationClip.findByName(gltf.animations, clipName);
  return clip
    ? mixer.clipAction(
        new THREE.AnimationClip(
          `${clip.name}_filtered`,
          clip.duration,
          clip.tracks.filter((track) =>
            boneNames.some((name) => track.name.includes(name)),
          ),
        ),
      )
    : null;
};
export default setAnimations;
