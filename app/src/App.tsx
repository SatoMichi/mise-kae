import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PosePanel } from './components/PosePanel';
import { PoseDefinition } from './utils/PoseFileManager';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);

  // シーンの初期化
  useEffect(() => {
    if (!canvasRef.current) return;

    // シーンの作成
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xf0f0f0);

    // カメラの作成
    const newCamera = new THREE.PerspectiveCamera(
      30.0,
      window.innerWidth / window.innerHeight,
      0.1,
      20.0
    );
    newCamera.position.set(0.0, 1.0, 2.0);

    // レンダラーの作成
    const newRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    newRenderer.setSize(window.innerWidth, window.innerHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);

    // コントロールの作成
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.target.set(0.0, 1.0, 0.0);
    newControls.update();

    // ライトの追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1.0, 1.0, 1.0).normalize();
    newScene.add(directionalLight);

    // グリッドの追加
    const gridHelper = new THREE.GridHelper(10, 10);
    newScene.add(gridHelper);

    // 状態の更新
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);

    // リサイズハンドラ
    const handleResize = () => {
      newCamera.aspect = window.innerWidth / window.innerHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize);
      newRenderer.dispose();
    };
  }, []);

  // VRMモデルの読み込み
  useEffect(() => {
    if (!scene || !camera || !renderer) return;

    const loader = new GLTFLoader();
    loader.registerPlugin(new VRMLoaderPlugin());
    loader.load(
      __APP_MODEL_PATH__,
      (gltf) => {
        const vrm = gltf.userData.vrm;
        scene.add(vrm.scene);
        vrm.scene.position.set(0, 0, 0);
        setVrm(vrm);
      },
      (progress) => {
        console.log('Loading model...', (progress.loaded / progress.total) * 100);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [scene, camera, renderer]);

  // アニメーションループ
  useEffect(() => {
    if (!scene || !camera || !renderer || !controls) return;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [scene, camera, renderer, controls]);

  const handlePoseSelect = (poseDef: PoseDefinition) => {
    if (vrm) {
      vrm.humanoid.setRawPose(poseDef.pose);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <canvas ref={canvasRef} className="w-full h-full" />
      <PosePanel onPoseSelect={handlePoseSelect} />
    </div>
  );
} 
 