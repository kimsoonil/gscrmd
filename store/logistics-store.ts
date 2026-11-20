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

// 최신 요청의 처리 결과만 화면에 반영합니다.
let processingVersion = 0;

export const useLogisticsStore = create<LogisticsState>((set, get) => ({
  rawData: [],
  visibleData: [],
  isLoading: false,
  error: null,
  canvasWidth: 1920,
  canvasHeight: 1080,
  viewportBounds: null,

  setRawData: async (data: RawLogisticsData[]) => {
    const version = ++processingVersion;
    const state = get();
    set({ rawData: data, isLoading: true, error: null });
    try {
      const processed = await processLogisticsData(data, state.canvasWidth, state.canvasHeight, state.viewportBounds || undefined);
      if (version === processingVersion) set({ visibleData: processed, isLoading: false });
    } catch (error) {
      if (version === processingVersion) set({ error: error instanceof Error ? error.message : '데이터 처리 오류', isLoading: false });
    }
  },

  setCanvasSize: (width: number, height: number) => {
    const state = get();
    if (width <= 0 || height <= 0 || (state.canvasWidth === width && state.canvasHeight === height)) return;
    set({ canvasWidth: width, canvasHeight: height });
    
    // 캔버스 크기가 변경되면 데이터 재처리
    if (state.rawData.length > 0) {
      get().setRawData(get().rawData);
    }
  },

  setViewportBounds: (bounds: LogisticsState['viewportBounds']) => {
    const state = get();
    set({ viewportBounds: bounds });
    
    // 뷰포트가 변경되면 데이터 재처리
    if (state.rawData.length > 0) {
      get().setRawData(get().rawData);
    }
  },

  updateDataBatch: (newData: RawLogisticsData[]) => {
    const merged = new Map(get().rawData.map(item => [item.id, item]));
    for (const item of newData) {
      const previous = merged.get(item.id);
      if (!previous || item.timestamp >= previous.timestamp) merged.set(item.id, item);
    }
    get().setRawData([...merged.values()]);
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


