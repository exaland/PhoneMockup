import React from 'react';
import { Smartphone, Monitor, Lock, Zap } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Smartphone,
      title: "Multi-Platform Support",
      description: "Generate icons for iOS, Android, macOS and Web platforms with the correct specifications."
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Get all your app icons generated and packaged in seconds, ready for deployment."
    },
    {
      icon: Monitor,
      title: "Perfect Quality",
      description: "Maintain crisp, clear icons across all sizes with our advanced resizing algorithm."
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Your images never leave your browser. All processing happens locally on your device."
    }
  ];

  return (
    <section className="py-12 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our App Icon Generator?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}