import React from 'react';
import { ArrowRight, Layers, Zap, Shield, CheckCircle2 } from 'lucide-react';

export function IntroSection() {
  const steps = [
    {
      icon: Layers,
      text: "Upload your 1024x1024 source image",
      description: "Start with a high-quality square image for the best results across all platforms"
    },
    {
      icon: Zap,
      text: "Select your target platform",
      description: "Choose from iOS, Android, macOS, or Web - each with optimized size specifications"
    },
    {
      icon: Shield,
      text: "Get all required sizes instantly",
      description: "Download a ZIP file containing all platform-specific icon sizes, properly named and organized"
    }
  ];

  const benefits = [
    "Saves hours of manual resizing work",
    "Ensures consistent quality across all sizes",
    "Follows platform-specific guidelines",
    "Maintains image sharpness and clarity",
    "Perfect for app submissions",
    "Supports modern app icon requirements"
  ];

  return (
    <section className="bg-white rounded-2xl p-8 shadow-sm space-y-12" id="how-it-works">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional App Icon Generation Made Simple</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Creating app icons for multiple platforms can be a time-consuming and complex process. Each platform has its own size requirements, naming conventions, and quality standards. Our app icon generator streamlines this process, helping developers and designers create professional-grade icons that meet all platform specifications.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you're developing for iOS, Android, macOS, or the web, our tool ensures your app icons look perfect across all devices and screen sizes. Simply upload your source image once, and we'll handle all the technical details for you.
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Three Simple Steps to Perfect App Icons</h3>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <step.icon className="w-8 h-8 text-blue-500" />
                </div>
                <p className="font-medium text-gray-900 mb-2">{step.text}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-6 h-6 text-gray-300 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-blue-900 mb-6">
          Why Developers & Designers Choose Our Generator
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-blue-900">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}