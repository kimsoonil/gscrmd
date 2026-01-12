/**
 * 물류 데이터 전처리 Web Worker
 * 메인 스레드를 차단하지 않고 대량의 데이터를 처리합니다.
 * 
 * Note: Worker 파일에서는 import를 직접 사용할 수 없으므로,
 * 필요한 함수들을 Worker 내부에 직접 구현합니다.
 */

// 타입 정의 (Worker 내부)
interface RawLogisticsData {
  id: string;
  longitude: number;
  latitude: number;
  status: string;
  vehicleId: string;
  timestamp: number;
}

interface ProcessedLogisticsData {
  id: string;
  x: number;
  y: number;
  color: string;
  status: string;
  vehicleId: string;
  timestamp: number;
  originalLongitude: number;
  originalLatitude: number;
}

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

// 좌표 변환 함수 (Worker 내부 구현)
function calculateX(
  longitude: number,
  canvasWidth: number = 1920,
  viewportBounds?: { minX: number; maxX: number }
): number {
  const normalized = (longitude + 180) / 360;
  if (viewportBounds) {
    const range = viewportBounds.maxX - viewportBounds.minX;
    return ((normalized - viewportBounds.minX) / range) * canvasWidth;
  }
  return normalized * canvasWidth;
}

function calculateY(
  latitude: number,
  canvasHeight: number = 1080,
  viewportBounds?: { minY: number; maxY: number }
): number {
  const normalized = 1 - (latitude + 90) / 180;
  if (viewportBounds) {
    const range = viewportBounds.maxY - viewportBounds.minY;
    return ((normalized - viewportBounds.minY) / range) * canvasHeight;
  }
  return normalized * canvasHeight;
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'in-transit': '#3b82f6',
    'delivered': '#10b981',
    'delayed': '#ef4444',
    'pending': '#f59e0b',
  };
  return colorMap[status] || '#6b7280';
}

// Worker 메시지 핸들러
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { rawData, canvasWidth = 1920, canvasHeight = 1080, viewportBounds } = e.data;

  try {
    // 복잡한 필터링이나 좌표 변환 로직 수행
    // 시니어 포인트: 비즈니스 로직의 분리
    const processedData: ProcessedLogisticsData[] = rawData.map((item: RawLogisticsData) => {
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
      };
    });

    // 처리된 데이터를 메인 스레드로 전송
    self.postMessage(processedData);
  } catch (error) {
    // 에러 처리
    self.postMessage({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

