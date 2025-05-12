import React, {useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ThreeJsPreviewProps {
  color: string;
  text?: string;
  image?: string;
}

const ThreeJsPreview: React.FC<ThreeJsPreviewProps> = ({
  color,
  text,
  image,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const modelRef = useRef<THREE.Object3D>();
  const [is3DView, setIs3DView] = useState(false);
 useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'q') {
        setIs3DView(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Add loading feedback
    const loadingDiv = document.createElement("div");
    loadingDiv.style.position = "absolute";
    loadingDiv.style.top = "50%";
    loadingDiv.style.left = "50%";
    loadingDiv.style.transform = "translate(-50%, -50%)";
    loadingDiv.style.color = "#666";
    loadingDiv.textContent = "Loading 3D Model...";
    mountRef.current.appendChild(loadingDiv);

    // Error handling function
    const handleLoadError = (error: any, type: string) => {
      console.error(`Error loading ${type}:`, error);
      if (mountRef.current) {
        loadingDiv.textContent = `Error loading ${type}. Please check console for details.`;
        loadingDiv.style.color = "red";
      }
    };

    // Success handling function
    const handleLoadSuccess = () => {
      if (mountRef.current && loadingDiv.parentNode) {
        loadingDiv.parentNode.removeChild(loadingDiv);
      }
    };

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      20, // Reduced FOV for better perspective
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3); // Moved camera even closer
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio); // Added for better quality
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Lighting setup with enhanced brightness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
    backLight.position.set(-1, 1, -1);
    scene.add(backLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
    frontLight.position.set(0, 0, 2);
    scene.add(frontLight);

    // Remove grid helper for cleaner view
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Load 3D model
    const mtlLoader = new MTLLoader();
    const loadSimpleModel = () => {
      const objLoader = new OBJLoader();
      objLoader.load(
        "/assets/models/Male_Tshirt.obj",
        (object) => {
          modelRef.current = object;
          scene.add(object);

          // Center and scale the model
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          object.position.sub(center);

          // Scale the model to fit the view
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 8 / maxDim; // Further increased scale for better visibility
          object.scale.multiplyScalar(scale);

          // Update material color
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(color.toLowerCase()),
                shininess: 30,
                side: THREE.DoubleSide, // Render both sides of faces
              });
            }
          });

          handleLoadSuccess();
        },
        undefined,
        (error) => {
          console.error("Error loading Simple T-shirt model:", error);
          handleLoadError(error, "Simple T-shirt model");
        }
      );
    };

    mtlLoader.load(
      "/assets/models/Male_Tshirt.mtl",
      (materials) => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
          "/assets/models/Male_Tshirt.obj",
          (object) => {
            modelRef.current = object;
            scene.add(object);

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);

            // Scale the model to fit the view
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim; // Increased scale for better visibility
            object.scale.multiplyScalar(scale);
            object.rotation.x = Math.PI * 0.1; // Slight tilt for better view

            // Update material color
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({
                  color: new THREE.Color(color.toLowerCase()),
                  shininess: 30,
                  side: THREE.DoubleSide,
                  flatShading: false,
                  transparent: false,
                  opacity: 1.0,
                });
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            handleLoadSuccess();
          },
          undefined,
          (error) => {
            console.error("Error loading OBJ file:", error);
            loadSimpleModel(); // Try loading the simple model as fallback
          }
        );
      },
      undefined,
      (error) => {
        console.error("Error loading MTL file:", error);
        loadSimpleModel(); // Try loading the simple model as fallback
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update t-shirt color
  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(color.toLowerCase()),
          shininess: 30,
        });
      }
    });
  }, [color]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current)
        return;

      cameraRef.current.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium mb-4">3D Preview</h3>
      <div
        ref={mountRef}
        className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden"
      />
      <div className="mt-2 text-sm text-gray-500 text-center">
        Press Alt+Q to cycle through 2D to 3D
      </div>
    </div>
  );
};

export default ThreeJsPreview;
