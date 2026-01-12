/**
 * 실시간 물류 데이터 WebSocket 훅
 * 시니어 포인트: 소켓 데이터가 들어올 때마다 렌더링하지 않고,
 * requestAnimationFrame 주기에 맞춰 데이터를 모아서 한 번에 업데이트
 */

import { useEffect, useRef } from 'react';
import { useLogisticsStore } from '@/store/logistics-store';
import type { RawLogisticsData } from '@/types/logistics';

interface UseLogisticsSocketOptions {
  url?: string;
  bufferSize?: number; // 버퍼 크기 (기본값: 100)
  enabled?: boolean; // WebSocket 활성화 여부 (기본값: false, 실제 서버가 없으므로)
}

/**
 * 실시간 물류 데이터 스트리밍 훅
 * WebSocket을 통해 실시간 데이터를 받아 배치 업데이트합니다.
 * 
 * @param options WebSocket 옵션
 */
export function useLogisticsSocket(options: UseLogisticsSocketOptions = {}) {
  const { url, bufferSize = 100, enabled = false } = options;
  const updateDataBatch = useLogisticsStore((state) => state.updateDataBatch);
  const bufferRef = useRef<RawLogisticsData[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 실제 서버가 없으므로 기본적으로 비활성화
    // 실제 환경에서는 enabled를 true로 설정하고 url을 제공
    if (!enabled || !url) return;

    // WebSocket 연결
    const socket = new WebSocket(url);
    socketRef.current = socket;

    // 버퍼를 배치로 업데이트하는 함수
    const flushBuffer = () => {
      if (bufferRef.current.length > 0) {
        updateDataBatch(bufferRef.current);
        bufferRef.current = [];
      }
      rafIdRef.current = null;
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data) as RawLogisticsData | RawLogisticsData[];
        const dataArray = Array.isArray(newData) ? newData : [newData];
        
        bufferRef.current.push(...dataArray);

        // 16ms(60fps) 주기로 버퍼에 쌓인 데이터를 한 번에 스토어에 반영
        if (bufferRef.current.length >= bufferSize) {
          // requestAnimationFrame을 사용하여 다음 프레임에 배치 업데이트
          if (!rafIdRef.current) {
            rafIdRef.current = requestAnimationFrame(flushBuffer);
          }
        }
      } catch (error) {
        console.error('WebSocket 메시지 파싱 오류:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, bufferSize, enabled, updateDataBatch]);
}

