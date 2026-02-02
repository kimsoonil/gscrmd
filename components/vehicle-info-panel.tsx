'use client';

/**
 * 차량 및 물류 정보 패널 컴포넌트
 * 차량 정보와 관련 물류 정보를 함께 표시합니다.
 */

import React from 'react';
import type { ProcessedLogisticsData, LogisticsStatus } from '@/types/logistics';
import { cn } from '@/utils/cn';

interface VehicleInfoPanelProps {
  node: ProcessedLogisticsData;
  onClose: () => void;
}

const statusLabels: Record<LogisticsStatus, string> = {
  'in-transit': '운송 중',
  'delivered': '배송 완료',
  'delayed': '지연',
  'pending': '대기 중',
};

const priorityLabels: Record<string, string> = {
  low: '낮음',
  normal: '보통',
  high: '높음',
  urgent: '긴급',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export const VehicleInfoPanel: React.FC<VehicleInfoPanelProps> = ({ node, onClose }) => {
  const rawData = node.rawData;
  
  if (!rawData) {
    return null;
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-5 min-w-[380px] max-w-[420px] max-h-[90vh] overflow-y-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">차량 및 물류 정보</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-5">
        {/* 차량 정보 섹션 */}
        <section>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
            차량 정보
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">차량 ID:</span>
              <span className="font-medium text-gray-800">{node.vehicleId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">기사명:</span>
              <span className="font-medium text-gray-800">{rawData.driverName || '정보 없음'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상태:</span>
              <span className="font-medium">{statusLabels[node.status]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">우선순위:</span>
              {rawData.priority && (
                <span className={cn('px-2 py-1 rounded text-xs font-medium', priorityColors[rawData.priority])}>
                  {priorityLabels[rawData.priority]}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">경로 ID:</span>
              <span className="font-medium text-gray-800">{rawData.routeId || '정보 없음'}</span>
            </div>
          </div>
        </section>

        {/* 위치 정보 섹션 */}
        <section>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
            위치 정보
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-600 mb-1">현재 위치:</div>
              <div className="font-medium text-gray-800">
                {node.originalLatitude.toFixed(4)}, {node.originalLongitude.toFixed(4)}
              </div>
            </div>
            {rawData.destination && (
              <div>
                <div className="text-gray-600 mb-1">목적지:</div>
                <div className="font-medium text-gray-800">
                  {rawData.destination.name || rawData.destination.address || '정보 없음'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {rawData.destination.latitude.toFixed(4)}, {rawData.destination.longitude.toFixed(4)}
                </div>
              </div>
            )}
            {rawData.estimatedArrival && (
              <div>
                <div className="text-gray-600 mb-1">예상 도착 시간:</div>
                <div className="font-medium text-gray-800">
                  {new Date(rawData.estimatedArrival).toLocaleString('ko-KR')}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 물류 정보 섹션 */}
        {rawData.cargo && rawData.cargo.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              배송 물품 정보
            </h4>
            <div className="space-y-2">
              {rawData.cargo.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded p-3 text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-gray-600">수량: {item.quantity}개</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    {item.weight && <span>중량: {item.weight.toFixed(1)}kg</span>}
                    {item.volume && <span>부피: {item.volume.toFixed(2)}m³</span>}
                  </div>
                </div>
              ))}
              
              {/* 총계 */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">총 중량:</span>
                  <span className="font-medium text-gray-800">
                    {rawData.totalWeight?.toFixed(1) || '0'}kg
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600 font-medium">총 부피:</span>
                  <span className="font-medium text-gray-800">
                    {rawData.totalVolume?.toFixed(2) || '0'}m³
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 마지막 업데이트 */}
        <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
          마지막 업데이트: {new Date(node.timestamp).toLocaleString('ko-KR')}
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="mt-5 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
      >
        닫기
      </button>
    </div>
  );
};

