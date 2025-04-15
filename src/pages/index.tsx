import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import dynamic from 'next/dynamic';
import { ArrowRight, ExternalLink, Smartphone, Monitor, Wifi, Cloud, Download, Check, Zap, Shield } from 'lucide-react';

// Dynamic import of client-side component
const IphoneMockup = dynamic(
  () => import('@/components/tools/iphone-mockup/IphoneMockup').then(mod => mod.IphoneMockup),
  { ssr: false }
);

interface Props {
  canonicalUrl: string;
  alternateUrls: {
    en: string;
    zh: string;
    default: string;
  };
}

const HomePage: NextPage<Props> = ({ canonicalUrl, alternateUrls }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Phone Mockup Generator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "http://schema.org/InStock"
    },
    "description": "Create stunning 3D Phone mockups for your app screenshots. Perfect for App Store listings, marketing materials, and presentations.",
    "featureList": [
      "Interactive 3D preview",
      "Multiple device frames",
      "High-quality rendering",
      "Easy screenshot upload",
      "Instant preview",
      "Free to use",
      "No watermarks"
    ],
    "applicationSubCategory": "Design Tools",
    "screenshot": "https://phonemockup-online.dev/og/mockup-generator.png",
    "softwareVersion": "1.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "156"
    },
    "author": {
      "@type": "Organization",
      "name": "Phone Mockup",
      "url": "https://phonemockup-online.dev"
    },
    "inLanguage": ["en", "zh"],
    "license": "https://phonemockup-online.dev/terms",
    "url": canonicalUrl
  };

  return (
    <>
      <Head>
        <title>Phone Mockup Generator | Free 3D Mobile Device Mockups</title>
        <meta 
          name="description" 
          content="Create stunning 3D Phone mockups for your app screenshots. Our free Phone Mockup tool is perfect for marketing materials, App Store listings, and presentations."
        />
        <meta 
          name="keywords" 
          content="phone mockup, mobile mockup, 3D mockup tool, app screenshot generator, ios mockup creator, android mockup, free mockup generator, phone frame, device mockup"
        />
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" href={alternateUrls.en} hrefLang="en" />
        <link rel="alternate" href={alternateUrls.zh} hrefLang="zh" />
        <link rel="alternate" href={alternateUrls.default} hrefLang="x-default" />
        
        <meta property="og:title" content="Phone Mockup Generator | Free 3D Mobile Device Mockups" />
        <meta property="og:description" content="Create stunning 3D Phone mockups for your app screenshots. Our free Phone Mockup tool is perfect for marketing materials, App Store listings, and presentations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Phone Mockup Generator | Free 3D Mobile Device Mockups" />
        <meta name="twitter:description" content="Create stunning 3D Phone mockups for your app screenshots. Our free Phone Mockup tool is perfect for marketing materials, App Store listings, and presentations." />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Phone Mockup" />
      </Head>

      <JsonLd data={structuredData} />

      <div className="min-h-screen bg-[#f8f9fa]">
        <Header />
        
        {/* Hero Section with full-width text layout */}
        <div className="bg-[#1c1f23] text-white py-16 md:py-24">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6ee7b7]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#6ee7b7]/5 rounded-full blur-3xl"></div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
                Phone Mockup <span className="text-[#6ee7b7]">Generator</span>
              </h1>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/5 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6ee7b7]/0 via-[#6ee7b7] to-[#6ee7b7]/0"></div>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Transform your app screenshots into stunning 3D Phone mockups with our free, easy-to-use mockup generator
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                <div className="bg-white/5 backdrop-blur-sm px-6 py-4 rounded-xl flex-1 max-w-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-shrink-0 w-1 h-6 bg-[#6ee7b7] rounded-full"></div>
                    <h2 className="text-lg font-medium text-[#6ee7b7]">For Designers</h2>
                  </div>
                  <p className="text-gray-300">Create professional-looking device frames for your UI designs</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm px-6 py-4 rounded-xl flex-1 max-w-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-shrink-0 w-1 h-6 bg-[#6ee7b7] rounded-full"></div>
                    <h2 className="text-lg font-medium text-[#6ee7b7]">For Marketers</h2>
                  </div>
                  <p className="text-gray-300">Showcase mobile applications in professional marketing contexts</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">App Store</span>
                <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">Marketing</span>
                <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">Presentations</span>
                <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">Portfolio</span>
                <span className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-300">Social Media</span>
              </div>
              
              <a 
                href="#mockup-tool" 
                className="inline-flex items-center gap-2 bg-[#6ee7b7] hover:bg-[#4aca94] text-[#1c1f23] font-medium py-3 px-8 rounded-full transition-all text-lg"
              >
                Try Phone Mockup Generator <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Mockup Tool Section */}
        <div id="mockup-tool" className="py-16 md:py-24">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c1f23] mb-4">
                Create Your Phone Mockup
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your screenshot and customize your 3D Phone mockup in seconds - no design skills required
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <IphoneMockup />
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="py-16 md:py-20 bg-[#f1f5f9]">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c1f23] mb-4">
                Phone Mockup Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to create professional device mockups for your mobile applications
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#6ee7b7]/20 flex items-center justify-center rounded-xl mb-6">
                  <Smartphone className="w-6 h-6 text-[#10b981]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Interactive 3D Preview</h3>
                <p className="text-gray-600">Rotate and adjust your Phone mockup in real-time with our interactive 3D viewer for the perfect angle</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#93c5fd]/20 flex items-center justify-center rounded-xl mb-6">
                  <Monitor className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Multiple Device Frames</h3>
                <p className="text-gray-600">Choose from various phone models to showcase your app in the perfect context with our Phone Mockup tool</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#fda4af]/20 flex items-center justify-center rounded-xl mb-6">
                  <Wifi className="w-6 h-6 text-[#f43f5e]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1f23] mb-3">High-Quality Rendering</h3>
                <p className="text-gray-600">Get crisp, professional-looking Phone mockup results ready for marketing materials and presentations</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#fdba74]/20 flex items-center justify-center rounded-xl mb-6">
                  <Cloud className="w-6 h-6 text-[#f97316]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Privacy-Focused</h3>
                <p className="text-gray-600">All Phone Mockup processing happens in your browser - your screenshots and files stay private</p>
        </div>
        
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#c4b5fd]/20 flex items-center justify-center rounded-xl mb-6">
                  <Download className="w-6 h-6 text-[#8b5cf6]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Instant Download</h3>
                <p className="text-gray-600">Download your Phone mockups immediately with no watermarks or usage restrictions</p>
        </div>
        
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#a5b4fc]/20 flex items-center justify-center rounded-xl mb-6">
                  <Check className="w-6 h-6 text-[#6366f1]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Completely Free</h3>
                <p className="text-gray-600">Our Phone Mockup generator is 100% free with all features available - no hidden fees or limitations</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* How to Use Section */}
        <div className="py-16 md:py-24">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c1f23] mb-4">
                How To Create Phone Mockups
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create professional Phone mockups in three simple steps with our easy-to-use tool
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-16 h-16 bg-[#1c1f23] text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                <div className="bg-white p-8 pt-12 rounded-2xl shadow-md h-full">
                  <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Upload Your Screenshot</h3>
                  <p className="text-gray-600">Select or drag and drop your app screenshot into the Phone Mockup upload area. We support various image formats including PNG and JPG.</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-16 h-16 bg-[#1c1f23] text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                <div className="bg-white p-8 pt-12 rounded-2xl shadow-md h-full">
                  <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Preview in 3D</h3>
                  <p className="text-gray-600">See your screenshot in an interactive 3D Phone mockup that you can rotate and adjust to find the perfect presentation angle.</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-16 h-16 bg-[#1c1f23] text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                <div className="bg-white p-8 pt-12 rounded-2xl shadow-md h-full">
                  <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Download Your Mockup</h3>
                  <p className="text-gray-600">Customize the view angle and download your finished Phone mockup in high resolution for immediate use in your projects.</p>
                </div>
                      </div>
                      </div>
                    </div>
                  </div>
                  
        {/* Benefits Section - New */}
        <div className="py-16 md:py-20 bg-[#f1f5f9]">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1c1f23] mb-4">
                Why Choose Our Phone Mockup Tool
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our Phone Mockup generator offers unique advantages for developers, designers and marketers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#6ee7b7]/20 flex items-center justify-center rounded-xl mb-6">
                  <Zap className="w-6 h-6 text-[#10b981]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Time-Saving</h3>
                <p className="text-gray-600">Create professional Phone mockups in seconds instead of spending hours in complex design software. Our Phone Mockup tool streamlines the entire process.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#93c5fd]/20 flex items-center justify-center rounded-xl mb-6">
                  <Shield className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1f23] mb-3">Secure Processing</h3>
                <p className="text-gray-600">All Phone Mockup processing happens client-side. Your app screenshots never leave your browser, ensuring complete privacy for sensitive designs.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Use Cases Section */}
        <div className="py-16 md:py-24 bg-[#1c1f23] text-white">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Phone Mockup Applications
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Our Phone mockups help you showcase your mobile app in multiple professional contexts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold text-[#6ee7b7] mb-3">App Store Listings</h3>
                <p className="text-gray-300 mb-4">Create professional Phone mockups for your App Store and Google Play screenshots to attract more downloads and showcase your mobile app in context</p>
                <ExternalLink className="text-[#6ee7b7] w-6 h-6" />
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold text-[#6ee7b7] mb-3">Marketing Materials</h3>
                <p className="text-gray-300 mb-4">Use Phone mockups in your social media posts, website, and promotional materials to make your mobile app visuals stand out from the competition</p>
                <ExternalLink className="text-[#6ee7b7] w-6 h-6" />
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold text-[#6ee7b7] mb-3">Presentations</h3>
                <p className="text-gray-300 mb-4">Enhance your pitch decks and presentations with professional Phone mockups that impress clients and stakeholders with polished app visuals</p>
                <ExternalLink className="text-[#6ee7b7] w-6 h-6" />
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/15 transition-colors">
                <h3 className="text-xl font-bold text-[#6ee7b7] mb-3">Portfolio</h3>
                <p className="text-gray-300 mb-4">Showcase your mobile app development work in a professional and attractive way with Phone mockups that highlight your design skills</p>
                <ExternalLink className="text-[#6ee7b7] w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="py-16 md:py-20 bg-[#f1f5f9]">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c1f23] mb-6">
              Create Your Phone Mockup Today
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Our free Phone Mockup generator is ready to transform your screenshots into professional device mockups
            </p>
            <a 
              href="#mockup-tool" 
              className="inline-flex items-center gap-2 bg-[#1c1f23] hover:bg-[#2d3748] text-white font-medium py-3 px-8 rounded-full transition-all text-lg"
            >
              Try Phone Mockup Generator <ArrowRight size={20} />
            </a>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const baseUrl = 'https://phonemockup-online.dev';
  const path = '/';
  
  return {
    props: {
      canonicalUrl: `${baseUrl}${path}`,
      alternateUrls: {
        en: `${baseUrl}${path}`,
        zh: `${baseUrl}/zh${path}`,
        default: `${baseUrl}${path}`
      }
    }
  };
};

export default HomePage;