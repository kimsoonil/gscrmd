/**
 * 물류 데이터 전처리 유틸리티
 * Next.js 환경에서 메인 스레드에서 비동기로 처리합니다.
 * 메인 스레드를 차단하지 않기 위해 청크 단위로 나누어 처리합니다.
 */

import type { RawLogisticsData, ProcessedLogisticsData } from '@/types/logistics';
import { calculateX, calculateY, getStatusColor } from '@/utils/coordinates';

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

/**
 * 청크 단위로 데이터를 처리하여 메인 스레드를 차단하지 않습니다.
 * @param data 처리할 데이터
 * @param chunkSize 한 번에 처리할 데이터 크기
 * @param processor 처리 함수
 */
async function processInChunks<T, R>(
  data: T[],
  chunkSize: number,
  processor: (chunk: T[]) => R[]
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const chunkResults = processor(chunk);
    results.push(...chunkResults);
    
    // 다음 이벤트 루프로 넘어가서 UI가 블로킹되지 않도록 함
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  
  return results;
}

/**
 * 물류 데이터를 전처리합니다.
 * 대량의 데이터를 청크 단위로 나누어 처리하여 UI 스레드가 블로킹되지 않도록 합니다.
 */
export async function processLogisticsData(
  rawData: RawLogisticsData[],
  canvasWidth: number = 1920,
  canvasHeight: number = 1080,
  viewportBounds?: WorkerMessage['viewportBounds']
): Promise<ProcessedLogisticsData[]> {
  try {
    // 청크 크기 설정 (한 번에 처리할 데이터 개수)
    // 너무 작으면 오버헤드가 크고, 너무 크면 블로킹이 발생할 수 있음
    const chunkSize = Math.max(100, Math.floor(rawData.length / 100));
    
    // 청크 단위로 처리
    const processedData = await processInChunks(
      rawData,
      chunkSize,
      (chunk) =>
        chunk.map((item: RawLogisticsData) => {
          const x = calculateX(item.longitude, canvasWidth, viewportBounds);
          const y = calculateY(item.latitude, canvasHeight, viewportBounds);
          const color = getStatusColor(item.status);

          return {
            id: item.id,
            x,
            y,
            color,
            status: item.status,
            vehicleId: item.vehicleId,
            timestamp: item.timestamp,
            originalLongitude: item.longitude,
            originalLatitude: item.latitude,
            rawData: item, // 원본 데이터 참조 추가
          };
        })
    );

    return processedData;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '데이터 처리 중 오류가 발생했습니다.');
  }
}

