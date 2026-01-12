'use client';

/**
 * 메인 대시보드 페이지
 * 고성능 물류 모니터링 대시보드를 제공합니다.
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCanvas } from '@/components/dashboard-canvas';
import { StatusLegend } from '@/components/status-legend';
import { LoadingIndicator } from '@/components/loading-indicator';
import { ErrorMessage } from '@/components/error-message';
import { VehicleInfoPanel } from '@/components/vehicle-info-panel';
import {
  useLogisticsStore,
  useIsLoading,
  useError,
} from '@/store/logistics-store';
import type { RawLogisticsData, ProcessedLogisticsData, Cargo, Destination } from '@/types/logistics';

/**
 * 샘플 데이터 생성 함수
 * 실제 프로젝트에서는 API에서 데이터를 가져옵니다.
 */
function generateSampleData(count: number = 10000): RawLogisticsData[] {
  const statuses: RawLogisticsData['status'][] = [
    'in-transit',
    'delivered',
    'delayed',
    'pending',
  ];
  
  const priorities: RawLogisticsData['priority'][] = ['low', 'normal', 'high', 'urgent'];
  const cargoTypes = ['전자제품', '식품', '의류', '화학물품', '건설자재', '생활용품'];
  const cities = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '수원'];

  return Array.from({ length: count }, (_, i) => {
    const destLongitude = -180 + Math.random() * 360;
    const destLatitude = -90 + Math.random() * 180;
    const currentLongitude = -180 + Math.random() * 360;
    const currentLatitude = -90 + Math.random() * 180;
    
    const cargoCount = Math.floor(Math.random() * 5) + 1;
    const cargo: Cargo[] = Array.from({ length: cargoCount }, (_, j) => ({
      id: `cargo-${i}-${j}`,
      name: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
      quantity: Math.floor(Math.random() * 100) + 1,
      weight: Math.random() * 500 + 10,
      volume: Math.random() * 10 + 0.5,
    }));

    const totalWeight = cargo.reduce((sum, c) => sum + (c.weight || 0), 0);
    const totalVolume = cargo.reduce((sum, c) => sum + (c.volume || 0), 0);
    const estimatedArrival = Date.now() + Math.random() * 86400000; // 미래 24시간 내

    return {
      id: `vehicle-${i + 1}`,
      longitude: currentLongitude,
      latitude: currentLatitude,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      vehicleId: `VEH-${String(i + 1).padStart(6, '0')}`,
      timestamp: Date.now() - Math.random() * 86400000, // 최근 24시간 내
      destination: {
        longitude: destLongitude,
        latitude: destLatitude,
        address: `${cities[Math.floor(Math.random() * cities.length)]}시 ${Math.floor(Math.random() * 100)}번지`,
        name: `${cities[Math.floor(Math.random() * cities.length)]} 물류센터`,
      },
      cargo,
      estimatedArrival,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      routeId: `ROUTE-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      driverName: `기사${String(i % 100 + 1).padStart(3, '0')}`,
      totalWeight,
      totalVolume,
    };
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const setRawData = useLogisticsStore((state) => state.setRawData);
  const setCanvasSize = useLogisticsStore((state) => state.setCanvasSize);
  const isLoading = useIsLoading();
  const error = useError();
  const clearError = useLogisticsStore((state) => state.clearError);
  const [selectedNode, setSelectedNode] = useState<ProcessedLogisticsData | null>(null);
  const [dataCount, setDataCount] = useState(10000);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = () => {
      const sampleData = generateSampleData(dataCount);
      setRawData(sampleData);
    };

    loadData();
  }, [setRawData, dataCount]);

  // Canvas 크기 설정
  useEffect(() => {
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight - 80; // 헤더 높이 제외
      setCanvasSize(width, height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [setCanvasSize]);

  // 노드 클릭 핸들러
  const handleNodeClick = useCallback((node: ProcessedLogisticsData) => {
    setSelectedNode(node);
  }, []);

  // 데이터 재로드
  const handleReload = useCallback(() => {
    clearError();
    const sampleData = generateSampleData(dataCount);
    setRawData(sampleData);
  }, [setRawData, clearError, dataCount]);

  // 데이터 수 증가/감소 함수
  const adjustDataCount = useCallback((delta: number) => {
    setDataCount((prev) => {
      const newCount = prev + delta;
      const min = 1000;
      const max = 50000;
      return Math.max(min, Math.min(max, newCount));
    });
  }, []);

  // 스크롤로 데이터 수 조절
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // 기본 스크롤 동작 방지
      
      // 스크롤 방향에 따라 데이터 수 조절 (100단위)
      if (e.deltaY > 0) {
        // 아래로 스크롤 = 데이터 수 증가
        adjustDataCount(100);
      } else {
        // 위로 스크롤 = 데이터 수 감소
        adjustDataCount(-100);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [adjustDataCount]);

  return (
    <main className="h-screen bg-slate-900 overflow-hidden flex flex-col">
      {/* 헤더 */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-2xl font-bold text-white">
                🚚 Global Supply Chain Real-time Monitoring Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                고성능 물류 데이터 시각화 솔루션
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="dataCount" className="text-sm text-slate-300">
                데이터 수:
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => adjustDataCount(-100)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-600 transition-colors text-sm font-bold"
                  aria-label="데이터 수 감소"
                >
                  −
                </button>
                <input
                  id="dataCount"
                  type="number"
                  min="1000"
                  max="50000"
                  step="100"
                  value={dataCount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1000 && value <= 50000) {
                      setDataCount(value);
                    }
                  }}
                  className="px-3 py-1 bg-slate-700 text-white rounded border border-slate-600 w-24 text-center"
                />
                <button
                  onClick={() => adjustDataCount(100)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-600 transition-colors text-sm font-bold"
                  aria-label="데이터 수 증가"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              데이터 새로고침
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="relative flex-1 overflow-hidden">
        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/50">
            <LoadingIndicator />
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md">
            <ErrorMessage message={error} onRetry={handleReload} />
          </div>
        )}

        {/* Canvas */}
        <DashboardCanvas
          className="w-full"
          onNodeClick={handleNodeClick}
        />

        {/* 사이드 패널 */}
        <div className="absolute top-4 right-4 z-10 space-y-4">
          <StatusLegend />
          
          {/* 선택된 노드 정보 (차량 + 물류 정보) */}
          {selectedNode && (
            <VehicleInfoPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>
      </div>
    </main>
  );
}

