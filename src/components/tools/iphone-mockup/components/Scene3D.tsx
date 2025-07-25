import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { PhoneModel } from './PhoneModel';
import { SceneLighting } from './SceneLighting';
import { Download, Smartphone, MoveHorizontal, MoveVertical, Save, Trash2, Play } from 'lucide-react';
import * as THREE from 'three';
import html2canvas from 'html2canvas';
import { Text } from '@react-three/drei';

// 添加在文件开头的导入语句下面
type PresetAngleName = 'front' | 'right' | 'left' | 'reset' | 'autoRotate';
function rgbStringToHex(rgb: string): string {
  const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(rgb);
  return result
    ? "#" +
        [1, 2, 3]
          .map((i) => parseInt(result[i]).toString(16).padStart(2, '0'))
          .join('')
    : "#ffffff";
}

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
  const { camera, invalidate } = useThree();

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

      invalidate();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }, [camera, zoom, invalidate]);

  return null;
}

// 添加新的动画控制组件
function ModelAnimationController({
  rotationX,
  rotationY,
  positionX,
  positionY,
  rotationZ
}: {
  rotationX: number;
  rotationY: number;
  positionX: number;
  positionY: number;
  rotationZ: number;
}) {
  const { scene, invalidate } = useThree();
  const phoneModel = scene.getObjectByName('phoneModelGroup');

  // Temporarily disable animation, directly set properties
  useEffect(() => {
    if (phoneModel) {
      phoneModel.rotation.x = rotationX;
      phoneModel.rotation.y = rotationY;
      phoneModel.rotation.z = rotationZ;
      phoneModel.position.x = positionX;
      phoneModel.position.y = positionY;
      invalidate(); // Ensure the scene re-renders with the new state
    }
  }, [phoneModel, rotationX, rotationY, rotationZ, positionX, positionY, invalidate]);

  /* Original Animation Logic (Commented out for testing)
  useEffect(() => {
    if (!phoneModel) return;
// ... (rest of the original animation useEffect code) ...
  }, [phoneModel, rotationX, rotationY, positionX, positionY, invalidate]);
  */

  return null;
}

function SceneCapture() {
  const { gl, scene, camera, invalidate } = useThree();

  useEffect(() => {
    // @ts-ignore
    gl.domElement.scene = scene;
    // @ts-ignore
    gl.domElement.camera = camera;
    invalidate();
  }, [gl, scene, camera, invalidate]);

  return null;
}

interface Scene3DProps {
  screenshotUrl: string | null | undefined;
  background: string | null | undefined;
}

function ExportHelper({ onExport }: { onExport: (scene: THREE.Scene, camera: THREE.Camera) => void }) {
  const { scene, camera, invalidate } = useThree();

  useEffect(() => {
    onExport(scene, camera);
    invalidate();
  }, [scene, camera, onExport, invalidate]);

  return null;
}

// 背景组件
function Background({ imageUrl }: { imageUrl: string }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { viewport, camera, invalidate } = useThree();

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
      invalidate();
    }
  }, [texture, viewport, invalidate]);

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

// Preset interfaces (Add these)
interface PresetValue {
  zoom: number;
  posX: number;
  posY: number;
  rotX: number; // Stored in radians
  rotY: number; // Stored in radians
  rotZ: number; // Add Z rotation
}

interface Preset {
  name: string;
  values: PresetValue;
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
  const [mainTitle, setMainTitle] = useState("Find People");
  const [subTitle, setSubTitle] = useState("Join teams that match your vibe and goals");
  const [floatingCardText, setFloatingCardText] = useState("AuDHD Legends!");
  const [textColor, setTextColor] = useState("#111827"); // par défaut: gray-900
  const [titleBgColor, setTitleBgColor] = useState("rgba(255,255,255,0.8)");
  const [titleFontSize, setTitleFontSize] = useState(36); // en pixels
  const [subtitleFontSize, setSubtitleFontSize] = useState(18);
  const [cardFontSize, setCardFontSize] = useState(16);
  const [sceneBgColor, setSceneBgColor] = useState("#f0f0f0"); // ou n’importe quel default
  const [isFloatingCardDisabled, setIsFloatingCardDisabled] = useState(false);
  const [isFloatingCardTwoDisabled, setIsFloatingCardTwoDisabled] = useState(false);

  

  const [titlePos, setTitlePos] = useState({ x: 50, y: 30 }); // % of container
  const [cardPos, setCardPos] = useState({ x: 50, y: 80 });   // % of container

  // 光照控制状态
  const [ambientIntensity, setAmbientIntensity] = useState(0.8);
  const [pointLightIntensity, setPointLightIntensity] = useState(0.5);
  const [metalness, setMetalness] = useState(0.9);
  const [roughness, setRoughness] = useState(0.2);
  // Separate padding states
  const [paddingHorizontal, setPaddingHorizontal] = useState(0.07); // Default 93% width
  const [paddingVertical, setPaddingVertical] = useState(0.03);   // Default 97% height

  const [modelRotationX, setModelRotationX] = useState(0);
  const [modelRotationY, setModelRotationY] = useState(0);
  const [modelRotationZ, setModelRotationZ] = useState(0);

  // State for presets (Add this)
  const [savedPresets, setSavedPresets] = useState<Preset[]>([]);
  const LOCAL_STORAGE_KEY = 'phoneMockupPresets';

  // Load presets on mount (Add this useEffect)
  useEffect(() => {
    try {
      const storedPresets = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPresets) {
        const parsedPresets = JSON.parse(storedPresets);
        // Basic validation
        if (Array.isArray(parsedPresets)) {
          setSavedPresets(parsedPresets);
        } else {
          console.error("Invalid presets found in localStorage:", parsedPresets);
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
        }
      }
    } catch (error) {
      console.error("Error loading presets from localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear potentially corrupted data
    }
  }, []);

  // 预设场景尺寸
  const presetSizes = [
    { name: '16:9', width: '100%', height: 600, aspectRatio: 16 / 9 },
    { name: '4:3', width: '100%', height: 800, aspectRatio: 4 / 3 },
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


  // Ajoutez cette fonction quelque part dans votre composant (par exemple, juste avant votre return)
const captureAndDisplayScreenshots = async () => {
  const sizes = [
    { platform: 'GooglePlay', width: 1080, height: 1920 },
    { platform: 'GooglePlay', width: 1440, height: 2560 },
    { platform: 'Apple', width: 1242, height: 2688 },
    { platform: 'Apple', width: 1125, height: 2436 },
  ];

  const generatedImages: { filename: string; label: string }[] = [];

  for (const size of sizes) {
    // Modifier la taille du container
    setCanvasSize({ width: size.width + 'px', height: size.height });
    await new Promise((resolve) => setTimeout(resolve, 600)); // Attendre le rendu

    // Nom du fichier et label
    const filename = `screenshot_${size.platform}_${size.width}x${size.height}.png`;
    const label = `${size.platform} ${size.width}x${size.height}`;

    await handleExportScreen(filename); // Fonction pour exporter en PNG
    generatedImages.push({ filename, label });
  }

  // Mettre à jour la liste pour afficher dans la galerie
  setScreenshots(generatedImages);
};

// State pour stocker les images générées
const [screenshots, setScreenshots] = useState<{ filename: string; label: string }[]>([]);

// La fonction d'export (adaptée pour accepter un nom de fichier)
const handleExportScreen = (filename = 'screenshot.png') => {
  if (!canvasRef.current || !containerRef.current) return;

  const scale = 2; // Résolution
  const width = parseInt(canvasRef.current.style.width);
  const height = parseInt(canvasRef.current.style.height);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width * scale;
  tempCanvas.height = height * scale;
  const ctx = tempCanvas.getContext('2d');

  if (ctx) {
    ctx.scale(scale, scale);
    ctx.drawImage(canvasRef.current, 0, 0, width, height);

    // Si vous souhaitez ajouter overlays ou autres éléments, faites-le ici

    // Sauvegarder
    const dataUrl = tempCanvas.toDataURL('image/png');
    // Créer un lien pour téléchargement
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

  const makeDraggable = (
    id: string,
    onMove: (x: number, y: number) => void
  ) => {
    const el = document.getElementById(id);
    if (!el) return;

    const container = containerRef.current;
    if (!container) return;

    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      // Calculate new position in px
      let newLeft = startLeft + (e.clientX - startX);
      let newTop = startTop + (e.clientY - startY);

      // Clamp so the element stays inside the container
      newLeft = Math.max(0, Math.min(newLeft, rect.width - elRect.width));
      newTop = Math.max(0, Math.min(newTop, rect.height - elRect.height));

      // Convert to percent
      const x = ((newLeft + elRect.width / 2) / rect.width) * 100;
      const y = ((newTop + elRect.height / 2) / rect.height) * 100;
      onMove(x, y);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = elRect.left - rect.left;
      startTop = elRect.top - rect.top;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);
  };

  useEffect(() => {
    makeDraggable("main-title", (x, y) => setTitlePos({ x, y }));
    makeDraggable("floating-card", (x, y) => setCardPos({ x, y }));
  }, []);

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

  // 导出文本覆盖层为图片（包括主标题、副标题和浮动卡片）
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
        const drawBackground = (cb: () => void) => {
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

              tempContext.drawImage(img, x, y, drawWidth, drawHeight);
              cb();
            };

            img.onerror = () => {
              console.error('Error loading background image');
              tempContext.fillStyle = '#f0f0f0';
              tempContext.fillRect(0, 0, container.offsetWidth, container.offsetHeight);
              cb();
            };
          } else {
            tempContext.fillStyle = sceneBgColor; // 使用场景背景色
            tempContext.fillRect(0, 0, container.offsetWidth, container.offsetHeight);
            cb();
          }
        };

        // 绘制WebGL内容
        const drawWebGL = () => {
          if (canvasRef.current) {
            tempContext.drawImage(
              canvasRef.current,
              0,
              0,
              container.offsetWidth,
              container.offsetHeight
            );
          }
        };

        // 绘制文本覆盖层
        const drawTextOverlays = () => {
          // 主标题和副标题
          const titleDiv = document.getElementById('main-title');
          if (titleDiv) {
            const rect = titleDiv.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const x = rect.left - containerRect.left;
            const y = rect.top - containerRect.top;
            // 使用 html2canvas 渲染该div
            html2canvas(titleDiv, {
              backgroundColor: null,
              scale: scale,
              width: rect.width,
              height: rect.height,
              windowWidth: document.documentElement.clientWidth,
              windowHeight: document.documentElement.clientHeight,
              useCORS: true,
            }).then((canvas) => {
              tempContext.drawImage(
                canvas,
                x,
                y,
                rect.width,
                rect.height
              );
              // 绘制浮动卡片
              drawFloatingCard();
            }).catch(() => {
              // 如果失败，跳过文本
              drawFloatingCard();
            });
          } else {
            drawFloatingCard();
          }
        };

        // 绘制浮动卡片
        const drawFloatingCard = () => {
          const cardDiv = document.getElementById('floating-card');
          if (cardDiv) {
            const rect = cardDiv.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const x = rect.left - containerRect.left;
            const y = rect.top - containerRect.top;
            html2canvas(cardDiv, {
              backgroundColor: null,
              scale: scale,
              width: rect.width,
              height: rect.height,
              windowWidth: document.documentElement.clientWidth,
              windowHeight: document.documentElement.clientHeight,
              useCORS: true,
            }).then((canvas) => {
              tempContext.drawImage(
                canvas,
                x,
                y,
                rect.width,
                rect.height
              );
              exportImage(tempCanvas);
            }).catch(() => {
              exportImage(tempCanvas);
            });
          } else {
            exportImage(tempCanvas);
          }
        };

        // 依次绘制背景、WebGL内容和文本覆盖层
        drawBackground(() => {
          drawWebGL();
          drawTextOverlays();
        });
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
  const applyPresetPose = useCallback((rotation: THREE.Euler) => {
    // Directly set state instead of dispatching events
    setModelRotationX(rotation.x);
    setModelRotationY(rotation.y);
    setModelRotationZ(rotation.z);
    // Optionally reset position when applying angle presets
    setPositionX(0);
    setPositionY(0);

    /* Original event dispatch logic (commented out)
    const resetEvent = new CustomEvent('reset-rotation');
    window.dispatchEvent(resetEvent);
    
    setTimeout(() => {
      const horizontalEvent = new CustomEvent('rotate-horizontal', { detail: rotation.y });
      const verticalEvent = new CustomEvent('rotate-vertical', { detail: rotation.x });
      const zRotationEvent = new CustomEvent('rotate-z', { detail: rotation.z });
      
      window.dispatchEvent(horizontalEvent);
      window.dispatchEvent(verticalEvent);
      window.dispatchEvent(zRotationEvent);
    }, 50);
    */
  }, [setModelRotationX, setModelRotationY, setModelRotationZ, setPositionX, setPositionY]); // Add setters to dependency array

  // Define the rotation change handler
  const handleRotationChange = useCallback((deltaX: number, deltaY: number) => {
    setModelRotationX(prev => {
      // Clamp X rotation to prevent flipping over
      const newRotation = prev + deltaX;
      return Math.max(Math.min(newRotation, Math.PI / 2), -Math.PI / 2); // Clamp between -90 and +90 degrees
    });
    setModelRotationY(prev => prev + deltaY);
  }, []); // No dependencies needed as it only uses setters

  // Define the Z rotation change handler (Add this)
  const handleZRotationChange = useCallback((deltaZ: number) => {
    setModelRotationZ(prev => prev + deltaZ);
  }, []); // No dependencies needed as it only uses setters

  // --- Preset Handling Functions (Add these) ---
  const handleSavePreset = () => {
    const presetName = prompt("Enter a name for this preset:", `Preset ${savedPresets.length + 1}`);
    if (!presetName) {
      return; // User cancelled
    }

    // Check for duplicate name
    if (savedPresets.some(p => p.name === presetName)) {
      alert(`Preset name "${presetName}" already exists. Please choose a different name.`);
      return;
    }

    const newPreset: Preset = {
      name: presetName,
      values: {
        zoom: zoom,
        posX: positionX,
        posY: positionY,
        rotX: modelRotationX, // Save radians
        rotY: modelRotationY, // Save radians
        rotZ: modelRotationZ, // Save Z rotation in radians
      },
    };

    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPresets));
      alert(`Preset "${presetName}" saved!`);
    } catch (error) {
      console.error("Error saving presets to localStorage:", error);
      alert("Failed to save preset.");
      // Optionally revert state if saving fails
      setSavedPresets(savedPresets);
    }
  };

  const handleApplyPreset = (preset: Preset) => {
    setZoom(preset.values.zoom);
    setPositionX(preset.values.posX);
    setPositionY(preset.values.posY);
    // Directly set rotation state, ModelAnimationController will handle the animation
    setModelRotationX(preset.values.rotX);
    setModelRotationY(preset.values.rotY);
    setModelRotationZ(preset.values.rotZ);
  };

  const handleDeletePreset = (presetNameToDelete: string) => {
    if (!confirm(`Are you sure you want to delete the preset "${presetNameToDelete}"?`)) {
      return;
    }
    const updatedPresets = savedPresets.filter(p => p.name !== presetNameToDelete);
    setSavedPresets(updatedPresets);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPresets));
    } catch (error) {
      console.error("Error saving presets after deletion:", error);
      alert("Failed to update presets after deletion.");
      // Optionally revert state
      setSavedPresets(savedPresets);
    }
  };
  // --- End Preset Handling Functions ---

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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
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
            className={`px-4 py-2 border rounded-xl transition-colors ${showBackground
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
            backgroundColor: backgroundImage ? undefined : sceneBgColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
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

  {isFloatingCardDisabled ? null : (
  <div
  id="main-title"
  className="absolute text-center font-bold cursor-move z-20 pointer-events-auto px-4 py-2 rounded-xl shadow-md"
  style={{
    top: `${titlePos.y}%`,
    left: `${titlePos.x}%`,
    transform: 'translate(-50%, -50%)',
    color: textColor,
    backgroundColor: titleBgColor,
    fontFamily: "'Inter', sans-serif",
    fontSize: `${titleFontSize}px`
  }}
>
  <div className="drop-shadow-lg">{mainTitle}</div>
  <div
    className="mt-1 drop-shadow-md font-normal"
    style={{ fontSize: `${subtitleFontSize}px` }}
  >
    {subTitle}
  </div>
</div>
)}

{isFloatingCardTwoDisabled ? null : (
  <div
    id="floating-card"
    className="absolute rounded-xl px-4 py-3 cursor-move z-20 pointer-events-auto shadow-lg"
    style={{
      top: `${cardPos.y}%`,
    left: `${cardPos.x}%`,
    transform: 'translate(-50%, -50%)',
    color: textColor,
    backgroundColor: titleBgColor,
    fontFamily: "'Inter', sans-serif",
    fontSize: `${cardFontSize}px`
  }}
>
  {floatingCardText}
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
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.NoToneMapping,
          }}
          style={{
            width: '100%',
            height: '100%',
            background: backgroundImage ? 'transparent' : sceneBgColor,
          }}
          flat
          frameloop={isAutoRotating ? 'always' : 'demand'}
        >
          <Suspense fallback={null}>
            <CameraController zoom={zoom} />
            <ModelAnimationController
              rotationX={modelRotationX}
              rotationY={modelRotationY}
              rotationZ={modelRotationZ}
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
                paddingHorizontal={paddingHorizontal}
                paddingVertical={paddingVertical}
                onRotationChange={handleRotationChange}
                onZRotationChange={handleZRotationChange}
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

      {/* Parameter Display & Save Preset Button (Modify this section) */}
      <div className="w-full flex items-center justify-between gap-4 mt-4 mb-2">
        <div className="flex-grow bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 grid grid-cols-6 gap-2 shadow-sm">
          <div>Zoom: <span className="font-mono text-gray-800">{zoom.toFixed(1)}</span></div>
          <div>H Pos: <span className="font-mono text-gray-800">{positionX.toFixed(1)}</span></div>
          <div>V Pos: <span className="font-mono text-gray-800">{positionY.toFixed(1)}</span></div>
          <div>X Rot: <span className="font-mono text-gray-800">{(modelRotationX * 180 / Math.PI).toFixed(1)}°</span></div>
          <div>Y Rot: <span className="font-mono text-gray-800">{(modelRotationY * 180 / Math.PI).toFixed(1)}°</span></div>
          <div>Z Rot: <span className="font-mono text-gray-800">{(modelRotationZ * 180 / Math.PI).toFixed(1)}°</span></div>
        </div>
        <button
          onClick={handleSavePreset}
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#1c1f23] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm"
          title="Save Current View as Preset"
        >
          <Save size={14} />
          Save Preset
        </button>
      </div>

      {/* Saved Presets List (Updated UI/UX) */}
      {savedPresets.length > 0 && (
        <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-medium text-[#1c1f23] mb-3">Saved Presets</h3>
          <div className="flex flex-wrap gap-2">
            {savedPresets.map((preset) => (
              <div key={preset.name} className="relative group">
                <button
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors shadow-sm pr-8" // Add padding-right for delete button space
                  title={`Apply preset: ${preset.name}`}
                >
                  {preset.name}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent applying preset when deleting
                    handleDeletePreset(preset.name);
                  }}
                  className="absolute top-1/2 right-1.5 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Preset"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Panels */}
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
                onClick={() => {
                  setModelRotationX(0);
                  setModelRotationY(0);
                  setPositionX(0);
                  setPositionY(0);
                  setModelRotationZ(0);
                }}
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
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg shadow-sm text-sm ${isAutoRotating
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

            {/* Add Rotation Direction Control Here */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="rotDir" className="text-sm text-gray-600">Auto-Rotation Direction</label>
              </div>
              <div className="flex border rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setRotationDirection('clockwise')}
                  className={`w-1/2 py-1.5 text-xs ${rotationDirection === 'clockwise'
                    ? 'bg-[#6ee7b7]/10 text-[#10b981] font-medium'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  Clockwise
                </button>
                <button
                  onClick={() => setRotationDirection('counterclockwise')}
                  className={`w-1/2 py-1.5 text-xs ${rotationDirection === 'counterclockwise'
                    ? 'bg-[#6ee7b7]/10 text-[#10b981] font-medium'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  Counter-clockwise
                </button>
              </div>
            </div>

            {/* Add X Rotation Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="rotX" className="text-sm text-gray-600">X Rotation</label>
                <span className="text-xs text-gray-500">{(modelRotationX * 180 / Math.PI).toFixed(1)}°</span>
              </div>
              <input
                id="rotX"
                type="range"
                min="-90"  // Limit X rotation to -90 to +90 degrees
                max="90"
                step="1"
                value={modelRotationX * 180 / Math.PI}
                onChange={(e) => setModelRotationX(Number(e.target.value) * Math.PI / 180)}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>

            {/* Add Y Rotation Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="rotY" className="text-sm text-gray-600">Y Rotation</label>
                <span className="text-xs text-gray-500">{(modelRotationY * 180 / Math.PI).toFixed(1)}°</span>
              </div>
              <input
                id="rotY"
                type="range"
                min="-180"
                max="180"
                step="1"
                value={modelRotationY * 180 / Math.PI}
                onChange={(e) => setModelRotationY(Number(e.target.value) * Math.PI / 180)}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>

            {/* Z Rotation Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="rotZ" className="text-sm text-gray-600">Z Rotation</label>
                <span className="text-xs text-gray-500">{(modelRotationZ * 180 / Math.PI).toFixed(1)}°</span>
              </div>
              <input
                id="rotZ"
                type="range"
                min="-180"
                max="180"
                step="1"
                value={modelRotationZ * 180 / Math.PI}
                onChange={(e) => setModelRotationZ(Number(e.target.value) * Math.PI / 180)}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
              {/* Add Hint for Shift + Drag */}
              <p className="text-xs text-gray-500 mt-1.5 text-center">Tip: Hold <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">Shift</kbd> + Drag Horizontally to rotate Z-axis.</p>
            </div>

          </div>
        </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="space-y-3 mt-4">
    <div>
      <label className="text-sm text-gray-600">Title Font Size</label>
      <input
        type="range"
        min={16}
        max={72}
        step={1}
        value={titleFontSize}
        onChange={(e) => setTitleFontSize(Number(e.target.value))}
        className="w-full"
      />
      <span className="text-xs text-gray-500">{titleFontSize}px</span>
    </div>

    <div>
      <label className="text-sm text-gray-600">Subtitle Font Size</label>
      <input
        type="range"
        min={10}
        max={36}
        step={1}
        value={subtitleFontSize}
        onChange={(e) => setSubtitleFontSize(Number(e.target.value))}
        className="w-full"
      />
      <span className="text-xs text-gray-500">{subtitleFontSize}px</span>
    </div>

    <div>
      <label className="text-sm text-gray-600">Floating Card Font Size</label>
      <input
        type="range"
        min={10}
        max={36}
        step={1}
        value={cardFontSize}
        onChange={(e) => setCardFontSize(Number(e.target.value))}
        className="w-full"
      />
      <span className="text-xs text-gray-500">{cardFontSize}px</span>
    </div>
  </div>


  <div className="space-y-2">
    <input
      type="text"
      value={mainTitle}
      onChange={(e) => setMainTitle(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 text-sm"
      placeholder="Main Title"
    />
    <input
      type="text"
      value={subTitle}
      onChange={(e) => setSubTitle(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 text-sm"
      placeholder="Subtitle"
    />
    <input
      type="text"
      value={floatingCardText}
      onChange={(e) => setFloatingCardText(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2 text-sm"
      placeholder="Floating Card Text"
    />

    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Text Color</label>
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
        className="w-8 h-8 rounded-md border border-gray-300"
      />
    </div>

    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Background</label>
      <input
        type="color"
        value={rgbStringToHex(titleBgColor)}
        onChange={(e) => {
          const hex = e.target.value;
          setTitleBgColor(hex + 'cc'); // cc = ~80% opacity
        }}
        className="w-8 h-8 rounded-md border border-gray-300"
      />
    </div>
    {/* opacity */}
    <div className="flex items-center gap-2">
  <label className="text-sm text-gray-600">Opacity</label>
      <input
        type="range"
        min="0"
        max="255"
        
        value={parseInt(titleBgColor.slice(7, 9), 16)} // Extract opacity from hex
        onChange={(e) => {
          const opacity = parseInt(e.target.value, 10);
          setTitleBgColor(rgbStringToHex(titleBgColor.slice(0, 7)) + opacity.toString(16).padStart(2, '0'));
        }}
        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
      />
      
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Floating Card Title Disabled </label>
        <input
          type="checkbox"
          checked={isFloatingCardDisabled}
          onChange={(e) => setIsFloatingCardDisabled(e.target.checked)}
          className="w-4 h-4 rounded border border-gray-300 focus:ring-[#6ee7b7] focus:ring-opacity-50"
        />
        <span className="text-xs text-gray-500">Disable Floating Card</span>  
        </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Floating Card Subtitle Disabled </label>
        <input
          type="checkbox"
          checked={isFloatingCardTwoDisabled}
          onChange={(e) => setIsFloatingCardTwoDisabled(e.target.checked)}
          className="w-4 h-4 rounded border border-gray-300 focus:ring-[#6ee7b7] focus:ring-opacity-50"
        />
        <span className="text-xs text-gray-500">Disable Floating Card 2</span>  
        </div>
  </div>
  </div>

  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <div className="flex items-center gap-2">
  <label className="text-sm text-gray-600">Background Color</label>
  <input
    type="color"
    value={sceneBgColor}
    onChange={(e) => setSceneBgColor(e.target.value)}
    className="w-8 h-8 rounded-md border border-gray-300"
  />
</div>
<button
  onClick={captureAndDisplayScreenshots}
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
>
  Générer toutes les captures
</button>
{screenshots.length > 0 && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-100 mt-4">
    {screenshots.map((shot) => (
      <div key={shot.filename} className="border rounded shadow bg-white p-2 flex flex-col items-center">
        <img src={shot.filename} alt={shot.label} className="w-full h-auto mb-2" />
        <div className="text-sm text-gray-700">{shot.label}</div>
      </div>
    ))}
  </div>
)}
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
                <label htmlFor="metalness" className="text-sm text-gray-600">Shell Metalness</label>
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
                <label htmlFor="roughness" className="text-sm text-gray-600">Shell Roughness</label>
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
                <label htmlFor="paddingHorizontal" className="text-sm text-gray-600">Horizontal Padding</label>
                <span className="text-xs text-gray-500">{((1 - paddingHorizontal) * 100).toFixed(0)}% width</span>
              </div>
              <input
                id="paddingHorizontal"
                type="range"
                min="0.01" max="0.20" step="0.005"
                value={paddingHorizontal}
                onChange={(e) => setPaddingHorizontal(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="paddingVertical" className="text-sm text-gray-600">Vertical Padding</label>
                <span className="text-xs text-gray-500">{((1 - paddingVertical) * 100).toFixed(0)}% height</span>
              </div>
              <input
                id="paddingVertical"
                type="range"
                min="0.01" max="0.20" step="0.005"
                value={paddingVertical}
                onChange={(e) => setPaddingVertical(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#6ee7b7]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}