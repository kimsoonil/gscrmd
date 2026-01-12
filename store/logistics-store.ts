/**
 * Zustand 기반 물류 상태 관리 스토어
 * 선택적 구독과 배치 업데이트를 통한 렌더링 최적화
 */

import { create } from 'zustand';
import type { RawLogisticsData, ProcessedLogisticsData } from '@/types/logistics';
import { processLogisticsData } from '@/utils/logistics-processor';

interface LogisticsState {
  // 원시 데이터
  rawData: RawLogisticsData[];
  
  // 전처리된 데이터
  visibleData: ProcessedLogisticsData[];
  
  // 로딩 상태
  isLoading: boolean;
  
  // 에러 상태
  error: string | null;
  
  // Canvas 크기
  canvasWidth: number;
  canvasHeight: number;
  
  // 뷰포트 경계
  viewportBounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null;
  
  // Actions
  setRawData: (data: RawLogisticsData[]) => void;
  updateDataBatch: (data: RawLogisticsData[]) => void; // 배치 업데이트용
  setCanvasSize: (width: number, height: number) => void;
  setViewportBounds: (bounds: LogisticsState['viewportBounds']) => void;
  clearError: () => void;
}

// 배치 업데이트를 위한 프레임 ID
let batchUpdateFrameId: number | null = null;
let pendingUpdate: (() => void) | null = null;

/**
 * requestAnimationFrame 기반 배치 업데이트
 * 렌더링 횟수를 획기적으로 줄입니다.
 */
function batchUpdate(updateFn: () => void): void {
  if (pendingUpdate) {
    pendingUpdate = updateFn;
    return;
  }

  pendingUpdate = updateFn;

  if (batchUpdateFrameId === null) {
    batchUpdateFrameId = requestAnimationFrame(() => {
      if (pendingUpdate) {
        pendingUpdate();
        pendingUpdate = null;
      }
      batchUpdateFrameId = null;
    });
  }
}

export const useLogisticsStore = create<LogisticsState>((set, get) => ({
  rawData: [],
  visibleData: [],
  isLoading: false,
  error: null,
  canvasWidth: 1920,
  canvasHeight: 1080,
  viewportBounds: null,

  setRawData: async (data: RawLogisticsData[]) => {
    const state = get();
    
    // 상태 업데이트
    set({ rawData: data, isLoading: true, error: null });

    try {
      // 비동기로 데이터 전처리 (청크 단위 처리로 UI 스레드 블로킹 방지)
      const processedData = await processLogisticsData(
        data,
        state.canvasWidth,
        state.canvasHeight,
        state.viewportBounds || undefined
      );

      // 배치 업데이트로 렌더링 최적화
      batchUpdate(() => {
        set({ visibleData: processedData, isLoading: false });
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '데이터 처리 중 오류가 발생했습니다.',
        isLoading: false,
      });
    }
  },

  setCanvasSize: (width: number, height: number) => {
    const state = get();
    set({ canvasWidth: width, canvasHeight: height });
    
    // 캔버스 크기가 변경되면 데이터 재처리
    if (state.rawData.length > 0) {
      batchUpdate(() => {
        get().setRawData(state.rawData);
      });
    }
  },

  setViewportBounds: (bounds: LogisticsState['viewportBounds']) => {
    const state = get();
    set({ viewportBounds: bounds });
    
    // 뷰포트가 변경되면 데이터 재처리
    if (state.rawData.length > 0) {
      batchUpdate(() => {
        get().setRawData(state.rawData);
      });
    }
  },

  updateDataBatch: (newData: RawLogisticsData[]) => {
    const state = get();
    // 기존 데이터와 새 데이터를 병합
    const mergedData = [...state.rawData, ...newData];
    
    // 배치 업데이트로 렌더링 최적화
    batchUpdate(() => {
      get().setRawData(mergedData);
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

/**
 * 선택적 구독 훅들
 * 필요한 데이터만 구독하여 불필요한 리렌더링을 방지합니다.
 */
export const useVisibleData = () => useLogisticsStore((state) => state.visibleData);
export const useIsLoading = () => useLogisticsStore((state) => state.isLoading);
export const useError = () => useLogisticsStore((state) => state.error);
export const useCanvasSize = () =>
  useLogisticsStore((state) => ({
    width: state.canvasWidth,
    height: state.canvasHeight,
  }));


