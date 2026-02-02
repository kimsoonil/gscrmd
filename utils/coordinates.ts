import type { RawLogisticsData } from "@/types/logistics";

/**
 * 서울 경계 좌표 (WGS84)
 */
export const SEOUL_BOUNDS = {
  minLon: 126.8,
  maxLon: 127.14,
  minLat: 37.44,
  maxLat: 37.68,
};

/**
 * 경도를 Canvas X 좌표로 변환
 * @param longitude 경도
 * @param canvasWidth Canvas 너비
 * @param viewportBounds 뷰포트 경계 (선택적)
 */
export function calculateX(
  longitude: number,
  canvasWidth: number = 1920,
  viewportBounds?: { minX: number; maxX: number },
): number {
  // 서울 경계 내에서 0-1 범위로 정규화
  const normalized =
    (longitude - SEOUL_BOUNDS.minLon) /
    (SEOUL_BOUNDS.maxLon - SEOUL_BOUNDS.minLon);

  if (viewportBounds) {
    // 뷰포트 기반 좌표 계산
    const range = viewportBounds.maxX - viewportBounds.minX;
    return ((normalized - viewportBounds.minX) / range) * canvasWidth;
  }

  return normalized * canvasWidth;
}

/**
 * 위도를 Canvas Y 좌표로 변환
 * @param latitude 위도
 * @param canvasHeight Canvas 높이
 * @param viewportBounds 뷰포트 경계 (선택적)
 */
export function calculateY(
  latitude: number,
  canvasHeight: number = 1080,
  viewportBounds?: { minY: number; maxY: number },
): number {
  // 서울 경계 내에서 0-1 범위로 정규화 (Y축은 반전)
  const normalized =
    1 -
    (latitude - SEOUL_BOUNDS.minLat) /
      (SEOUL_BOUNDS.maxLat - SEOUL_BOUNDS.minLat);

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
    "in-transit": "#3b82f6", // 파란색
    delivered: "#10b981", // 초록색
    delayed: "#ef4444", // 빨간색
    pending: "#f59e0b", // 주황색
  };

  return colorMap[status] || "#6b7280"; // 기본 회색
}
