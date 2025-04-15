import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { PngCropper } from '@/components/tools/png-cropper/PngCropper';
import { JsonLd } from '@/components/JsonLd';
import { Header } from '@/components/Header';

interface Props {
  canonicalUrl: string;
}

const PngCropperPage: NextPage<Props> = ({ canonicalUrl }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PNG Cropper",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free online tool to automatically remove transparent edges from PNG images. Perfect for optimizing UI assets and web graphics.",
    "featureList": [
      "Automatic transparent edge detection",
      "Batch processing support",
      "Browser-based processing",
      "Privacy-focused - no server uploads",
      "Original quality preservation",
      "Instant preview"
    ]
  };

  return (
    <>
      <Head>
        <title>PNG Cropper - Remove Transparent Edges from PNG Images | AppCrafter</title>
        <meta 
          name="description" 
          content="Free online tool to automatically remove transparent edges from PNG images. Perfect for optimizing UI assets and web graphics."
        />
        <meta 
          name="keywords" 
          content="png cropper, transparent edge removal, image optimization, png optimization, web graphics, ui assets"
        />
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" href="https://appcrafter.dev/tools/png-cropper" hrefLang="en" />
        <link rel="alternate" href="https://appcrafter.dev/zh/tools/png-cropper" hrefLang="zh" />
        <link rel="alternate" href="https://appcrafter.dev/tools/png-cropper" hrefLang="x-default" />
        
        <meta property="og:title" content="PNG Cropper - Remove Transparent Edges from PNG Images | AppCrafter" />
        <meta property="og:description" content="Free online tool to automatically remove transparent edges from PNG images. Perfect for optimizing UI assets and web graphics." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PNG Cropper - Remove Transparent Edges from PNG Images | AppCrafter" />
        <meta name="twitter:description" content="Free online tool to automatically remove transparent edges from PNG images. Perfect for optimizing UI assets and web graphics." />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AppCrafter" />
      </Head>

      <JsonLd data={structuredData} />

      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-white">
          <Header />
        </div>
        
        <div className="flex-grow bg-gray-50">
          <div className="bg-gradient-to-b from-blue-50 to-white py-8">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
                PNG Cropper
              </h1>
              <p className="text-xl text-gray-600 text-center mb-8 max-w-3xl mx-auto">
                Remove transparent edges from PNG images automatically
              </p>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <PngCropper />
              </div>
            </div>
          </div>

          <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About Our PNG Cropper Tool
              </h2>
              <div className="prose prose-lg">
                <p>
                  Our PNG Cropper is a powerful online tool designed specifically for removing unnecessary transparent edges from PNG images. Whether you're a web developer, UI designer, or digital artist, this tool helps you optimize your PNG assets quickly and efficiently.
                </p>
                <p>
                  Unlike traditional image editors that require manual cropping, our PNG Cropper automatically detects transparent areas around your image and removes them with a single click. This automated process saves time and ensures precise results every time.
                </p>
                <p>
                  The PNG Cropper tool uses advanced algorithms to analyze your images, identifying and removing transparent pixels while preserving the integrity of your visual content. This precision makes it an invaluable asset for professionals who need to maintain exact pixel-perfect designs.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                  Key Features of Our PNG Cropper
                </h3>
                <ul>
                  <li><strong>Automatic Edge Detection:</strong> Smart algorithm that precisely identifies transparent edges around your PNG images</li>
                  <li><strong>Batch Processing Support:</strong> Save time by processing multiple PNG files in succession</li>
                  <li><strong>Browser-based Processing:</strong> No need to install software - process your images directly in your web browser</li>
                  <li><strong>Privacy First:</strong> All processing happens locally on your device, no images are uploaded to servers</li>
                  <li><strong>Original Quality:</strong> Maintains the original image quality while removing transparent edges</li>
                  <li><strong>Instant Preview:</strong> See the results immediately before downloading</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose Our PNG Cropper?
              </h2>
              <div className="prose prose-lg">
                <p>
                  In the world of digital asset optimization, having the right tools can make a significant difference in your workflow efficiency. Our PNG Cropper stands out for several key reasons:
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Time Efficiency</h3>
                    <p>
                      Manual cropping of transparent edges can be tedious and time-consuming. Our PNG Cropper automates this process, reducing what could take minutes to mere seconds. This efficiency is particularly valuable when dealing with multiple images or regular asset updates.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Precision and Accuracy</h3>
                    <p>
                      The PNG Cropper tool uses pixel-perfect detection algorithms to ensure no visible content is lost during the cropping process. This precision is essential for maintaining the quality and integrity of your design assets.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Integration</h3>
                    <p>
                      As a web-based tool, our PNG Cropper integrates seamlessly into existing workflows. There's no need to install software or switch between different applications - everything happens right in your browser.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Resource Optimization</h3>
                    <p>
                      By removing unnecessary transparent edges, the PNG Cropper helps reduce file sizes without compromising quality. This optimization is crucial for web performance and efficient resource management.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Common Use Cases for PNG Cropping
              </h2>
              <div className="prose prose-lg">
                <p>
                  Our PNG Cropper tool is essential for various image optimization scenarios. Here are some common use cases where removing transparent edges can significantly improve your workflow:
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Web Development</h3>
                    <ul>
                      <li>Optimizing website assets for faster loading</li>
                      <li>Preparing icons for responsive web design</li>
                      <li>Creating consistent UI element sizes</li>
                      <li>Reducing image file sizes for better performance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">UI/UX Design</h3>
                    <ul>
                      <li>Cleaning up exported design assets</li>
                      <li>Preparing icons for UI kits</li>
                      <li>Standardizing component dimensions</li>
                      <li>Creating precise image sprites</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                How to Use the PNG Cropper
              </h2>
              <div className="prose prose-lg">
                <p>
                  Using our PNG Cropper is straightforward and efficient. Follow these simple steps to optimize your PNG images:
                </p>
                <ol>
                  <li>
                    <strong>Upload Your PNG:</strong> Click the upload button or drag and drop your PNG file into the designated area. Our tool accepts any PNG image with transparent areas.
                  </li>
                  <li>
                    <strong>Preview Your Image:</strong> Once uploaded, you'll see your original image displayed in the preview area. This helps you verify you've selected the correct file.
                  </li>
                  <li>
                    <strong>Process the Image:</strong> Click the "Crop Transparent Edges" button to automatically detect and remove transparent edges from your PNG.
                  </li>
                  <li>
                    <strong>Download Results:</strong> After processing, preview the optimized image and click "Download" to save it to your device.
                  </li>
                </ol>
                <p>
                  The entire process happens instantly in your browser, ensuring fast results without compromising image quality or privacy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Best Practices for PNG Image Optimization
              </h2>
              <div className="prose prose-lg">
                <p>
                  To get the most out of our PNG Cropper tool and optimize your workflow, consider these best practices:
                </p>
                <ul>
                  <li>
                    <strong>Prepare Your Files:</strong> Ensure your PNG images have proper transparency before processing. This helps achieve the best results.
                  </li>
                  <li>
                    <strong>Batch Organization:</strong> When processing multiple files, organize them beforehand to streamline your workflow.
                  </li>
                  <li>
                    <strong>Quality Check:</strong> Always preview the processed image before downloading to ensure the results meet your requirements.
                  </li>
                  <li>
                    <strong>File Naming:</strong> Use descriptive names for your processed files to maintain organization in your project.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Advanced Tips for PNG Image Optimization
              </h2>
              <div className="prose prose-lg">
                <p>
                  While our PNG Cropper tool makes it easy to remove transparent edges, there are several advanced techniques you can use to further optimize your PNG images:
                </p>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-processing Considerations</h3>
                  <ul>
                    <li>
                      <strong>Clean Transparency:</strong> Ensure your PNG images have clean transparency without semi-transparent pixels around the edges for best results with the PNG Cropper.
                    </li>
                    <li>
                      <strong>Resolution Check:</strong> Verify that your source images are at the correct resolution before cropping to maintain optimal quality.
                    </li>
                    <li>
                      <strong>Color Profile:</strong> Consider converting your PNGs to sRGB color profile for better web compatibility before processing.
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Post-processing Workflow</h3>
                  <ul>
                    <li>
                      <strong>Version Control:</strong> Maintain original files alongside cropped versions for future editing needs.
                    </li>
                    <li>
                      <strong>Systematic Testing:</strong> Test cropped images in their intended context to ensure they meet design requirements.
                    </li>
                    <li>
                      <strong>Documentation:</strong> Keep track of your optimization process and settings for consistency across projects.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    What file formats are supported?
                  </h3>
                  <p className="text-gray-600">
                    Our tool specifically processes PNG (Portable Network Graphics) files, as this format supports transparency. This specialization allows us to provide the best possible results for transparent image optimization.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Is there a file size limit?
                  </h3>
                  <p className="text-gray-600">
                    While our tool can handle large files, we recommend keeping images under 10MB for optimal performance, as all processing happens in your browser. This ensures smooth operation and quick results.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How is image quality maintained?
                  </h3>
                  <p className="text-gray-600">
                    We use lossless processing techniques to ensure the output image maintains the exact same quality as the original. Only transparent edges are removed, with no impact on the visible parts of your image.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I process multiple images at once?
                  </h3>
                  <p className="text-gray-600">
                    While our tool processes one image at a time, you can quickly process multiple images in succession. This approach ensures accurate results for each individual file while maintaining processing speed.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                PNG Cropper vs Traditional Image Editors
              </h2>
              <div className="prose prose-lg">
                <p>
                  While many image editing tools offer cropping functionality, our specialized PNG Cropper provides distinct advantages for handling transparent images:
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Traditional Image Editors</h3>
                    <ul className="space-y-3">
                      <li>❌ Manual selection of crop areas</li>
                      <li>❌ Complex interface with unnecessary features</li>
                      <li>❌ Software installation required</li>
                      <li>❌ Time-consuming process</li>
                      <li>❌ Risk of accidental content cropping</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Our PNG Cropper</h3>
                    <ul className="space-y-3">
                      <li>✅ Automatic transparent edge detection</li>
                      <li>✅ Simple, focused interface</li>
                      <li>✅ Works directly in browser</li>
                      <li>✅ Instant processing</li>
                      <li>✅ Precise, error-free results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Real-World Applications of PNG Cropper
              </h2>
              <div className="prose prose-lg">
                <p>
                  Our PNG Cropper tool has proven invaluable across various industries and use cases. Here's how different professionals use our tool to optimize their workflow:
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">E-commerce</h3>
                    <p>
                      Online retailers use our PNG Cropper to optimize product images with transparent backgrounds, ensuring consistent presentation across their catalogs while reducing storage and bandwidth costs.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Game Development</h3>
                    <p>
                      Game developers streamline their asset pipeline by using our PNG Cropper to process sprite sheets and UI elements, maintaining precise hitboxes and optimizing resource usage.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Digital Marketing</h3>
                    <p>
                      Marketing professionals rely on our PNG Cropper to prepare social media assets and promotional materials, ensuring crisp, professional-looking graphics across all platforms.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Performance and Technical Specifications
              </h2>
              <div className="prose prose-lg">
                <p>
                  Our PNG Cropper is built with performance and reliability in mind. Here are the technical details that make our tool stand out:
                </p>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Features</h3>
                  <ul>
                    <li>
                      <strong>Processing Engine:</strong> Advanced JavaScript-based image processing with WebAssembly acceleration
                    </li>
                    <li>
                      <strong>Supported Dimensions:</strong> Up to 16,384 x 16,384 pixels (browser dependent)
                    </li>
                    <li>
                      <strong>Color Depth:</strong> Full support for 32-bit PNG with alpha channel
                    </li>
                    <li>
                      <strong>Processing Speed:</strong> Average processing time under 1 second for typical images
                    </li>
                    <li>
                      <strong>Browser Compatibility:</strong> Works with all modern browsers (Chrome, Firefox, Safari, Edge)
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Features</h3>
                  <ul>
                    <li>
                      <strong>Local Processing:</strong> All image processing happens in your browser - no server uploads
                    </li>
                    <li>
                      <strong>Data Privacy:</strong> No image data is stored or transmitted
                    </li>
                    <li>
                      <strong>Secure Connection:</strong> HTTPS-only access for enhanced security
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      canonicalUrl: 'https://appcrafter.dev/tools/png-cropper'
    }
  };
};

export default PngCropperPage; 