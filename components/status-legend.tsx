'use client';

/**
 * 상태 범례 컴포넌트
 * 물류 노드의 상태를 시각적으로 표시합니다.
 */

import React from 'react';
import { getStatusColor } from '@/utils/coordinates';
import { cn } from '@/utils/cn';

const statusLabels: Record<string, string> = {
  'in-transit': '운송 중',
  'delivered': '배송 완료',
  'delayed': '지연',
  'pending': '대기 중',
};

interface StatusLegendProps {
  className?: string;
}

export const StatusLegend: React.FC<StatusLegendProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4',
        className
      )}
      onWheel={(e) => e.stopPropagation()}
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-3">상태 범례</h3>
      <div className="space-y-2">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getStatusColor(status) }}
            />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


