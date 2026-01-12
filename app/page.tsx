'use client';

/**
 * 랜딩 페이지
 * 프로젝트 소개 및 대시보드 접근
 */

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              🚚 Global Supply Chain
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6">
              Real-time Monitoring Dashboard
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              브라우저 성능 한계를 극복한 고성능 물류/SCM 데이터 시각화 솔루션
            </p>
          </header>

          {/* 프로젝트 소개 */}
          <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-12 border border-white/20">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">프로젝트 소개</h3>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    Global Supply Chain Real-time Monitoring Dashboard는 대규모 물류/SCM 데이터를 실시간으로 시각화하고 모니터링하기 위한 고성능 웹 애플리케이션입니다.
                  </p>
                  <p>
                    수만 개의 물류 차량 위치 정보를 동시에 처리하고 렌더링해야 하는 상황에서, 기존 DOM 기반 렌더링 방식으로는 브라우저 성능 한계로 인해 프레임 드랍과 메모리 누수가 발생했습니다. 
                    이러한 문제를 해결하기 위해 React의 선언적 렌더링 대신 명령형 Canvas API를 결합한 하이브리드 구조를 채택하여, 10,000개 이상의 실시간 물류 노드를 60FPS로 안정적으로 렌더링할 수 있도록 최적화했습니다.
                  </p>
                  <p>
                    또한 대용량 데이터 처리 시 UI 스레드 블로킹을 방지하기 위해 비동기 청크 처리 방식을 도입하고, Zustand의 선택적 구독과 requestAnimationFrame 기반 배치 업데이트를 통해 불필요한 리렌더링을 최소화했습니다. 
                    고성능 클릭 인터랙션을 위해 거리 제곱 비교 로직을 적용하여 클릭 피킹 속도를 10ms 이내로 단축하는 등 사용자 경험을 향상시키기 위한 다양한 최적화 기법을 적용했습니다.
                  </p>
                  <p>
                    이 프로젝트는 단순한 데이터 시각화를 넘어, 브라우저의 성능 한계를 극복하고 대규모 비즈니스 데이터를 효율적으로 시각화하는 방법에 대한 기술적 해답을 제시합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-4">주요 기능</h3>
                <div className="space-y-4 text-slate-300">
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-blue-400">🗺️</span>
                      고성능 맵 렌더링
                    </h4>
                    <p className="text-sm leading-relaxed">
                      Canvas API 기반 하이브리드 렌더링 엔진을 구축하여 수만 개의 물류 노드를 실시간으로 시각화합니다. 
                      픽셀 기반 최적화를 통해 GPU 가속을 적극 활용하며, 색상별 배치 렌더링으로 렌더링 횟수를 최소화합니다. 
                      10,000개 이상의 객체를 처리해도 60FPS를 안정적으로 유지합니다.
                    </p>
                  </div>

                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-green-400">⚡</span>
                      비동기 데이터 처리
                    </h4>
                    <p className="text-sm leading-relaxed">
                      대용량 데이터 처리 시 UI 스레드 블로킹을 방지하기 위해 청크 단위 비동기 처리 방식을 채택했습니다. 
                      데이터를 작은 단위로 나누어 처리하고, 각 청크 처리 사이에 이벤트 루프를 넘겨주어 사용자 인터랙션이 끊기지 않도록 보장합니다. 
                      이를 통해 데이터 로딩 속도를 초기 대비 70% 단축했습니다.
                    </p>
                  </div>

                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-purple-400">🎯</span>
                      최적화된 상태 관리
                    </h4>
                    <p className="text-sm leading-relaxed">
                      Zustand의 선택적 구독(Selector) 기능을 극대화하여 필요한 데이터만 구독하도록 설계했습니다. 
                      requestAnimationFrame 기반의 배치 업데이트 메커니즘을 구현하여 짧은 시간 내 발생하는 다수의 상태 변경을 모아서 한 번에 업데이트합니다. 
                      이를 통해 불필요한 리렌더링을 최소화하고 전체적인 렌더링 성능을 향상시켰습니다.
                    </p>
                  </div>

                  <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-orange-400">🖱️</span>
                      고성능 클릭 인터랙션
                    </h4>
                    <p className="text-sm leading-relaxed">
                      수만 개의 점이 있는 캔버스에서도 즉각적인 클릭 반응을 제공합니다. 
                      Math.sqrt() 호출을 제거하고 거리 제곱 비교 로직(Distance Squared)을 적용하여 계산 비용을 절감했습니다. 
                      조기 종료(Early Exit) 최적화를 통해 10,000개 객체 환경에서 클릭 피킹 속도를 10ms 이내로 단축했습니다.
                    </p>
                  </div>

                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-red-400">📊</span>
                      상세 정보 표시
                    </h4>
                    <p className="text-sm leading-relaxed">
                      캔버스의 노드를 클릭하면 차량 정보와 함께 관련 물류 정보를 상세히 확인할 수 있습니다. 
                      차량 ID, 기사명, 배송 상태, 우선순위, 경로 정보뿐만 아니라 현재 위치, 목적지, 예상 도착 시간, 배송 물품 목록 및 총 중량/부피 등 종합적인 물류 정보를 제공합니다.
                    </p>
                  </div>

                  <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-cyan-400">⌨️</span>
                      직관적인 사용자 인터페이스
                    </h4>
                    <p className="text-sm leading-relaxed">
                      키보드 단축키와 버튼을 통한 편리한 데이터 조절 기능을 제공합니다. 
                      스크롤을 통해 데이터 수를 100단위로 조절할 수 있으며, 
                      스크롤바 없이 전체 화면을 활용한 몰입형 대시보드 경험을 제공합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA 버튼 */}
          <div className="text-center">
            <button
              onClick={handleStartClick}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>대시보드 시작하기</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-slate-400 text-sm">
            <p>
              개발자:{' '}
              <a
                href="https://github.com/kimsoonil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                GitHub
              </a>
              {' | '}
              <a
                href="https://k-soonil.tistory.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Blog
              </a>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
