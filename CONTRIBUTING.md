# 개발 가이드

## 프로젝트 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

### 4. 테스트 실행

```bash
# 테스트 실행
npm test

# 테스트 UI 모드
npm run test:ui

# 커버리지 리포트 생성
npm run test:coverage
```

## 프로젝트 구조

```
GSCRMD/
├── app/                    # Next.js App Router 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 대시보드 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── dashboard-canvas.tsx    # Canvas 기반 렌더링 컴포넌트
│   ├── status-legend.tsx       # 상태 범례 컴포넌트
│   ├── loading-indicator.tsx   # 로딩 인디케이터
│   └── error-message.tsx       # 에러 메시지 컴포넌트
├── store/                 # Zustand 상태 관리
│   └── logistics-store.ts # 물류 데이터 스토어
├── workers/               # Web Worker
│   ├── logistics-processor.ts          # Worker 래퍼
│   └── logistics-processor.worker.ts   # Worker 로직
├── utils/                 # 유틸리티 함수
│   ├── coordinates.ts     # 좌표 변환 유틸리티
│   ├── mock-data.ts       # Mock 데이터 생성
│   └── cn.ts              # 클래스명 병합 유틸리티
├── types/                 # TypeScript 타입 정의
│   └── logistics.ts       # 물류 관련 타입
└── test/                  # 테스트 파일
    ├── setup.ts           # 테스트 설정
    ├── components/        # 컴포넌트 테스트
    ├── store/             # 스토어 테스트
    └── utils/             # 유틸리티 테스트
```

## 주요 기술 스택

- **React 19**: 최신 React 기능 활용
- **Next.js 15**: App Router 기반 SSR/SSG
- **TypeScript**: 타입 안정성 보장
- **Zustand**: 경량 상태 관리
- **Canvas API**: 고성능 렌더링
- **Web Worker**: 백그라운드 데이터 처리
- **Tailwind CSS**: 유틸리티 퍼스트 스타일링
- **VITest**: 빠른 단위 테스트
- **React Testing Library**: 컴포넌트 테스트

## 성능 최적화 전략

1. **Canvas API 기반 렌더링**: DOM 대신 Canvas를 사용하여 대량 데이터 렌더링 성능 향상
2. **Web Worker 활용**: 무거운 계산 로직을 별도 스레드에서 처리
3. **선택적 구독**: Zustand의 선택적 구독으로 불필요한 리렌더링 방지
4. **배치 업데이트**: requestAnimationFrame 기반 배치 업데이트로 렌더링 횟수 최소화

## 테스트 전략

- **단위 테스트**: 유틸리티 함수 및 비즈니스 로직 테스트
- **통합 테스트**: 스토어와 컴포넌트 연동 테스트
- **성능 테스트**: 대량 데이터 처리 성능 검증

## 코드 스타일

- TypeScript strict 모드 사용
- 함수형 프로그래밍 패턴 선호
- 명확한 변수명 사용 (isLoading, hasError 등)
- JSDoc 주석으로 함수 문서화


