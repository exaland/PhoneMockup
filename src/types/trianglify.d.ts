declare module 'trianglify' {
  interface TrianglifyOptions {
    width: number;
    height: number;
    cellSize?: number;
    variance?: number;
    seed?: string;
    xColors?: string[] | 'random';
    yColors?: string[] | 'match';
    fill?: boolean;
    strokeWidth?: number;
    points?: [number, number][];
    colorSpace?: 'rgb' | 'hsv' | 'hsl' | 'lab';
    colorFunction?: (options: any) => string;
  }

  interface TrianglifyPattern {
    toCanvas(canvas?: HTMLCanvasElement): HTMLCanvasElement;
    toSVG(node?: SVGElement): SVGElement;
    toString(): string;
  }

  interface TrianglifyStatic {
    (options: TrianglifyOptions): TrianglifyPattern;
    colorFunctions: {
      sparkle: (factor: number) => (options: any) => string;
      shadows: () => (options: any) => string;
      interpolateLinear: (bias: number) => (options: any) => string;
    };
  }

  const trianglify: TrianglifyStatic;
  export default trianglify;
} 