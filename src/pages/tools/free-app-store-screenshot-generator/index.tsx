import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import dynamic from 'next/dynamic';
import { getUrlConfig, UrlConfig } from '@/utils/url';

// Dynamic import of client-side component
const ScreenshotGenerator = dynamic(
  () => import('@/components/tools/screenshot-generator/ScreenshotGenerator').then(mod => mod.ScreenshotGenerator),
  { ssr: false }
);

interface Props extends UrlConfig {}

const ScreenshotGeneratorPage: NextPage<Props> = ({ canonicalUrl, alternateUrls }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "App Store Screenshot Generator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Create beautiful App Store screenshots with custom backgrounds, frames, and text overlays. Perfect for iOS app marketing.",
    "featureList": [
      "Support for iPhone and iPad screenshots",
      "Beautiful gradient backgrounds",
      "Customizable text overlays",
      "Adjustable frame sizes",
      "Batch processing",
      "Instant preview",
      "Free to use"
    ]
  };

  return (
    <>
      <Head>
        <title>Free App Store Screenshot Generator | AppCrafter</title>
        <meta 
          name="description" 
          content="Create beautiful App Store screenshots with custom backgrounds, frames, and text overlays. Perfect for iOS app marketing."
        />
        <meta 
          name="keywords" 
          content="app store screenshot generator, ios screenshot maker, app store marketing, app screenshot tool, iphone screenshot generator, ipad screenshot generator"
        />
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" href={alternateUrls.en} hrefLang="en" />
        <link rel="alternate" href={alternateUrls.zh} hrefLang="zh" />
        <link rel="alternate" href={alternateUrls.default} hrefLang="x-default" />
        
        <meta property="og:title" content="Free App Store Screenshot Generator | AppCrafter" />
        <meta property="og:description" content="Create beautiful App Store screenshots with custom backgrounds, frames, and text overlays. Perfect for iOS app marketing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://appcrafter.dev/og/screenshot-generator.png" />
        <meta property="og:image:alt" content="App Store Screenshot Generator - Tool Preview" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free App Store Screenshot Generator | AppCrafter" />
        <meta name="twitter:description" content="Create beautiful App Store screenshots with custom backgrounds, frames, and text overlays. Perfect for iOS app marketing." />
        <meta name="twitter:image" content="https://appcrafter.dev/og/screenshot-generator.png" />
        <meta name="twitter:image:alt" content="App Store Screenshot Generator - Tool Preview" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AppCrafter" />
      </Head>

      <JsonLd data={structuredData} />

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="bg-gradient-to-b from-blue-50 to-white py-8">
          <div className="max-w-screen-2xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
              Free App Store Screenshot Generator
            </h1>
            <p className="text-xl text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Create stunning App Store screenshots with beautiful backgrounds and customizable frames
            </p>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8">
                <ScreenshotGenerator />
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              About This Tool
            </h2>
            <div className="prose prose-lg">
              <p>
                Our App Store Screenshot Generator helps you create professional-looking screenshots for your iOS app. 
                With support for both iPhone and iPad, you can easily generate screenshots that meet Apple's requirements.
              </p>
              <p>
                Whether you're launching a new app or updating your existing App Store listing, this tool makes it easy 
                to create eye-catching screenshots that will help your app stand out.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Key Features
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Support for iPhone and iPad screenshots</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Beautiful gradient backgrounds</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Customizable text overlays</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Adjustable frame sizes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Batch processing</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Instant preview</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Free to use</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Use
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Choose Device Type</h3>
                  <p className="text-gray-600">Select either iPhone or iPad as your target device.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Upload Screenshots</h3>
                  <p className="text-gray-600">Upload your app screenshots for the selected device type.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Customize Design</h3>
                  <p className="text-gray-600">Add text, adjust frame size, and choose a background style.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Generate and Download</h3>
                  <p className="text-gray-600">Click the generate button to create and download your screenshots.</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">Note: All processing is done in your browser. Your files are never uploaded to our servers.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Pro Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Use High-Quality Screenshots</h3>
                <p className="text-gray-600">For best results, use high-resolution screenshots that are clear and well-lit.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Keep Text Concise</h3>
                <p className="text-gray-600">Use short, impactful text that highlights your app's key features.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Match Your Brand</h3>
                <p className="text-gray-600">Choose background colors that complement your app's design and branding.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Test Different Layouts</h3>
                <p className="text-gray-600">Experiment with different frame sizes and text positions to find what works best.</p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: getUrlConfig('/tools/free-app-store-screenshot-generator', 'en')
  };
};

export default ScreenshotGeneratorPage; 