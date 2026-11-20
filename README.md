# 물류 모니터링 대시보드 (gscrmd)

모의 물류 데이터를 Canvas로 표시하는 개인 기술 검증 프로젝트입니다. 회사 SCM 코드·내부 데이터는 사용하지 않습니다.

## 확인된 구현

- Next.js 15 / React 18 / TypeScript / Zustand
- `app/dashboard/page.tsx`: 기본 10,000개 모의 차량 생성, 데이터 개수 선택
- `components/dashboard-canvas.tsx`: Canvas 2D 색상별 배치 렌더링, 차량 선택
- `utils/logistics-processor.ts`: 메인 스레드에서 비동기 청크 단위 좌표 전처리
- `store/logistics-store.ts`: 상태 저장과 requestAnimationFrame 배치 업데이트
- `hooks/use-logistics-socket.ts`: WebSocket 연결 훅. 기본 비활성, 실제 물류 서버 미연동
- `workers/`: Worker 구현 파일은 있으나 현재 상태 저장소의 처리 경로와 구분해야 합니다.

Deck.gl 의존성과 OffscreenCanvas 렌더링은 현재 구현에서 확인되지 않았습니다.

## 성능 주장 검증 상태

이전 README의 60FPS, 로딩 70% 단축, 커버리지 80%, 개발 속도 30% 향상, 클릭 10ms 이내는 측정 환경·원본 결과·비교 기준이 없어 검증된 성과에서 제외했습니다. 클릭 탐색은 거리 제곱 기반 O(n) 순회이며 공간 인덱스나 조기 루프 종료를 사용하지 않습니다.

재측정 시 commit SHA, OS/CPU, 브라우저 버전, DPR, 화면 크기, 데이터 생성 seed, warm-up 및 반복 횟수를 기록하세요. FPS는 실제 브라우저 렌더링에서 10k/50k/100k 데이터별 중앙값·p95 프레임 시간을 기록하고, 로딩은 생성·전처리·첫 그리기를 분리해야 합니다. 커버리지는 아래 명령의 원본 리포트를 보관해야 합니다.

## 실행

Node 24와 pnpm 10.12.1 기준:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
corepack pnpm exec vitest run
corepack pnpm test:coverage --run
corepack pnpm build
```

테스트 통과 여부는 별도 검증 보고서를 참조하세요. 빌드 성공이나 jsdom 테스트는 60FPS를 증명하지 않습니다.

## 재현 가능한 CPU 피킹 측정

```sh
node scripts/benchmark-picking.mjs
```

고정 seed 42, warm-up 50회, 측정 200회, 데이터 10k/50k/100k 기준 Node CPU 함수만 측정합니다. Canvas 렌더링·FPS·실제 클릭 입력 지연과는 다른 지표입니다. 2026-11-20 Apple M4 / macOS arm64 / Node 24.19.0에서 10k 중앙값 약 0.0115ms, p95 약 0.0125ms였습니다. 실행 환경과 원본 JSON을 함께 보관합니다.

같은 날 수정 후 테스트 18개가 통과했고, Vitest V8 전체 파일 기준 문장·라인 커버리지는 29.85%였습니다. 이전 80% 주장과 같은 측정으로 간주하지 않습니다.

## 데이터 갱신 및 렌더링 보완

- 오래 걸린 이전 요청이 최신 데이터/화면 크기 처리 결과를 덮지 않도록 요청 순서를 확인합니다.
- 실시간 갱신은 ID별 최신 timestamp를 반영하며, 연속 배치에서 다른 차량 데이터가 유실되지 않습니다.
- 소켓 메시지가 한 건뿐이어도 다음 animation frame에 반영하며, 연결 해제 시 대기 버퍼를 폐기합니다. 실제 서버 연결은 기본 비활성입니다.
- Canvas는 데이터·크기·배경 변경 시에만 다시 그립니다. 매 프레임 전체 지도 초기화를 반복하지 않습니다.
- 실제 지도 컨테이너의 크기를 ResizeObserver로 측정합니다. 모바일에서 헤더가 여러 줄이어도 지도 높이를 맞춥니다.
- 테스트: 최신 요청 우선, 차량별 중복/이전 이벤트, 소량 메시지 반영/연결 해제 회귀 검증 포함.
