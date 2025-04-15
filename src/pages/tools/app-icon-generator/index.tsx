import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { IconGeneratorSection } from '@/components/tools/app-icon-generator/sections/IconGeneratorSection';
import { IntroSection } from '@/components/tools/app-icon-generator/sections/IntroSection';
import { FeaturesSection } from '@/components/tools/app-icon-generator/sections/FeaturesSection';
import { FAQSection } from '@/components/tools/app-icon-generator/sections/FAQSection';
import { Footer } from '@/components/Footer';

interface Props {
  canonicalUrl: string;
}

const AppIconGeneratorPage: NextPage<Props> = ({ canonicalUrl }) => {
  return (
    <>
      <Head>
        <title>App Icon Generator - Create Perfect App Icons | AppCrafter</title>
        <meta 
          name="description" 
          content="Free online tool to generate app icons for iOS, Android, macOS and web. Create perfect app icons for all platforms instantly."
        />
        <meta 
          name="keywords" 
          content="app icon generator, ios icon generator, android icon generator, macos icon generator, web icon generator, app development tools"
        />
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" href="https://appcrafter.dev/tools/app-icon-generator" hrefLang="en" />
        <link rel="alternate" href="https://appcrafter.dev/zh/tools/app-icon-generator" hrefLang="zh" />
        <link rel="alternate" href="https://appcrafter.dev/tools/app-icon-generator" hrefLang="x-default" />
        
        <meta property="og:title" content="App Icon Generator - Create Perfect App Icons | AppCrafter" />
        <meta property="og:description" content="Free online tool to generate app icons for iOS, Android, macOS and web. Create perfect app icons for all platforms instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://appcrafter.dev/og/app-icon-generator.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="App Icon Generator - Create Perfect App Icons | AppCrafter" />
        <meta name="twitter:description" content="Free online tool to generate app icons for iOS, Android, macOS and web. Create perfect app icons for all platforms instantly." />
        <meta name="twitter:image" content="https://appcrafter.dev/og/app-icon-generator.png" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-b from-blue-50 to-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
              App Icon Generator
            </h1>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <IconGeneratorSection />
            </div>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
          <IntroSection />
          <FeaturesSection />
          <FAQSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      canonicalUrl: 'https://appcrafter.dev/tools/app-icon-generator'
    }
  };
};

export default AppIconGeneratorPage;