/**
 * Mock 데이터 생성 유틸리티 테스트
 */

import { describe, it, expect } from 'vitest';
import { generateMockLogisticsData } from '@/utils/mock-data';
import type { RawLogisticsData } from '@/types/logistics';

describe('mock-data utils', () => {
  describe('generateMockLogisticsData', () => {
    it('지정된 개수의 데이터를 생성해야 합니다', () => {
      const data = generateMockLogisticsData(100);
      expect(data).toHaveLength(100);
    });

    it('기본값으로 1000개의 데이터를 생성해야 합니다', () => {
      const data = generateMockLogisticsData();
      expect(data).toHaveLength(1000);
    });

    it('생성된 데이터가 올바른 구조를 가져야 합니다', () => {
      const data = generateMockLogisticsData(10);
      
      data.forEach((item: RawLogisticsData) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('longitude');
        expect(item).toHaveProperty('latitude');
        expect(item).toHaveProperty('status');
        expect(item).toHaveProperty('vehicleId');
        expect(item).toHaveProperty('timestamp');
        
        // 타입 검증
        expect(typeof item.id).toBe('string');
        expect(typeof item.longitude).toBe('number');
        expect(typeof item.latitude).toBe('number');
        expect(typeof item.status).toBe('string');
        expect(typeof item.vehicleId).toBe('string');
        expect(typeof item.timestamp).toBe('number');
      });
    });

    it('경도가 유효한 범위 내에 있어야 합니다', () => {
      const data = generateMockLogisticsData(100);
      
      data.forEach((item: RawLogisticsData) => {
        expect(item.longitude).toBeGreaterThanOrEqual(-180);
        expect(item.longitude).toBeLessThanOrEqual(180);
      });
    });

    it('위도가 유효한 범위 내에 있어야 합니다', () => {
      const data = generateMockLogisticsData(100);
      
      data.forEach((item: RawLogisticsData) => {
        expect(item.latitude).toBeGreaterThanOrEqual(-90);
        expect(item.latitude).toBeLessThanOrEqual(90);
      });
    });

    it('상태가 유효한 값이어야 합니다', () => {
      const validStatuses = ['in-transit', 'delivered', 'delayed', 'pending'];
      const data = generateMockLogisticsData(100);
      
      data.forEach((item: RawLogisticsData) => {
        expect(validStatuses).toContain(item.status);
      });
    });
  });
});


