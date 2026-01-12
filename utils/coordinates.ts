import type { RawLogisticsData } from '@/types/logistics';

/**
 * 경도를 Canvas X 좌표로 변환
 * @param longitude 경도 (-180 ~ 180)
 * @param canvasWidth Canvas 너비
 * @param viewportBounds 뷰포트 경계 (선택적)
 */
export function calculateX(
  longitude: number,
  canvasWidth: number = 1920,
  viewportBounds?: { minX: number; maxX: number }
): number {
  // 경도를 0-1 범위로 정규화
  const normalized = (longitude + 180) / 360;
  
  if (viewportBounds) {
    // 뷰포트 기반 좌표 계산
    const range = viewportBounds.maxX - viewportBounds.minX;
    return ((normalized - viewportBounds.minX) / range) * canvasWidth;
  }
  
  return normalized * canvasWidth;
}

/**
 * 위도를 Canvas Y 좌표로 변환
 * @param latitude 위도 (-90 ~ 90)
 * @param canvasHeight Canvas 높이
 * @param viewportBounds 뷰포트 경계 (선택적)
 */
export function calculateY(
  latitude: number,
  canvasHeight: number = 1080,
  viewportBounds?: { minY: number; maxY: number }
): number {
  // 위도를 0-1 범위로 정규화 (Y축은 반전)
  const normalized = 1 - (latitude + 90) / 180;
  
  if (viewportBounds) {
    // 뷰포트 기반 좌표 계산
    const range = viewportBounds.maxY - viewportBounds.minY;
    return ((normalized - viewportBounds.minY) / range) * canvasHeight;
  }
  
  return normalized * canvasHeight;
}

/**
 * 상태에 따른 색상 반환
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'in-transit': '#3b82f6', // 파란색
    'delivered': '#10b981', // 초록색
    'delayed': '#ef4444', // 빨간색
    'pending': '#f59e0b', // 주황색
  };
  
  return colorMap[status] || '#6b7280'; // 기본 회색
}


