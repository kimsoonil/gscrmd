/**
 * DashboardCanvas 컴포넌트 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DashboardCanvas } from '@/components/dashboard-canvas';
import { useLogisticsStore } from '@/store/logistics-store';
import { generateMockLogisticsData } from '@/utils/mock-data';

// Canvas API 모킹
class MockCanvasRenderingContext2D {
  fillStyle = '';
  scale = vi.fn();
  fillRect = vi.fn();
  beginPath = vi.fn();
  moveTo = vi.fn();
  arc = vi.fn();
  fill = vi.fn();
  clearRect = vi.fn();
}

HTMLCanvasElement.prototype.getContext = vi.fn(() => {
  return new MockCanvasRenderingContext2D() as any;
});

HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
  left: 0,
  top: 0,
  width: 1920,
  height: 1080,
  right: 1920,
  bottom: 1080,
  x: 0,
  y: 0,
  toJSON: vi.fn(),
}));

describe('DashboardCanvas', () => {
  beforeEach(() => {
    // 스토어 초기화
    useLogisticsStore.setState({
      rawData: [],
      visibleData: [],
      isLoading: false,
      error: null,
      canvasWidth: 1920,
      canvasHeight: 1080,
      viewportBounds: null,
    });
  });

  it('Canvas 요소가 렌더링되어야 합니다', () => {
    render(<DashboardCanvas />);
    const canvas = screen.getByRole('img', { hidden: true }) || document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('데이터가 있을 때 Canvas에 렌더링되어야 합니다', async () => {
    const sampleData = generateMockLogisticsData(100);
    
    // 스토어에 데이터 설정
    useLogisticsStore.setState({
      visibleData: sampleData.map((item) => ({
        id: item.id,
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        color: '#3b82f6',
        status: item.status,
        vehicleId: item.vehicleId,
        timestamp: item.timestamp,
        originalLongitude: item.longitude,
        originalLatitude: item.latitude,
      })),
    });

    render(<DashboardCanvas />);
    
    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });
  });

  it('노드 클릭 시 핸들러가 호출되어야 합니다', async () => {
    const handleClick = vi.fn();
    const sampleData = generateMockLogisticsData(10);
    
    useLogisticsStore.setState({
      visibleData: sampleData.map((item) => ({
        id: item.id,
        x: 100,
        y: 100,
        color: '#3b82f6',
        status: item.status,
        vehicleId: item.vehicleId,
        timestamp: item.timestamp,
        originalLongitude: item.longitude,
        originalLatitude: item.latitude,
      })),
    });

    render(<DashboardCanvas onNodeClick={handleClick} />);
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Canvas 클릭 이벤트 시뮬레이션
      const clickEvent = new MouseEvent('click', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
      });
      canvas.dispatchEvent(clickEvent);
      
      // 클릭 핸들러가 호출되었는지 확인
      await waitFor(() => {
        expect(handleClick).toHaveBeenCalled();
      });
    }
  });
});


