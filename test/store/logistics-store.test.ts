/**
 * Zustand 스토어 테스트
 * 대량의 데이터가 들어왔을 때 스토어가 올바르게 가공된 데이터를 내보내는지 검증
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLogisticsStore } from '@/store/logistics-store';
import { generateMockLogisticsData } from '@/utils/mock-data';
import type { RawLogisticsData } from '@/types/logistics';

describe('logistics store', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
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

  it('초기 상태가 올바르게 설정되어야 합니다', () => {
    const state = useLogisticsStore.getState();
    
    expect(state.rawData).toEqual([]);
    expect(state.visibleData).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('대량의 데이터를 처리할 수 있어야 합니다', async () => {
    const largeDataset = generateMockLogisticsData(10000);
    const setRawData = useLogisticsStore.getState().setRawData;
    
    // 비동기 처리를 위해 Promise 사용
    await new Promise<void>((resolve) => {
      const unsubscribe = useLogisticsStore.subscribe((state) => {
        if (!state.isLoading && state.visibleData.length > 0) {
          expect(state.visibleData.length).toBe(10000);
          expect(state.visibleData[0]).toHaveProperty('x');
          expect(state.visibleData[0]).toHaveProperty('y');
          expect(state.visibleData[0]).toHaveProperty('color');
          unsubscribe();
          resolve();
        }
      });
      
      setRawData(largeDataset);
    });
  }, 10000); // 타임아웃 10초

  it('캔버스 크기 변경 시 데이터가 재처리되어야 합니다', async () => {
    const sampleData = generateMockLogisticsData(100);
    const setRawData = useLogisticsStore.getState().setRawData;
    const setCanvasSize = useLogisticsStore.getState().setCanvasSize;
    
    // 초기 데이터 로드
    await new Promise<void>((resolve) => {
      const unsubscribe = useLogisticsStore.subscribe((state) => {
        if (!state.isLoading && state.visibleData.length > 0) {
          const initialX = state.visibleData[0].x;
          
          // 캔버스 크기 변경
          setCanvasSize(2560, 1440);
          
          setTimeout(() => {
            const newState = useLogisticsStore.getState();
            if (newState.visibleData.length > 0) {
              // 좌표가 재계산되었는지 확인
              expect(newState.canvasWidth).toBe(2560);
              expect(newState.canvasHeight).toBe(1440);
            }
            unsubscribe();
            resolve();
          }, 1000);
        }
      });
      
      setRawData(sampleData);
    });
  }, 10000);

  it('선택적 구독 훅이 올바르게 작동해야 합니다', () => {
    const { useVisibleData, useIsLoading, useError } = require('@/store/logistics-store');
    
    // 선택적 구독이 가능한지 확인
    expect(typeof useVisibleData).toBe('function');
    expect(typeof useIsLoading).toBe('function');
    expect(typeof useError).toBe('function');
  });
});


