import React from 'react';

export function FAQ() {
  const faqs = [
    {
      question: "What image size do I need to upload?",
      answer: "Upload a 1024x1024 pixel image in PNG or JPG format for best results. This ensures your icons will look sharp across all platforms and sizes."
    },
    {
      question: "Which platforms are supported?",
      answer: "Our app icon generator supports iOS, Android, macOS, and Web platforms, creating all required sizes for app stores and development."
    },
    {
      question: "Is this tool really free?",
      answer: "Yes! Our app icon generator is completely free to use with no hidden costs or limitations."
    },
    {
      question: "How do I get my generated icons?",
      answer: "After processing, your icons will be automatically downloaded as a ZIP file, organized in platform-specific folders."
    }
  ];

  return (
    <section className="py-12" id="faq">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
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
    </section>
  );
}