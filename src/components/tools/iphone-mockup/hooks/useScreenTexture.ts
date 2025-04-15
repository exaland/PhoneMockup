import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function useScreenTexture(url: string | null | undefined): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!url) {
      setTexture(null);
      return;
    }

    // 处理图片
    const textureLoader = new THREE.TextureLoader();
    const loadedTexture = textureLoader.load(
      url,
      (tex) => {
        console.log('Texture loaded:', {
          size: `${tex.image.width}x${tex.image.height}`,
          url: url
        });
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

    // 基本配置
    loadedTexture.flipY = true;
    loadedTexture.colorSpace = THREE.SRGBColorSpace;
    // 添加高质量纹理设置
    loadedTexture.minFilter = THREE.LinearFilter;
    loadedTexture.magFilter = THREE.LinearFilter;
    loadedTexture.generateMipmaps = true;
    loadedTexture.anisotropy = 16;
    loadedTexture.needsUpdate = true;

    setTexture(loadedTexture);

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [url]);

  return texture;
} 