import React from 'react';

export function FAQSection() {
  const faqs = [
    {
      question: "What image size do I need to upload?",
      answer: "Upload a 1024x1024 pixel image in PNG or JPG format for best results. This size ensures your icons will look sharp across all platforms and sizes. While our tool can work with smaller images, we recommend using the maximum size for optimal quality."
    },
    {
      question: "Which platforms are supported?",
      answer: "Our app icon generator supports all major platforms including iOS, Android, macOS, and Web. For iOS, we generate all required sizes for iPhone and iPad apps. For Android, we create icons for all density buckets (mdpi to xxxhdpi). For macOS, we generate icons from 16x16 to 1024x1024. Web icons include favicons and PWA icons."
    },
    {
      question: "How does the image processing work?",
      answer: "Our generator uses advanced image processing algorithms to ensure the highest quality output. All processing happens locally in your browser - your images are never uploaded to any server. We maintain aspect ratios and use proper interpolation methods to preserve image quality during resizing."
    },
    {
      question: "Is this tool really free?",
      answer: "Yes! Our app icon generator is completely free to use with no hidden costs or limitations. We believe in providing high-quality tools to support the developer community. There are no watermarks, no account required, and no usage limits."
    },
    {
      question: "How do I get my generated icons?",
      answer: "After processing, your icons will be automatically downloaded as a ZIP file, organized in platform-specific folders. Each icon is properly named according to platform conventions, making it easy to integrate into your project."
    },
    {
      question: "Can I use this for commercial projects?",
      answer: "Absolutely! You can use our generator for any type of project - personal, commercial, or open source. The generated icons are your property, and you retain all rights to your images."
    },
    {
      question: "What image formats are supported?",
      answer: "We support PNG and JPG/JPEG formats for input images. We recommend using PNG for icons with transparency or sharp edges. All output icons are generated in PNG format as required by the various platforms."
    },
    {
      question: "Do you support custom sizes?",
      answer: "Currently, we generate the standard sizes required by each platform. This covers all common use cases and ensures your icons meet platform guidelines. If you need custom sizes, please reach out to us with your requirements."
    }
  ];

  const testimonials = [
    {
      text: "This tool saved me hours of work. Perfect for my app submissions!",
      author: "Sarah Chen",
      role: "iOS Developer"
    },
    {
      text: "The best app icon generator I've found. Clean, fast, and reliable.",
      author: "Michael Rodriguez",
      role: "Full Stack Developer"
    },
    {
      text: "Exactly what I needed for my cross-platform app development.",
      author: "David Kim",
      role: "Mobile App Designer"
    }
  ];

  return (
    <section className="space-y-12" id="faq">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          What Developers Say
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}