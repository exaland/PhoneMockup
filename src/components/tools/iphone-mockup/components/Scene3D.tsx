import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { PhoneModel } from './PhoneModel';
import { SceneLighting } from './SceneLighting';
import { Download, Smartphone, MoveHorizontal, MoveVertical } from 'lucide-react';
import * as THREE from 'three';
import html2canvas from 'html2canvas';

// 添加在文件开头的导入语句下面
type PresetAngleName = 'front' | 'right' | 'left' | 'reset' | 'autoRotate';

const presetPoses: { name: PresetAngleName; rotation: THREE.Euler }[] = [
  {
    name: "front",
    rotation: new THREE.Euler(0, 0, 0) // 完全正面
  },
  {
    name: "right",
    rotation: new THREE.Euler(0, Math.PI / 12, Math.PI / 24) // Y轴15度，Z轴7.5度
  },
  {
    name: "left",
    rotation: new THREE.Euler(0, -Math.PI / 12, -Math.PI / 24) // Y轴-15度，Z轴-7.5度
  }
];

// 相机控制组件
function CameraController({ zoom }: { zoom: number }) {
  const { camera } = useThree();
  
  useEffect(() => {
    const targetZ = zoom;
    const startZ = camera.position.z;
    const duration = 300; // 动画持续时间（毫秒）
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用 easeOutQuad 缓动函数
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      
      camera.position.z = startZ + (targetZ - startZ) * easeProgress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }, [camera, zoom]);
  
  return null;
}

// 添加新的动画控制组件
function ModelAnimationController({ 
  rotationX, 
  rotationY, 
  positionX, 
  positionY 
}: { 
  rotationX: number;
  rotationY: number;
  positionX: number;
  positionY: number;
}) {
  const { scene } = useThree();
  const phoneModel = scene.getObjectByName('iphone');
  
  useEffect(() => {
    if (!phoneModel) return;

    const startRotationX = phoneModel.rotation.x;
    const startRotationY = phoneModel.rotation.y;
    const startPositionX = phoneModel.position.x;
    const startPositionY = phoneModel.position.y;
    
    const targetRotationX = rotationX;
    const targetRotationY = rotationY;
    const targetPositionX = positionX;
    const targetPositionY = positionY;
    
    const duration = 300;
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用 easeOutQuad 缓动函数
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      
      if (phoneModel) {
        phoneModel.rotation.x = startRotationX + (targetRotationX - startRotationX) * easeProgress;
        phoneModel.rotation.y = startRotationY + (targetRotationY - startRotationY) * easeProgress;
        phoneModel.position.x = startPositionX + (targetPositionX - startPositionX) * easeProgress;
        phoneModel.position.y = startPositionY + (targetPositionY - startPositionY) * easeProgress;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }, [phoneModel, rotationX, rotationY, positionX, positionY]);

  return null;
}

function SceneCapture() {
  const { gl, scene, camera } = useThree();
  
  useEffect(() => {
    // @ts-ignore
    gl.domElement.scene = scene;
    // @ts-ignore
    gl.domElement.camera = camera;
  }, [gl, scene, camera]);
  
  return null;
}

interface Scene3DProps {
  screenshotUrl: string | null | undefined;
  background: string | null | undefined;
}

function ExportHelper({ onExport }: { onExport: (scene: THREE.Scene, camera: THREE.Camera) => void }) {
  const { scene, camera } = useThree();
  
  useEffect(() => {
    onExport(scene, camera);
  }, [scene, camera, onExport]);
  
  return null;
}

// 背景组件
function Background({ imageUrl }: { imageUrl: string }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { viewport, camera } = useThree();
  
  useEffect(() => {
    if (texture && texture.image) {
      // 设置纹理的基本属性
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      
      // 计算图片和视口的宽高比
      const imageAspect = texture.image.width / texture.image.height;
      const viewportAspect = viewport.width / viewport.height;
      
      // 根据宽高比决定如何缩放纹理
      if (imageAspect > viewportAspect) {
        // 图片较宽，以高度为准
        const scale = viewport.height / viewport.width;
        texture.repeat.set(1, scale * imageAspect);
        texture.offset.set(0, (1 - texture.repeat.y) / 2);
      } else {
        // 图片较高，以宽度为准
        const scale = viewport.width / viewport.height;
        texture.repeat.set(scale / imageAspect, 1);
        texture.offset.set((1 - texture.repeat.x) / 2, 0);
      }
      
      texture.needsUpdate = true;
    }
  }, [texture, viewport]);

  return (
    <mesh position={[0, 0, -30]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function Scene3D({ screenshotUrl, background }: Scene3DProps) {
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [rotationDirection, setRotationDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');
  const [zoom, setZoom] = useState(45);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackground, setShowBackground] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: string; height: number }>({ width: '100%', height: 600 });
  const exportDataRef = useRef<{ scene?: THREE.Scene; camera?: THREE.Camera }>({});
  
  // 光照控制状态
  const [ambientIntensity, setAmbientIntensity] = useState(0.8);
  const [pointLightIntensity, setPointLightIntensity] = useState(0.5);
  const [metalness, setMetalness] = useState(0.9);
  const [roughness, setRoughness] = useState(0.2);

  // 预设场景尺寸
  const presetSizes = [
    { name: '16:9', width: '100%', height: 600, aspectRatio: 16/9 },
    { name: '4:3', width: '100%', height: 800, aspectRatio: 4/3 },
    { name: '1:1', width: '100%', height: 1000, aspectRatio: 1 },
  ];

  // 处理场景尺寸变化
  const handleSizeChange = (preset: typeof presetSizes[0]) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const height = Math.round(containerWidth / preset.aspectRatio);
      setCanvasSize({ width: preset.width, height });
    }
  };

  // 裁剪空白区域的函数
  const trimCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const context = canvas.getContext('2d');
    if (!context) return canvas;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const l = pixels.data.length;
    const bound = {
      top: null as number | null,
      left: null as number | null,
      right: null as number | null,
      bottom: null as number | null
    };
    
    // 扫描像素来找到边界
    for (let i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        const x = (i / 4) % canvas.width;
        const y = ~~((i / 4) / canvas.width);

        if (bound.top === null) {
          bound.top = y;
        }
        if (bound.left === null) {
          bound.left = x;
        } else if (x < bound.left) {
          bound.left = x;
        }
        if (bound.right === null) {
          bound.right = x;
        } else if (bound.right < x) {
          bound.right = x;
        }
        if (bound.bottom === null) {
          bound.bottom = y;
        } else if (bound.bottom < y) {
          bound.bottom = y;
        }
      }
    }

    // 检查是否找到了边界
    if (bound.top === null ||
        bound.left === null ||
        bound.right === null ||
        bound.bottom === null) {
      return canvas;
    }

    // 添加一些内边距
    const padding = 20;
    bound.top = Math.max(0, bound.top - padding);
    bound.left = Math.max(0, bound.left - padding);
    bound.right = Math.min(canvas.width, bound.right + padding);
    bound.bottom = Math.min(canvas.height, bound.bottom + padding);

    const trimWidth = bound.right - bound.left;
    const trimHeight = bound.bottom - bound.top;
    
    // 创建新的画布
    const trimmed = document.createElement('canvas');
    trimmed.width = trimWidth;
    trimmed.height = trimHeight;
    
    // 复制裁剪区域到新画布
    const trimmedContext = trimmed.getContext('2d');
    if (trimmedContext) {
      trimmedContext.drawImage(
        canvas,
        bound.left, bound.top, trimWidth, trimHeight,
        0, 0, trimWidth, trimHeight
      );
    }
    
    return trimmed;
  };

  const handleExport = () => {
    if (!canvasRef.current || !containerRef.current) return;

    try {
      // 创建临时画布，使用2倍分辨率
      const tempCanvas = document.createElement('canvas');
      const container = containerRef.current;
      const scale = 2; // 分辨率倍数
      tempCanvas.width = container.offsetWidth * scale;
      tempCanvas.height = container.offsetHeight * scale;
      const tempContext = tempCanvas.getContext('2d');
      
      if (tempContext) {
        // 启用抗锯齿
        tempContext.imageSmoothingEnabled = true;
        tempContext.imageSmoothingQuality = 'high';
        
        // 缩放以提高分辨率
        tempContext.scale(scale, scale);
        
        // 如果有背景图，先绘制背景
        if (backgroundImage) {
          const img = new Image();
          img.src = backgroundImage;
          
          img.onload = () => {
            // 计算背景图的绘制参数，实现 cover 效果
            const imgAspect = img.width / img.height;
            const canvasAspect = container.offsetWidth / container.offsetHeight;
            let drawWidth = container.offsetWidth;
            let drawHeight = container.offsetHeight;
            let x = 0;
            let y = 0;
            
            if (imgAspect > canvasAspect) {
              // 图片较宽，以高度为准
              drawWidth = container.offsetHeight * imgAspect;
              x = (container.offsetWidth - drawWidth) / 2;
            } else {
              // 图片较高，以宽度为准
              drawHeight = container.offsetWidth / imgAspect;
              y = (container.offsetHeight - drawHeight) / 2;
            }
            
            // 绘制背景
            tempContext.drawImage(img, x, y, drawWidth, drawHeight);
            
            // 绘制 WebGL 内容
            if (canvasRef.current) {
              tempContext.drawImage(canvasRef.current, 0, 0, container.offsetWidth, container.offsetHeight);
            }
            
            // 导出
            exportImage(tempCanvas);
          };
          
          img.onerror = () => {
            console.error('Error loading background image');
            // 如果背景图加载失败，使用默认背景色
            tempContext.fillStyle = '#f0f0f0';
            tempContext.fillRect(0, 0, container.offsetWidth, container.offsetHeight);
            if (canvasRef.current) {
              tempContext.drawImage(canvasRef.current, 0, 0, container.offsetWidth, container.offsetHeight);
            }
            exportImage(tempCanvas);
          };
        } else {
          // 使用默认背景色
          tempContext.fillStyle = '#f0f0f0';
          tempContext.fillRect(0, 0, container.offsetWidth, container.offsetHeight);
          if (canvasRef.current) {
            tempContext.drawImage(canvasRef.current, 0, 0, container.offsetWidth, container.offsetHeight);
          }
          exportImage(tempCanvas);
        }
      }
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  // 辅助函数：导出画布为图片
  const exportImage = (canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'phone-showcase.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportModel = async () => {
    if (!canvasRef.current) return;

    try {
      // 临时隐藏背景和网格
      setShowBackground(false);
      
      // 等待渲染完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 获取当前画布的内容
      const canvas = canvasRef.current;
      
      // 创建临时画布
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        // 直接从 WebGL 画布复制内容
        tempCtx.drawImage(canvas, 0, 0);
        
        // 获取图像数据以分析边界
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const { data, width, height } = imageData;
        
        // 找到非透明像素的边界
        let minX = width;
        let minY = height;
        let maxX = 0;
        let maxY = 0;
        let hasContent = false;
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 10) { // 使用阈值来判断是否为有效内容
              hasContent = true;
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }
        
        if (!hasContent) {
          console.error('No content found in the canvas');
          setShowBackground(true);
          return;
        }
        
        // 添加一些内边距
        const padding = 20;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(width, maxX + padding);
        maxY = Math.min(height, maxY + padding);
        
        // 创建新画布并绘制剪后的内容
        const croppedCanvas = document.createElement('canvas');
        const cropWidth = maxX - minX;
        const cropHeight = maxY - minY;
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;
        
        const croppedCtx = croppedCanvas.getContext('2d');
        if (croppedCtx) {
          // 确保画布背景是透明的
          croppedCtx.clearRect(0, 0, cropWidth, cropHeight);
          
          // 复制裁剪区域
          croppedCtx.drawImage(
            tempCanvas,
            minX, minY, cropWidth, cropHeight,
            0, 0, cropWidth, cropHeight
          );
          
          // 导出裁剪后的图像
          const dataUrl = croppedCanvas.toDataURL('image/png', 1.0);
          
          // 创建下载链接
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'phone-model.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      
      // 恢复背景和网格
      setShowBackground(true);
    } catch (error) {
      console.error('Error exporting model:', error);
      setShowBackground(true);
    }
  };

  const handleSceneExport = useCallback((scene: THREE.Scene, camera: THREE.Camera) => {
    exportDataRef.current = { scene, camera };
  }, []);

  // 处理背景图上传
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 应用预设姿势
  const applyPresetPose = (rotation: THREE.Euler) => {
    const event = new CustomEvent('reset-rotation');
    window.dispatchEvent(event);
    
    setTimeout(() => {
      const horizontalEvent = new CustomEvent('rotate-horizontal', { detail: rotation.y });
      const verticalEvent = new CustomEvent('rotate-vertical', { detail: rotation.x });
      const zRotationEvent = new CustomEvent('rotate-z', { detail: rotation.z });
      
      window.dispatchEvent(horizontalEvent);
      window.dispatchEvent(verticalEvent);
      window.dispatchEvent(zRotationEvent);
    }, 50);
  };

  const [modelRotationX, setModelRotationX] = useState(0);
  const [modelRotationY, setModelRotationY] = useState(0);

  // 更新旋转事件处理
  useEffect(() => {
    const handleRotateHorizontal = (e: CustomEvent) => {
      setModelRotationY(prev => prev + e.detail);
    };
    
    const handleRotateVertical = (e: CustomEvent) => {
      setModelRotationX(prev => prev + e.detail);
    };
    
    const handleResetRotation = () => {
      setModelRotationX(0);
      setModelRotationY(0);
      setPositionX(0);
      setPositionY(0);
    };

    window.addEventListener('rotate-horizontal', handleRotateHorizontal as EventListener);
    window.addEventListener('rotate-vertical', handleRotateVertical as EventListener);
    window.addEventListener('reset-rotation', handleResetRotation);

    return () => {
      window.removeEventListener('rotate-horizontal', handleRotateHorizontal as EventListener);
      window.removeEventListener('rotate-vertical', handleRotateVertical as EventListener);
      window.removeEventListener('reset-rotation', handleResetRotation);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 导出按钮组 */}
      <div className="w-full flex justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-white text-[#1c1f23] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Upload Background
          </label>
          {backgroundImage && (
            <button
              onClick={() => setBackgroundImage(null)}
              className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              Remove Background
            </button>
          )}
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button
            onClick={() => setShowBackground(!showBackground)}
            className={`px-4 py-2 border rounded-xl transition-colors ${
              showBackground 
                ? 'bg-[#6ee7b7]/10 text-[#10b981] border-[#6ee7b7]/30' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {showBackground ? 'Hide Background' : 'Show Background'}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportModel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1f23] hover:bg-[#2d3748] text-white transition-colors shadow-sm"
          >
            <Smartphone className="w-4 h-4" />
            Export Model
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1f23] hover:bg-[#2d3748] text-white transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Image
          </button>
        </div>
      </div>

      {/* 预设姿势按钮组 */}
      <div className="w-full flex items-center gap-4 mt-4">
        <span className="text-sm text-gray-600">Preset Angles:</span>
        <div className="flex gap-2">
          {presetPoses.map((pose) => (
            <button
              key={pose.name}
              onClick={() => applyPresetPose(pose.rotation)}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-[#1c1f23] rounded-lg transition-colors text-sm shadow-sm"
            >
              {pose.name.charAt(0).toUpperCase() + pose.name.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 3D 预览域 */}
      <div 
        ref={containerRef} 
        className="w-full bg-gray-100 relative"
        style={{ 
          height: canvasSize.height,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {loadingProgress > 0 && loadingProgress < 1 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1c1f23]/80 backdrop-blur-sm z-10">
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden shadow-lg">
              <div 
                className="h-full bg-[#6ee7b7] transition-all duration-500 ease-out"
                style={{ width: `${loadingProgress * 100}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-white font-medium">
              Loading... {Math.round(loadingProgress * 100)}%
            </p>
          </div>
        )}
        
        <Canvas
          ref={canvasRef}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 80], fov: 20 }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            precision: "highp",
            depth: true,
            stencil: false,
            logarithmicDepthBuffer: true,
          }}
          style={{
            width: '100%',
            height: '100%',
            background: backgroundImage ? 'transparent' : '#f0f0f0',
          }}
          linear
          flat
        >
          <Suspense fallback={null}>
            <CameraController zoom={zoom} />
            <ModelAnimationController 
              rotationX={modelRotationX}
              rotationY={modelRotationY}
              positionX={positionX}
              positionY={positionY}
            />
            {isExporting && <ExportHelper onExport={handleSceneExport} />}
            {showBackground && !backgroundImage && (
              <gridHelper args={[40, 40]} position={[0, -8, 0]} />
            )}
            <group position={[positionX, positionY, 0]}>
              <PhoneModel 
                screenshotUrl={screenshotUrl} 
                isAutoRotating={isAutoRotating}
                metalness={metalness}
                roughness={roughness}
                onLoadProgress={setLoadingProgress}
                rotationDirection={rotationDirection}
              />
            </group>

            {/* 基础环境光 */}
            <ambientLight intensity={0.3} color="#ffffff" />
            
            {/* 主要照明：强力聚光灯 */}
            <spotLight 
              position={[0, 0, 100]} 
              intensity={8.0}
              color="#ffffff"
              distance={200}
              angle={Math.PI / 4}
              penumbra={0.2}
              decay={1.5}
            />
            
            {/* 边缘照明：四个角的聚光灯 */}
            <spotLight 
              position={[50, 50, 50]} 
              intensity={4.0}
              color="#ffffff"
              distance={150}
              angle={Math.PI / 4}
              penumbra={0.2}
              decay={1.5}
            />
            <spotLight 
              position={[-50, 50, 50]} 
              intensity={4.0}
              color="#ffffff"
              distance={150}
              angle={Math.PI / 4}
              penumbra={0.2}
              decay={1.5}
            />
            <spotLight 
              position={[50, -50, 50]} 
              intensity={4.0}
              color="#ffffff"
              distance={150}
              angle={Math.PI / 4}
              penumbra={0.2}
              decay={1.5}
            />
            <spotLight 
              position={[-50, -50, 50]} 
              intensity={4.0}
              color="#ffffff"
              distance={150}
              angle={Math.PI / 4}
              penumbra={0.2}
              decay={1.5}
            />
            
            {/* 侧面补光 */}
            <directionalLight 
              position={[100, 0, 50]} 
              intensity={2.0}
              color="#ffffff"
            />
            <directionalLight 
              position={[-100, 0, 50]} 
              intensity={2.0}
              color="#ffffff"
            />
            
            {/* 顶部和底部的补光 */}
            <directionalLight 
              position={[0, 100, 50]} 
              intensity={1.5}
              color="#ffffff"
            />
            <directionalLight 
              position={[0, -100, 50]} 
              intensity={1.5}
              color="#ffffff"
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {/* 模型控制 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-[#1c1f23] mb-3">Model Controls</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="zoom" className="text-sm text-gray-600">Zoom</label>
                <span className="text-xs text-gray-500">{zoom}</span>
              </div>
              <input
                id="zoom"
                type="range"
                min="30"
                max="60"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button
                onClick={() => applyPresetPose(presetPoses.find(pose => pose.name === 'left')?.rotation || new THREE.Euler(0, 0, 0))}
                className="flex flex-col items-center justify-center py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span className="text-xs">Left View</span>
              </button>
              <button
                onClick={() => applyPresetPose(presetPoses.find(pose => pose.name === 'front')?.rotation || new THREE.Euler(0, 0, 0))}
                className="flex flex-col items-center justify-center py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span className="text-xs">Front View</span>
              </button>
              <button
                onClick={() => applyPresetPose(presetPoses.find(pose => pose.name === 'right')?.rotation || new THREE.Euler(0, 0, 0))}
                className="flex flex-col items-center justify-center py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="text-xs">Right View</span>
              </button>
            </div>
            
            <div className="flex justify-between mt-4">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('reset-rotation'))}
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                Reset Position
              </button>
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg shadow-sm text-sm ${
                  isAutoRotating
                    ? 'bg-[#6ee7b7]/10 text-[#10b981] border border-[#6ee7b7]/30'
                    : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  <path d="M15.4 10a4 4 0 1 0 0 4" />
                </svg>
                {isAutoRotating ? 'Stop Rotation' : 'Auto Rotate'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 位置控制 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-[#1c1f23] mb-3">Position Controls</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="posX" className="text-sm text-gray-600">Horizontal Position</label>
                <span className="text-xs text-gray-500">{positionX.toFixed(1)}</span>
              </div>
              <input
                id="posX"
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={positionX}
                onChange={(e) => setPositionX(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="posY" className="text-sm text-gray-600">Vertical Position</label>
                <span className="text-xs text-gray-500">{positionY.toFixed(1)}</span>
              </div>
              <input
                id="posY"
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={positionY}
                onChange={(e) => setPositionY(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>
          </div>
        </div>
        
        {/* 材质控制 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-[#1c1f23] mb-3">Material Controls</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="metalness" className="text-sm text-gray-600">Metalness</label>
                <span className="text-xs text-gray-500">{metalness.toFixed(1)}</span>
              </div>
              <input
                id="metalness"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={metalness}
                onChange={(e) => setMetalness(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="roughness" className="text-sm text-gray-600">Roughness</label>
                <span className="text-xs text-gray-500">{roughness.toFixed(1)}</span>
              </div>
              <input
                id="roughness"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={roughness}
                onChange={(e) => setRoughness(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="rotDir" className="text-sm text-gray-600">Rotation Direction</label>
              </div>
              <div className="flex border rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setRotationDirection('clockwise')}
                  className={`w-1/2 py-1.5 text-xs ${
                    rotationDirection === 'clockwise'
                      ? 'bg-[#6ee7b7]/10 text-[#10b981] font-medium'
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Clockwise
                </button>
                <button
                  onClick={() => setRotationDirection('counterclockwise')}
                  className={`w-1/2 py-1.5 text-xs ${
                    rotationDirection === 'counterclockwise'
                      ? 'bg-[#6ee7b7]/10 text-[#10b981] font-medium'
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Counter-clockwise
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}