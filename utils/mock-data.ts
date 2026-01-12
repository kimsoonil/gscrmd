/**
 * 테스트용 Mock 데이터 생성 유틸리티
 */

import type { RawLogisticsData } from '@/types/logistics';

/**
 * 샘플 물류 데이터를 생성합니다.
 * @param count 생성할 데이터 개수
 */
export function generateMockLogisticsData(count: number = 1000): RawLogisticsData[] {
  const statuses: RawLogisticsData['status'][] = [
    'in-transit',
    'delivered',
    'delayed',
    'pending',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `vehicle-${i + 1}`,
    longitude: -180 + Math.random() * 360,
    latitude: -90 + Math.random() * 180,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    vehicleId: `VEH-${String(i + 1).padStart(6, '0')}`,
    timestamp: Date.now() - Math.random() * 86400000,
  }));
}


