'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingIndicatorProps {
  className?: string;
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  className,
  message = '데이터를 불러오는 중...',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8',
        className
      )}
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};


