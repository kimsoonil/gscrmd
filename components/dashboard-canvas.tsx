'use client';

/**
 * Canvas API 기반 고성능 렌더링 컴포넌트
 * DOM 요소 수만 개를 생성하는 대신, 단 하나의 <canvas> 엘리먼트에 직접 그림을 그려 렌더링 성능을 확보합니다.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useVisibleData, useCanvasSize } from '@/store/logistics-store';
import { getClickedVehicle } from '@/utils/canvas-interaction';
import type { ProcessedLogisticsData } from '@/types/logistics';

interface DashboardCanvasProps {
  className?: string;
  onNodeClick?: (node: ProcessedLogisticsData) => void;
}

export const DashboardCanvas: React.FC<DashboardCanvasProps> = ({
  className,
  onNodeClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const visibleData = useVisibleData();
  const { width, height } = useCanvasSize();
  const clickHandlerRef = useRef(onNodeClick);

  // 클릭 핸들러 최신화
  useEffect(() => {
    clickHandlerRef.current = onNodeClick;
  }, [onNodeClick]);

  // 고성능 렌더링 로직
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Canvas 크기 설정
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // 배경 클리어
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Batch Drawing - 고성능 렌더링
    // 같은 색상의 노드들을 그룹화하여 렌더링 횟수 최소화
    const nodesByColor = new Map<string, ProcessedLogisticsData[]>();
    
    visibleData.forEach((item) => {
      const nodes = nodesByColor.get(item.color) || [];
      nodes.push(item);
      nodesByColor.set(item.color, nodes);
    });

    // 색상별로 배치 렌더링
    nodesByColor.forEach((nodes, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      
      nodes.forEach((item) => {
        ctx.moveTo(item.x, item.y);
        ctx.arc(item.x, item.y, 3, 0, Math.PI * 2);
      });
      
      ctx.fill();
    });

    // 호버 효과를 위한 마우스 위치 추적 (선택적)
    // 실제 구현 시 마우스 이벤트와 연동
  }, [visibleData, width, height]);

  // 렌더링 루프 시작
  useEffect(() => {
    const animate = () => {
      render();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [render]);

  // 캔버스 클릭 이벤트 처리 (고성능 클릭 피킹)
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!clickHandlerRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // DPR 고려한 실제 좌표 계산
      const dpr = window.devicePixelRatio || 1;
      const x = (e.clientX - rect.left) * (canvas.width / (rect.width * dpr));
      const y = (e.clientY - rect.top) * (canvas.height / (rect.height * dpr));

      // 최적화된 클릭 피킹 로직 사용
      const clickedVehicle = getClickedVehicle(x, y, visibleData, dpr, 10);

      if (clickedVehicle && clickHandlerRef.current) {
        clickHandlerRef.current(clickedVehicle);
      }
    },
    [visibleData]
  );

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onClick={handleCanvasClick}
      style={{ cursor: 'pointer' }}
    />
  );
};


