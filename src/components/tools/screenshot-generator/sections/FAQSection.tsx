export function FAQSection() {
  const faqs = [
    {
      question: '生成的截图是什么格式？',
      answer: '所有截图都以 PNG 格式生成，保证最高的图片质量和透明度支持。'
    },
    {
      question: '支持哪些设备尺寸？',
      answer: '目前支持 iPhone 6.9" (1320 × 2868px) 和 iPhone 6.5" (1284 × 2778px) 两种尺寸。我们计划在未来添加更多设备支持。'
    },
    {
      question: '有使用次数限制吗？',
      answer: '没有。我们的工具完全免费，您可以无限次使用，生成任意数量的截图。'
    },
    {
      question: '上传的截图会保存在服务器上吗？',
      answer: '不会。所有的图片处理都在您的浏览器中完成，我们不会上传或存储您的任何图片。'
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        常见问题
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h3 className="font-semibold text-gray-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
} 