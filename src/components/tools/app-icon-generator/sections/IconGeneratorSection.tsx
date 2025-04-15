import React from 'react';
import { IconGenerator } from '../IconGenerator';

export function IconGeneratorSection() {
  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <IconGenerator />
      </div>
    </div>
  );
}