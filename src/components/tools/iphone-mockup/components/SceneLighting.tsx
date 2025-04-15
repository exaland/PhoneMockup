'use client';

interface SceneLightingProps {
  ambientIntensity: number;
  pointLightIntensity: number;
}

export function SceneLighting({ ambientIntensity, pointLightIntensity }: SceneLightingProps) {
  return (
    <>
      <ambientLight intensity={ambientIntensity * 0.3} />
      <pointLight 
        position={[20, 20, 20]} 
        intensity={pointLightIntensity * 0.8}
        color="#ffffff"
        distance={80}
        decay={2}
      />
      <pointLight 
        position={[-20, -20, -20]} 
        intensity={pointLightIntensity * 0.4}
        color="#b0c4de"
        distance={80}
        decay={2}
      />
      <pointLight 
        position={[30, 0, 0]} 
        intensity={pointLightIntensity * 0.3}
        color="#ffd700"
        distance={80}
        decay={2}
      />
      <pointLight 
        position={[-30, 0, 0]} 
        intensity={pointLightIntensity * 0.3}
        color="#87ceeb"
        distance={80}
        decay={2}
      />
    </>
  );
} 