/**
 * 좌표 변환 유틸리티 테스트
 */

import { describe, it, expect } from 'vitest';
import { calculateX, calculateY, getStatusColor } from '@/utils/coordinates';

describe('coordinates utils', () => {
  describe('calculateX', () => {
    it('경도를 Canvas X 좌표로 올바르게 변환해야 합니다', () => {
      const canvasWidth = 1920;
      
      // 경도 -180은 X 좌표 0이어야 함
      expect(calculateX(-180, canvasWidth)).toBe(0);
      
      // 경도 0은 X 좌표 중간이어야 함
      expect(calculateX(0, canvasWidth)).toBe(canvasWidth / 2);
      
      // 경도 180은 X 좌표 최대값이어야 함
      expect(calculateX(180, canvasWidth)).toBe(canvasWidth);
    });

    it('뷰포트 경계를 고려한 좌표 변환이 올바르게 작동해야 합니다', () => {
      const canvasWidth = 1920;
      const viewportBounds = { minX: 0.2, maxX: 0.8 };
      
      const x = calculateX(0, canvasWidth, viewportBounds);
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(canvasWidth);
    });
  });

  describe('calculateY', () => {
    it('위도를 Canvas Y 좌표로 올바르게 변환해야 합니다', () => {
      const canvasHeight = 1080;
      
      // 위도 90은 Y 좌표 0이어야 함 (반전)
      expect(calculateY(90, canvasHeight)).toBe(0);
      
      // 위도 0은 Y 좌표 중간이어야 함
      expect(calculateY(0, canvasHeight)).toBe(canvasHeight / 2);
      
      // 위도 -90은 Y 좌표 최대값이어야 함
      expect(calculateY(-90, canvasHeight)).toBe(canvasHeight);
    });
  });

  describe('getStatusColor', () => {
    it('각 상태에 맞는 색상을 반환해야 합니다', () => {
      expect(getStatusColor('in-transit')).toBe('#3b82f6');
      expect(getStatusColor('delivered')).toBe('#10b981');
      expect(getStatusColor('delayed')).toBe('#ef4444');
      expect(getStatusColor('pending')).toBe('#f59e0b');
    });

    it('알 수 없는 상태에 대해 기본 색상을 반환해야 합니다', () => {
      expect(getStatusColor('unknown')).toBe('#6b7280');
    });
  });
});


