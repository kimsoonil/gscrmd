/**
 * Web Worker 래퍼 유틸리티
 * Next.js 환경에서 Web Worker를 쉽게 사용할 수 있도록 합니다.
 */

import type { RawLogisticsData, ProcessedLogisticsData } from '@/types/logistics';

interface WorkerMessage {
  rawData: RawLogisticsData[];
  canvasWidth?: number;
  canvasHeight?: number;
  viewportBounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export class LogisticsProcessor {
  private worker: Worker | null = null;

  /**
   * 물류 데이터를 전처리합니다.
   * @param rawData 원시 물류 데이터
   * @param canvasWidth Canvas 너비
   * @param canvasHeight Canvas 높이
   * @param viewportBounds 뷰포트 경계 (선택적)
   */
  processData(
    rawData: RawLogisticsData[],
    canvasWidth: number = 1920,
    canvasHeight: number = 1080,
    viewportBounds?: WorkerMessage['viewportBounds']
  ): Promise<ProcessedLogisticsData[]> {
    return new Promise((resolve, reject) => {
      // Worker 생성
      this.worker = new Worker(
        new URL('./logistics-processor.worker.ts', import.meta.url),
        { type: 'module' }
      );

      // 메시지 수신 핸들러
      this.worker.onmessage = (e: MessageEvent) => {
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data as ProcessedLogisticsData[]);
        }
        this.terminate();
      };

      // 에러 핸들러
      this.worker.onerror = (error) => {
        reject(error);
        this.terminate();
      };

      // 데이터 전송
      const message: WorkerMessage = {
        rawData,
        canvasWidth,
        canvasHeight,
        viewportBounds,
      };
      this.worker.postMessage(message);
    });
  }

  /**
   * Worker를 종료하고 메모리를 해제합니다.
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

