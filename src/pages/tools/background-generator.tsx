"use client";

import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { BackgroundGenerator } from '@/components/tools/background-generator';
import { JsonLd } from '@/components/JsonLd';
import { Header } from '@/components/Header';

// 草叶SVG组件
const Grass = ({ className = '', style = {}, ...props }) => (
  <svg 
    viewBox="0 0 100 80" 
    className={`${className}`}
    style={{ ...style }}
    {...props}
  >
    <path 
      d="M10,80 Q25,30 30,70 Q35,20 40,75 Q45,40 50,80 Q55,30 60,75 Q65,45 70,80 Q75,25 80,70 Q85,55 90,80" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
    />
  </svg>
);

// 飞鸟组件
const Birds = ({ className = '', ...props }) => (
  <svg 
    viewBox="0 0 200 100" 
    className={`${className}`}
    {...props}
  >
    <path 
      d="M20,40 Q30,30 40,40 Q50,30 60,40" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none" 
    />
    <path 
      d="M120,20 Q130,10 140,20 Q150,10 160,20" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none" 
    />
    <path 
      d="M140,50 Q150,40 160,50 Q170,40 180,50" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none" 
    />
  </svg>
);

interface Props {
  canonicalUrl: string;
}

const BackgroundGeneratorPage: NextPage<Props> = ({ canonicalUrl }) => {
  const year = new Date().getFullYear();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Background Generator",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free online tool to create beautiful polygon backgrounds for your website, social media, and design projects. Generates customizable backgrounds instantly.",
    "featureList": [
      "Polygon background generation",
      "Customizable colors",
      "Multiple preset sizes",
      "Adjustable parameters",
      "Browser-based processing",
      "No server uploads required",
      "High-quality downloads"
    ]
  };

  return (
    <>
      <Head>
        <title>Background Generator - Create Beautiful Polygon Backgrounds | AppCrafter</title>
        <meta 
          name="description" 
          content="Free online tool to create beautiful polygon backgrounds for websites, social media, and design projects. Customizable colors and patterns with instant generation."
        />
        <meta 
          name="keywords" 
          content="background generator, polygon background, geometric background, design tool, website background, trianglify, online generator, pattern maker"
        />
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" href="https://appcrafter.dev/tools/background-generator" hrefLang="en" />
        <link rel="alternate" href="https://appcrafter.dev/zh/tools/background-generator" hrefLang="zh" />
        <link rel="alternate" href="https://appcrafter.dev/tools/background-generator" hrefLang="x-default" />
        
        <meta property="og:title" content="Background Generator - Create Beautiful Polygon Backgrounds | AppCrafter" />
        <meta property="og:description" content="Free online tool to create beautiful polygon backgrounds for websites, social media, and design projects. Customizable colors and patterns with instant generation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Background Generator - Create Beautiful Polygon Backgrounds | AppCrafter" />
        <meta name="twitter:description" content="Free online tool to create beautiful polygon backgrounds for websites, social media, and design projects. Customizable colors and patterns with instant generation." />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AppCrafter" />
      </Head>

      <JsonLd data={structuredData} />

      {/* 吉卜力风格的全局样式 */}
      <style jsx global>{`
        :root {
          --ghibli-blue: #86A7C5;
          --ghibli-green: #91AD70;
          --ghibli-brown: #D6A489;
          --ghibli-pink: #E4B4B4;
          --ghibli-purple: #BFC2DE;
          --ghibli-beige: #F6F3E9;
        }
        
        body {
          background-color: var(--ghibli-beige);
          color: #4A5568;
          overflow-x: hidden;
        }
        
        /* 纸张质感纹理 */
        .paper-texture {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }
        
        /* 手绘卡片效果 */
        .hand-drawn-card {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .hand-drawn-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid rgba(0,0,0,0.08);
          border-radius: inherit;
          transform: translate(3px, 3px);
          z-index: -1;
          transition: transform 0.3s ease;
        }
        
        /* 水彩效果 */
        .watercolor-bg {
          position: relative;
        }
        
        .watercolor-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='watercolor'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.02' numOctaves='3' result='noise'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='5' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23watercolor)' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>

      <div className="min-h-screen flex flex-col overflow-hidden relative paper-texture">
        {/* 带有纸张质感的魔法背景 */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(#91AD70_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        
        {/* 纯天空背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {/* 飞鸟 */}
          <Birds className="absolute text-gray-600 opacity-30 w-[400px]" style={{ top: '10%', right: '10%' }} />
        </div>
        
        {/* 草叶装饰 - 底部 */}
        <div className="absolute bottom-0 left-0 right-0 h-[100px] overflow-hidden pointer-events-none">
          <Grass className="absolute text-[#91AD70] opacity-40 w-[200px]" style={{ bottom: '0', left: '5%' }} />
          <Grass className="absolute text-[#91AD70] opacity-30 w-[150px]" style={{ bottom: '0', left: '20%' }} />
          <Grass className="absolute text-[#91AD70] opacity-50 w-[180px]" style={{ bottom: '0', left: '40%' }} />
          <Grass className="absolute text-[#91AD70] opacity-40 w-[220px]" style={{ bottom: '0', left: '60%' }} />
          <Grass className="absolute text-[#91AD70] opacity-30 w-[160px]" style={{ bottom: '0', left: '80%' }} />
        </div>
        
        <Header />
        
        <main className="flex-grow relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative">
            <div className="text-center mb-12 relative">
              <div className="inline-block relative px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 tracking-tight relative z-10">
                  Background Generator
                </h1>
                <div className="absolute -bottom-1 left-0 right-0 h-3 bg-[#BFC2DE] opacity-20 -skew-x-1 z-0"></div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
                Create beautiful polygon backgrounds for your projects
              </p>
            </div>

            <div className="hand-drawn-card p-0.5 overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm mb-16 watercolor-bg">
              <div className="p-5 sm:p-6 md:p-7 relative z-10 rounded-2xl border-2 border-gray-50">
                <BackgroundGenerator />
              </div>
            </div>

            <section className="mb-12 md:mb-16">
              <div className="flex items-center mb-6">
                <div className="mr-3 text-[#86A7C5]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01"></path>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 relative">
                  About Our Background Generator Tool
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-[#86A7C5]/30"></div>
                </h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Our Background Generator is a powerful online tool designed to create beautiful polygon backgrounds for your websites, social media profiles, presentations, and design projects. With a focus on simplicity and flexibility, this tool allows you to generate custom backgrounds in seconds without any design skills required.
                </p>
                <p>
                  The backgrounds are created using an advanced algorithm that generates polygonal patterns with smooth color transitions. You can customize every aspect of your background, from the colors and pattern density to the dimensions and variations in the geometry.
                </p>
                <p>
                  Whether you're a web developer, designer, content creator, or just someone who needs a beautiful background for a project, our Background Generator provides the perfect solution that combines aesthetic appeal with practical functionality.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4 inline-block relative">
                  Key Features of Our Background Generator
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#D6A489]/20"></div>
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#91AD70] mr-2">•</span>
                    <span><strong>Polygon Pattern Generation:</strong> Create stunning geometric patterns with triangular polygons</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#91AD70] mr-2">•</span>
                    <span><strong>Color Customization:</strong> Choose or randomly generate color schemes for your backgrounds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#91AD70] mr-2">•</span>
                    <span><strong>Preset Sizes:</strong> Ready-made dimensions for common use cases like social media covers and wallpapers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#91AD70] mr-2">•</span>
                    <span><strong>Pattern Adjustments:</strong> Fine-tune cell size and variance to get exactly the pattern you want</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#91AD70] mr-2">•</span>
                    <span><strong>Browser-based Processing:</strong> Generate backgrounds directly in your browser with no software installation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#91AD70] mr-2">•</span>
                    <span><strong>Privacy-Focused:</strong> All processing happens locally on your device with no data sent to servers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#91AD70] mr-2">•</span>
                    <span><strong>High-Quality Downloads:</strong> Download your backgrounds as high-resolution PNG images</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12 md:mb-16">
              <div className="flex items-center mb-6">
                <div className="mr-3 text-[#D6A489]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 relative">
                  Why Choose Our Background Generator?
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-[#D6A489]/30"></div>
                </h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  In the world of digital design, having access to quick and customizable background solutions can save time and enhance creativity. Our Background Generator stands out for several key reasons:
                </p>
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-6">
                  <div className="hand-drawn-card p-0.5 overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
                    <div className="p-5 md:p-6 relative z-10 rounded-xl border-2 border-gray-50 h-full">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-[#86A7C5] mr-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </span>
                        Instant Results
                      </h3>
                      <p className="text-gray-600">
                        Creating custom backgrounds from scratch can be time-consuming and requires specific design skills. Our Background Generator produces professional-quality results instantly, allowing you to experiment with different designs rapidly and find the perfect background for your needs.
                      </p>
                    </div>
                  </div>
                  <div className="hand-drawn-card p-0.5 overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
                    <div className="p-5 md:p-6 relative z-10 rounded-xl border-2 border-gray-50 h-full">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-[#91AD70] mr-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </span>
                        Versatility
                      </h3>
                      <p className="text-gray-600">
                        With multiple preset sizes and fully customizable parameters, our tool caters to a wide range of use cases. From website backgrounds to social media headers, presentation backgrounds to digital art projects, the possibilities are virtually endless.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-6">
                  <div className="hand-drawn-card p-0.5 overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
                    <div className="p-5 md:p-6 relative z-10 rounded-xl border-2 border-gray-50 h-full">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-[#E4B4B4] mr-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="18" r="3"></circle>
                            <circle cx="6" cy="6" r="3"></circle>
                            <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                            <path d="M11 18v-3a2 2 0 0 0-2-2H6"></path>
                          </svg>
                        </span>
                        Unique Designs
                      </h3>
                      <p className="text-gray-600">
                        The combination of color choices, cell sizes, and variance patterns ensures that every background you create is unique. Even with the same settings, the random seed generates different variations, giving you endless possibilities for original designs.
                      </p>
                    </div>
                  </div>
                  <div className="hand-drawn-card p-0.5 overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
                    <div className="p-5 md:p-6 relative z-10 rounded-xl border-2 border-gray-50 h-full">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="text-[#BFC2DE] mr-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                          </svg>
                        </span>
                        User-Friendly Interface
                      </h3>
                      <p className="text-gray-600">
                        Our intuitive interface makes it easy for anyone to create beautiful backgrounds without a steep learning curve. The real-time preview shows you exactly what your background will look like as you adjust the settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 装饰性的手绘分隔符 */}
            <div className="flex justify-center my-12 md:my-16">
              <svg width="200" height="20" viewBox="0 0 200 20" className="text-gray-300">
                <path d="M0,10 C30,5 50,15 70,10 C90,5 110,15 130,10 C150,5 170,15 200,10" stroke="currentColor" fill="none" strokeWidth="1.5" strokeDasharray="5,5" />
                <circle cx="100" cy="10" r="3" fill="#86A7C5" />
              </svg>
            </div>

            <section className="mb-12 md:mb-16">
              <div className="flex items-center mb-6">
                <div className="mr-3 text-[#91AD70]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 relative">
                  How to Use the Background Generator
                  <div className="absolute bottom-0 left-0 w-16 h-1 bg-[#91AD70]/30"></div>
                </h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Creating beautiful polygon backgrounds with our tool is straightforward and intuitive. Follow these simple steps to get started:
                </p>
                <ol className="space-y-4 list-none pl-0 mt-6">
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#86A7C5]/20 text-[#86A7C5] font-semibold mr-3 flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-gray-800">Choose a Size Preset:</strong> Select from our list of common size presets like Desktop Wallpaper, Mobile Wallpaper, or various social media formats. If you need a custom size, select the "Custom Size" option and adjust the width and height using the sliders.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#86A7C5]/20 text-[#86A7C5] font-semibold mr-3 flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-gray-800">Adjust the Pattern:</strong> Use the Cell Size slider to control the density of the polygon pattern. Smaller values create more detailed patterns with smaller triangles, while larger values create bolder patterns with larger shapes.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#86A7C5]/20 text-[#86A7C5] font-semibold mr-3 flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-gray-800">Set the Variance:</strong> The Variance slider controls how much randomness is introduced into the pattern. Lower values create more uniform, grid-like patterns, while higher values create more organic, varied patterns.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#86A7C5]/20 text-[#86A7C5] font-semibold mr-3 flex-shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-gray-800">Choose Your Colors:</strong> Select the colors for your background using the color pickers. You can choose three colors that will be used to create a gradient effect across the pattern. For inspiration, click the random color button to generate color combinations.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#86A7C5]/20 text-[#86A7C5] font-semibold mr-3 flex-shrink-0 mt-0.5">5</span>
                    <div>
                      <strong className="text-gray-800">Preview and Download:</strong> Your background will be generated in real-time as you make adjustments. Once you're satisfied with the result, click the "Download Image" button to save your custom background as a PNG file.
                    </div>
                  </li>
                </ol>
                <p>
                  The entire process happens instantly in your browser, allowing you to experiment with different settings and download as many variations as you like.
                </p>
              </div>
            </section>
          </div>
        </main>

        <Footer />
        
        {/* 吉卜力风格页脚版权信息 */}
        <div className="text-center py-4 text-sm text-gray-500 bg-[#86A7C5]/5 border-t border-[#86A7C5]/10">
          <p>© {year} AppCrafter.dev • Made with ✨ magical code</p>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      canonicalUrl: "https://appcrafter.dev/tools/background-generator",
    }
  };
};

export default BackgroundGeneratorPage; 