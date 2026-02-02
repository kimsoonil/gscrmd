"use client";

/**
 * Canvas API 기반 고성능 렌더링 컴포넌트
 * DOM 요소 수만 개를 생성하는 대신, 단 하나의 <canvas> 엘리먼트에 직접 그림을 그려 렌더링 성능을 확보합니다.
 */

import React, { useEffect, useRef, useCallback } from "react";
import { useVisibleData, useCanvasSize } from "@/store/logistics-store";
import { getClickedVehicle } from "@/utils/canvas-interaction";
import type { ProcessedLogisticsData } from "@/types/logistics";

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

  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // 배경 이미지 로드
  useEffect(() => {
    const img = new Image();
    img.src = "/images/seoul-wide-map.png";
    img.onload = () => {
      bgImageRef.current = img;
      render();
    };
  }, []);

  // 고성능 렌더링 로직
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Canvas 크기 설정
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // 배경 클리어 (기본 배경색)
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillRect(0, 0, width, height);

    const zoom = 1.2; // 와이드 맵은 화면에 가득 차도록 1.0 배율 사용

    // 서울 지도 배경 그리기
    if (bgImageRef.current) {
      // 이미지를 화면 중앙에 가득 차게 그리기
      const drawWidth = width * zoom;
      const drawHeight = height * zoom;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      ctx.drawImage(
        bgImageRef.current,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );

      // 데이터 가독성을 위해 배경 위에 아주 옅은 반투명 레이어 추가 (선택 사항)
      ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
      ctx.fillRect(0, 0, width, height);
    }

    // Batch Drawing - 고성능 렌더링
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
        // 좌표도 확대 및 중앙 정렬 적용
        const scaledX = (item.x - width / 2) * zoom + width / 2;
        const scaledY = (item.y - height / 2) * zoom + height / 2;
        ctx.moveTo(scaledX, scaledY);
        ctx.arc(scaledX, scaledY, 3, 0, Math.PI * 2);
      });

      ctx.fill();
    });

    // 호버 효과를 위한 마우스 위치 추적
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

      // 줌 및 중앙 정렬 역산하여 원본 좌표 계산
      const zoom = 1;
      const originalX = (x - width / 2) / zoom + width / 2;
      const originalY = (y - height / 2) / zoom + height / 2;

      // 최적화된 클릭 피킹 로직 사용
      const clickedVehicle = getClickedVehicle(
        originalX,
        originalY,
        visibleData,
        dpr,
        10,
      );

      if (clickedVehicle && clickHandlerRef.current) {
        clickHandlerRef.current(clickedVehicle);
      }
    },
    [visibleData, width, height],
  );

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onClick={handleCanvasClick}
      style={{ cursor: "pointer" }}
    />
  );
};
