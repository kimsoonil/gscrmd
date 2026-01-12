/**
 * 물류 노드의 상태 타입
 */
export type LogisticsStatus = 'in-transit' | 'delivered' | 'delayed' | 'pending';

/**
 * 목적지 정보 타입
 */
export interface Destination {
  longitude: number;
  latitude: number;
  address?: string;
  name?: string;
}

/**
 * 배송 물품 정보 타입
 */
export interface Cargo {
  id: string;
  name: string;
  quantity: number;
  weight?: number; // kg
  volume?: number; // m³
}

/**
 * 물류 노드의 원시 데이터 타입
 */
export interface RawLogisticsData {
  id: string;
  longitude: number;
  latitude: number;
  status: LogisticsStatus;
  vehicleId: string;
  timestamp: number;
  destination?: Destination;
  cargo?: Cargo[];
  estimatedArrival?: number; // 예상 도착 시간 (timestamp)
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  routeId?: string;
  driverName?: string;
  totalWeight?: number; // 총 중량 (kg)
  totalVolume?: number; // 총 부피 (m³)
}

/**
 * 전처리된 물류 노드 데이터 타입
 */
export interface ProcessedLogisticsData {
  id: string;
  x: number; // Canvas 좌표 X
  y: number; // Canvas 좌표 Y
  color: string; // 상태에 따른 색상
  status: LogisticsStatus;
  vehicleId: string;
  timestamp: number;
  originalLongitude: number;
  originalLatitude: number;
  // 원본 데이터 참조 (물류 정보 접근용)
  rawData?: RawLogisticsData;
}

/**
 * Web Worker 메시지 타입
 */
export interface WorkerMessage {
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


