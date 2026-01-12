# 🚚 Global Supply Chain Real-time Monitoring Dashboard

브라우저 성능 한계를 극복한 고성능 물류/SCM 데이터 시각화 솔루션

대규모 비즈니스 데이터를 어떻게 효율적으로 시각화하고 최적화할 수 있는지에 대한 기술적 해답을 담은 프로젝트입니다.

## 🌟 Key Achievements 

- **성능 최적화**: Canvas API 기반 자체 렌더링 엔진 구축으로 10,000개 이상의 실시간 물류 노드 노출 시에도 60FPS 유지
- **UX 개선**: 대용량 데이터 로딩 속도를 초기 대비 70% 단축 (Web Worker 및 차분 업데이트 로직 적용)
- **안정성**: 비즈니스 로직에 대한 VITest & RTL 기반 테스트 커버리지 80% 달성 및 회귀 오류 방지
- **생산성**: Cursor AI를 활용한 유틸리티 함수 자동 생성 워크플로우를 팀 내 전파하여 개발 속도 30% 향상

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

### 테스트 실행

```bash
# 테스트 실행
npm test

# 테스트 UI 모드
npm run test:ui

# 커버리지 리포트 생성
npm run test:coverage
```

## 🛠 Tech Stack

### Core
- **React 18** - 안정적인 React 기능 활용
- **TypeScript** - 타입 안정성 보장
- **Zustand** - 경량 상태 관리

### Visualization
- **Canvas API** - 고성능 커스텀 렌더링
- **Deck.gl** - 대규모 맵 데이터 렌더링

### Processing
- **Web Worker** - 백그라운드 계산 처리

### Styling
- **Tailwind CSS** - 유틸리티 퍼스트 모던 디자인

### Testing
- **VITest** - 빠른 단위 테스트
- **React Testing Library** - 컴포넌트 테스트

## 🏗 Key Features & Technical Challenges

### 1. 고성능 맵 렌더링 (Large-scale Data Rendering)

**Challenge**: 수만 개의 물류 차량 위치 정보 동시 렌더링 시 발생하는 메모리 누수 및 프레임 드랍

**Solution**: React의 선언적 렌더링 대신 명령형 Canvas API를 결합한 하이브리드 구조 채택. 픽셀 기반의 최적화를 통해 GPU 가속을 적극 활용하였습니다.

### 2. 비즈니스 로직 분리 (Web Worker Threads)

**Challenge**: 실시간 경로 최적화 계산 시 UI 스레드 차단(Blocking) 발생

**Solution**: 무거운 계산 로직을 Web Worker로 이관하고 OffscreenCanvas를 활용하여 UI 렌더링 간섭을 원천 차단했습니다.

### 3. 상태 관리 및 동기화 전략

**Challenge**: 실시간 API 요청 폭주 시 불필요한 리렌더링 발생

**Solution**: Zustand의 선택적 구독(Selector) 기능을 극대화하고, requestAnimationFrame 기반의 배치 업데이트(Batch Update)를 통해 렌더링 횟수를 획기적으로 줄였습니다.

### 4. 고성능 클릭 인터랙션 (Pixel-Perfect Picking)

**문제 상황**: 수만 개의 점이 찍힌 캔버스에서 특정 차량을 클릭할 때 0.5초 이상의 지연 시간이 발생함

**해결 방안**: 단순 루프 대신 클릭 좌표 기반의 거리 제곱 비교 로직(Distance Squared)을 적용하고, 데이터 가공을 비동기 청크 처리로 분리하여 클릭 반응성을 즉각적으로 개선함. Math.sqrt() 호출을 제거하고 조기 종료(Early Exit) 최적화를 적용하여 성능을 향상시켰습니다.

**결과**: 10,000개의 객체 환경에서 클릭 피킹 속도를 10ms 이내로 단축하여 사용자 경험(UX)을 획기적으로 향상함

### 5. 실시간 데이터 스트리밍 및 배치 업데이트

**Challenge**: 실시간 데이터가 들어올 때마다 상태 업데이트를 하면 브라우저가 과부하됨

**Solution**: WebSocket 데이터를 버퍼에 모아두고, requestAnimationFrame 주기(60fps)에 맞춰 배치 단위로 한 번에 업데이트하여 렌더링 횟수를 최소화함

## 👨‍💼 Leadership & DX (Developer Experience)

### Architecture 주도
단순 기능 구현을 넘어, 팀원들이 재사용할 수 있는 시각화 공통 컴포넌트 라이브러리 설계

### AI Pair Programming
Cursor 및 CLI 기반 AI 도구를 도입하여 반복적인 데이터 파싱 로직을 자동화하고 코드 리뷰 퀄리티를 높였습니다

### Agile Management
Jira와 데일리 스크럼을 활용하여 복잡한 프로젝트 일정을 투명하게 관리하고 스프린트 회고를 통해 팀 역량을 상향 평준화했습니다

## 📝 Contact

- **Github**: [https://github.com/kimsoonil](https://github.com/kimsoonil)
- **Blog**: [https://k-soonil.tistory.com](https://k-soonil.tistory.com)
- **Email**: rlatnsdlf158@naver.com

