import React from 'react';
import { Smartphone, Monitor, Lock, Zap } from 'lucide-react';

export function FeaturesSection() {
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
    <section className="bg-white rounded-2xl p-8 shadow-sm" id="features">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Why Choose Our App Icon Generator?
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
            <feature.icon className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}