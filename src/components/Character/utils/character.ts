import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import {
  setCharTimeline,
  setAllTimeline,
  TimelineCleanup,
} from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

type CharacterOptions = {
  /** Scroll-linked choreography is motion; reduced-motion visitors get a still model. */
  animate: boolean;
};

const setCharacter = (
  _renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  options: CharacterOptions = { animate: true },
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  loader.setDRACOLoader(dracoLoader);
  let disposed = false;
  const timelineCleanups: TimelineCleanup[] = [];

  // Resolves with the character model or rejects; it never resolves empty,
  // so callers always have a real model or a real error to report.
  const loadCharacter = () =>
    new Promise<GLTF>((resolve, reject) => {
      decryptFile(
        `${import.meta.env.BASE_URL}models/character.enc?v=2`,
        "MyCharacter12",
      )
        .then((data) => {
          if (disposed) {
            reject(new Error("Character load cancelled"));
            return;
          }
          const blobUrl = URL.createObjectURL(new Blob([data]));
          loader.load(
            blobUrl,
            (gltf) => {
              URL.revokeObjectURL(blobUrl);
              if (disposed) {
                disposeObject(gltf.scene);
                reject(new Error("Character load cancelled"));
                return;
              }
              try {
                gltf.scene.traverse((child) => {
                  const mesh = child as THREE.Mesh;
                  if (!mesh.isMesh) return;
                  if (mesh.name === "BODY.SHIRT" || mesh.name === "Pant") {
                    const mat = (
                      mesh.material as THREE.Material
                    ).clone() as THREE.MeshStandardMaterial;
                    mat.color.set(
                      mesh.name === "BODY.SHIRT" ? "#8B4513" : "#000000",
                    );
                    mesh.material = mat;
                  }
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;
                });
                for (const name of ["footR", "footL"]) {
                  const foot = gltf.scene.getObjectByName(name);
                  if (foot) foot.position.y = 3.36;
                }
                scene.add(gltf.scene);
                scene.add(gltf.scene);
                if (options.animate) {
                  timelineCleanups.push(
                    setCharTimeline(gltf.scene, camera),
                    setAllTimeline(),
                  );
                } else {
                  hideScrollProps(gltf.scene);
                }
                resolve(gltf);
              } catch (error) {
                disposeObject(gltf.scene);
                reject(error);
              }
              dracoLoader.dispose();
            },
            undefined,
            (error) => {
              URL.revokeObjectURL(blobUrl);
              reject(error);
            },
          );
        })
        .catch(reject);
    });
  return {
    loadCharacter,
    dispose: () => {
      disposed = true;
      timelineCleanups.splice(0).forEach((cleanup) => cleanup());
      dracoLoader.dispose();
    },
  };
};

/** The scroll timeline normally fades in the monitor and screen light; without it
 *  they must stay transparent, as they are in the landing pose. */
function hideScrollProps(root: THREE.Object3D) {
  root.traverse((object) => {
    if (object.name === "Plane004") {
      object.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as
          | THREE.MeshStandardMaterial
          | undefined;
        if (!mat) return;
        mat.transparent = true;
        mat.opacity = 0;
      });
    }
    if (object.name === "screenlight") {
      const mat = (object as THREE.Mesh).material as
        | THREE.MeshStandardMaterial
        | undefined;
      if (!mat) return;
      mat.transparent = true;
      mat.opacity = 0;
    }
  });
}

export function disposeObject(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
}
export default setCharacter;
