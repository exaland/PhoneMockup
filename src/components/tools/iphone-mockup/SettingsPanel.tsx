import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">设置</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>上传应用截图</Label>
            <Input type="file" accept="image/*" />
          </div>
          
          <div className="space-y-2">
            <Label>iPhone 型号</Label>
            <select className="w-full p-2 border rounded-md">
              <option value="iphone15pro">iPhone 15 Pro</option>
              <option value="iphone15">iPhone 15</option>
              <option value="iphone14pro">iPhone 14 Pro</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>设备颜色</Label>
            <select className="w-full p-2 border rounded-md">
              <option value="black">深空黑色</option>
              <option value="white">银色</option>
              <option value="gold">金色</option>
            </select>
          </div>

          <Button className="w-full">生成样机</Button>
        </div>
      </div>
    </div>
  );
} 