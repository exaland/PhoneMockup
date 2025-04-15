import { Zap, Layout, Image, Download } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: '多设备尺寸支持',
      description: '自动为不同设备生成对应尺寸的截图，完全符合应用商店的要求。'
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: '专业设备框架',
      description: '内置精美的设备框架效果，让您的截图看起来更专业、更有说服力。'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '实时预览',
      description: '所有修改都能即时预览，快速调整到最佳效果。'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: '批量导出',
      description: '一键导出所有尺寸的截图，自动打包成 ZIP 文件。'
    }
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        强大的功能，简单的操作
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex gap-4 p-6 rounded-xl bg-white shadow-sm"
          >
            <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
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