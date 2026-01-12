'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-red-800">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
        >
          재시도
        </button>
      )}
    </div>
  );
};


