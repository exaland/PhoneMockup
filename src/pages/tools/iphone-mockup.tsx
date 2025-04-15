import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import dynamic from 'next/dynamic';

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

const IphoneMockupPage: NextPage<Props> = ({ canonicalUrl, alternateUrls }) => {
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
    ]
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
      </Head>

      <JsonLd data={structuredData} />

      <div className="min-h-screen bg-[#f8f9fa]">
        <Header />
        
        <div className="py-16 md:py-20">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1c1f23] mb-4">
                Create Your Phone Mockup
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your screenshot and customize your 3D Phone mockup in seconds - no design skills required
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <IphoneMockup />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const baseUrl = 'https://phonemockup-online.dev';
  const path = '/tools/iphone-mockup';
  
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

export default IphoneMockupPage; 