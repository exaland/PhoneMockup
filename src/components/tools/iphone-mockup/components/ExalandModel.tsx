import { useRef, useEffect, useState, useMemo } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as THREE from 'three';
import { useScreenTexture } from '../hooks/useScreenTexture';

interface ExalandModelProps {
  screenshotUrl: string | null | undefined;
  isAutoRotating: boolean;
  metalness: number;
  roughness: number;
  onLoadProgress?: (progress: number) => void;
  rotationDirection?: 'clockwise' | 'counterclockwise';
  paddingHorizontal: number;
  paddingVertical: number;
  onRotationChange?: (deltaX: number, deltaY: number) => void;
  onZRotationChange?: (deltaZ: number) => void;
}

export function ExalandModel({ 
  screenshotUrl, 
  isAutoRotating,
  metalness,
  roughness,
  onLoadProgress,
  rotationDirection = 'clockwise',
  paddingHorizontal,
  paddingVertical,
  onRotationChange,
  onZRotationChange,
}: ExalandModelProps) {
  const modelRef = useRef<THREE.Group | null>(null);
  const screenRef = useRef<THREE.Mesh | null>(null);
  const texture = useScreenTexture(screenshotUrl);
  const { gl, invalidate } = useThree();
  const MODEL_SCALE = 1.0;
  
  // Load the phone model using OBJLoader
  const obj = useLoader(
    OBJLoader,
    '/models/billboard.obj',
    (loader) => {
      // Set initial progress to 0
      onLoadProgress?.(0);

      // Create a file loader to track the actual file download
      const fileLoader = new THREE.FileLoader();
      fileLoader.setResponseType('arraybuffer');

      // Add event listener for download progress
      const onProgress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const progress = event.loaded / event.total;
          onLoadProgress?.(progress);
        }
      };
      
      // Replace the loader's load method to use our file loader
      const originalLoad = loader.load.bind(loader);
      loader.load = (url: string, onLoad?: (result: any) => void, _?: (event: ProgressEvent) => void, onError?: (err: unknown) => void) => {
        fileLoader.load(
          url,
          (buffer) => {
            if (onLoad && buffer instanceof ArrayBuffer) {
              const text = new TextDecoder().decode(buffer);
              onLoadProgress?.(1); // Set progress to 100% when load completes
              originalLoad(url, onLoad);
            }
          },
          onProgress,
          onError
        );
      };
    }
  );
  
  // 创建高质量的环境贴图
  const envMap = useMemo(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    
    // 创建渐变天空盒
    const envScene = new THREE.Scene();
    const gradientTexture = new THREE.DataTexture(
      generateGradientData(),
      256,
      1,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    gradientTexture.needsUpdate = true;
    
    const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        gradientMap: { value: gradientTexture },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D gradientMap;
        varying vec3 vWorldPosition;
        void main() {
          vec3 normalizedPos = normalize(vWorldPosition);
          float y = normalizedPos.y * 0.5 + 0.5;
          gl_FragColor = texture2D(gradientMap, vec2(y, 0.5));
        }
      `,
      side: THREE.BackSide,
    });
    
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
    envScene.add(skyMesh);
    
    const envTexture = pmremGenerator.fromScene(envScene).texture;
    pmremGenerator.dispose();
    envScene.remove(skyMesh);
    
    return envTexture;
  }, [gl]);
  
  // 生成渐变数据
  function generateGradientData() {
    const size = 256;
    const data = new Float32Array(size * 4);
    
    const topColor = new THREE.Color(0.8, 0.9, 1.0);  // 天蓝色
    const middleColor = new THREE.Color(0.5, 0.6, 0.7);  // 灰蓝色
    const bottomColor = new THREE.Color(0.2, 0.2, 0.3);  // 深蓝色
    
    for (let i = 0; i < size; i++) {
      const t = i / (size - 1);
      let color;
      
      if (t < 0.5) {
        color = new THREE.Color().lerpColors(bottomColor, middleColor, t * 2);
      } else {
        color = new THREE.Color().lerpColors(middleColor, topColor, (t - 0.5) * 2);
      }
      
      data[i * 4] = color.r;
      data[i * 4 + 1] = color.g;
      data[i * 4 + 2] = color.b;
      data[i * 4 + 3] = 1.0;
    }
    
    return data;
  }
  
  // 状态管理
  const [isDragging, setIsDragging] = useState(false);
  const [previousTouch, setPreviousTouch] = useState({ x: 0, y: 0 });
  const rotationSpeed = 0.003;
  const autoRotationSpeed = 0.01;

  // 预处理模型和材质
  const processedObj = useMemo(() => {
    if (!obj) return null;
    
    const clonedObj = obj.clone();
    
    // 设手机外壳材质
    clonedObj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0.06, 0.06, 0.06),  // 微调加深基础颜色
          metalness: 0.95,   
          roughness: 0.25,   // 降低粗糙度，增加光泽感
          clearcoat: 0,      
          clearcoatRoughness: 0,
          reflectivity: 0.85,  
          envMap: envMap,
          envMapIntensity: 0.9,  // 降低环境反射强度
          ior: 1.5,   
          transmission: 0,
          specularIntensity: 0.8,  
          specularColor: new THREE.Color(0.6, 0.6, 0.6),  // 使用更柔和的高光颜色
          thickness: 0,
          attenuationColor: new THREE.Color(1, 1, 1),
          sheen: 0
        });

        // 确保材质正确应用
        if (Array.isArray(child.material)) {
          child.material = Array(child.material.length).fill(material.clone());
        } else {
          child.material = material.clone();
        }
        
        // 优化法线和阴影
        child.geometry.computeVertexNormals();
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clonedObj;
  }, [obj, metalness, roughness]);
  
  useEffect(() => {
    if (!processedObj || !modelRef.current) return;
    
    const modelGroup = new THREE.Group(); 
    modelGroup.add(processedObj.clone()); 
    
    const box = new THREE.Box3().setFromObject(processedObj); 
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    modelGroup.children[0].position.sub(center); 
    
    const screenGroup = new THREE.Group();
    screenGroup.name = 'screenGroup';
    
    // Calculate ratios based on separate padding props
    const widthRatio = 1.0 - paddingHorizontal;
    const heightRatio = 1.0 - paddingVertical;
    const SCREEN_WIDTH_RATIO = widthRatio; 
    const SCREEN_HEIGHT_RATIO = heightRatio; 
    const SCREEN_OFFSET_Y = 0.005; 
    const screenZFactor = 0.52; 
    
    const screenWidth = size.x * MODEL_SCALE * SCREEN_WIDTH_RATIO;
    const screenHeight = size.y * MODEL_SCALE * SCREEN_HEIGHT_RATIO;
    
    // Create screen background geometry
    const bgGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight, 1, 1);
    const bgMaterial = new THREE.MeshBasicMaterial({
        transparent: true, opacity: 0, side: THREE.FrontSide,
        depthWrite: false, depthTest: true,
    });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.name = 'screenBg';
    bgMesh.position.z = -0.001;
    screenGroup.add(bgMesh);

    // Create screen display geometry
    const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight, 1, 1);
    const screenMaterial = new THREE.MeshBasicMaterial({
        map: texture, // Use original texture for now
        transparent: true,
        opacity: texture ? 1 : 0, 
        depthWrite: false, depthTest: true,
        side: THREE.FrontSide, toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenRef.current = screenMesh; 
    screenGroup.add(screenMesh);
    
    const screenZ = (size.z * MODEL_SCALE * screenZFactor) + 0.001;
    screenGroup.position.set(0, SCREEN_OFFSET_Y, screenZ);
    
    modelGroup.add(screenGroup);
    
    // Always update modelRef.current children
    while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0]);
    }
    modelRef.current.add(modelGroup);
    
    invalidate(); 

    const canvas = gl.domElement;

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      setIsDragging(true);
      setPreviousTouch({
        x: event.clientX,
        y: event.clientY
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging || !onRotationChange || !onZRotationChange) return;

      const deltaX = event.clientY - previousTouch.y;
      const deltaY = event.clientX - previousTouch.x;

      if (event.shiftKey) {
        const deltaZ = deltaY * rotationSpeed * 2;
        onZRotationChange(deltaZ);
        setPreviousTouch({ x: event.clientX, y: previousTouch.y });
      } else {
        onRotationChange(deltaX * rotationSpeed, deltaY * rotationSpeed);
        setPreviousTouch({ x: event.clientX, y: event.clientY });
      }

      invalidate();
    };

    const onPointerUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, [processedObj, gl, isDragging, previousTouch.x, previousTouch.y, invalidate, rotationSpeed, texture, paddingHorizontal, paddingVertical, onRotationChange, onZRotationChange]);

  // 自动旋转
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      const interval = setInterval(() => {
        if (modelRef.current) {
          // 根据旋转方向设置旋转速度
          const rotationAmount = rotationDirection === 'clockwise' ? -0.01 : 0.01;
          // Notify parent about rotation delta
          onRotationChange?.(0, rotationAmount);
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isAutoRotating, isDragging, rotationDirection, onRotationChange]);

  return (
    <group ref={modelRef} name="ExalandModelGroup">
      <primitive 
        object={processedObj || obj}
        scale={[MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]}
      />
    </group>
  );
}