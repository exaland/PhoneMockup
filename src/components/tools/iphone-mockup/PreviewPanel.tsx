import React from 'react';
import { Button } from '@/components/ui/button';

export default function PreviewPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">预览</h2>
      <div className="aspect-[9/16] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">
          上传截图后在这里预览
        </div>
      </div>
      <div className="flex gap-4">
        <Button className="flex-1" variant="outline">
          下载图片
        </Button>
        <Button className="flex-1" variant="outline">
          复制图片
        </Button>
      </div>
    </div>
  );
} 