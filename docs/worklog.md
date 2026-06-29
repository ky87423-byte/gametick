# 게임시세 (GameSise) 작업 일지

> 프로젝트 상태 스냅샷은 `../MEMORY.md` 참고. 이 파일은 시간순 작업 기록.

---

## 2026-06-30 — 프로젝트 생성부터 VPS 배포까지 (1일차)

gamebit.co.kr을 벤치마크한 한국 게임머니 시세 플랫폼을 새로 시작해, 하루 만에 스캐폴딩 →
기능 구현 → 리브랜딩 → VPS 배포까지 진행. 막판에 바로템 API 고장이라는 외부 블로커 발견.

### 1) 기획·결정
- gamebit 분석: 리니지 아데나 중심 서버별 시세 + 차트 + 커뮤니티, 광고 수익, 라이트 테마.
- 차별화 방향: 멀티 거래소 통합, 가격 알림, programmatic SEO, 다국어.
- 이름 후보 → 처음 **겜틱(GameTick)** 확정했다가, 사용자가 **gamesise.com / gamesise.co.kr** 등록 →
  브랜드를 **게임시세 / GameSise**로 리브랜딩.
- 타겟: 한국(메인) + 베트남 i18n / 수익: 하이브리드(광고 + 자사 CTA).
- 서버 합배포 판단: Shinjiru VPS(2GB RAM) 실측 → 가능, 단 ①공유 수집기 필수 ②스왑 증설 권장.

### 2) 스캐폴딩 (커밋 c6bd622)
- `create-next-app` (Next 16.2.9, TS, Tailwind, app router, src dir).
- A 방식 데이터 레이어: `lib/history.ts`(읽기전용, `GAMETICK_DATA_DIR`), `lib/market.ts`, `data/games.ts`(4게임 87서버).
- i18n ko/vi, `[locale]` 라우팅, 다크테마.

### 3) 디자인 개편 (커밋 d21f098)
- 한국 시세 색상 관례(상승 빨강/하락 파랑)로 교정.
- 경로 기반 라우팅 `/[locale]/[game]`, `/[locale]/[game]/[server]`.
- 헤더(로고+게임탭+로케일), 요약카드, 시세표(검색·정렬·즐겨찾기·행클릭), 서버상세, 급등/급락 위젯, 자사 CTA·푸터.

### 4) 기능 대량 추가 A~E (커밋 b33a452)
- **자동갱신**: `/api/prices` + 시세표 폴링(60s, 탭 숨김 시 중단/복귀 즉시) + 실시간 표시.
- **캔들차트**: history→OHLC 버킷팅(3분/1시간/일봉) + 이동평균선.
- **멀티거래소**: `data/exchanges.ts` 추상화(현재 barotem 1곳, 출처 표시).
- **가격알림**: 브라우저 Notification + localStorage 임계값(이하/이상).
- **즐겨찾기 대시보드** `/[locale]/favorites` (게임 통합).
- **커뮤니티 위젯**: 빈 상태 스텁(데이터 소스 없음).
- **SEO**: 페이지별 `generateMetadata` + `sitemap.xml`(184 URL) + `robots.txt`.
- **임베드 위젯** `/embed/[game]/[server]`.
- **환율 병기**(vi=VND), **PWA** manifest+테마색, **umami**(env), 한국 색상관례.
- 함정: `sitemap.ts`가 `[locale]`에 가로채여 404 → `export const dynamic="force-dynamic"`로 해결.

### 5) 매물수(거래량 지표) — lc_vn + 게임시세 (커밋 01a5996 / lc_vn 7275900)
- lc_vn `barotem.ts`·`history.ts`: 거래가능물품 건수(`count`)를 `history`의 `c`에 저장(거래소 추가 폴링 없음, 하위호환).
- 게임시세 `history.ts` `latestCount()` + `market.ts` `listingCount` + 시세표 매물 컬럼 + 상세 "매물 N건".
- 검증: 매물수 포함 임시 데이터로 오렌 1,605원/133건 렌더 확인.
- **주의**: lc_vn 서버는 아직 구버전 → 매물수 라이브로 채우려면 lc_vn 재배포 필요.

### 6) 리브랜딩 겜틱→게임시세 (커밋 f39ea96)
- 브랜드 문구(ko 게임시세 / vi·en GameSise), 메타데이터, manifest, 푸터 이메일(ad@gamesise.co.kr), SITE_URL 기본값 gamesise.co.kr, package.json name.
- 코드/레포/폴더명(gametick)·env명(GAMETICK_DATA_DIR)은 미변경(선택 작업).
- 차트 확인용 `scripts/gen-sample.mjs` 추가.

### 7) "차트 안 보임" 트러블슈팅
- 원인: 로컬 lc_vn 데이터가 23일 전 → 24h 창 비어 스파크/캔들 빈 화면(코드 정상).
- 처리: `gen-sample.mjs`로 로컬 샘플 데이터 시드 → 스파크 29개·캔들 25개 렌더 확인.
- 부수 발견: 로컬에서 lc_vn 수집기 돌려 신선 데이터 시도 중 가격이 전부 null로 옴(처음엔 IP 스로틀로 오판).

### 8) VPS 배포 (gamesise)
- 스왑 1GB→2GB(`/swapfile2`), `/var/www/gamesise` 클론, `npm ci`+`build`(OOM 없음), PM2 `gamesise` 포트 3003 + `pm2 save`.
- nginx `conf.d/gamesise.conf`(server_name gamesise.co.kr/www → 3003), `nginx -t` 통과 reload.
- 서버 `.env.local`: `GAMETICK_DATA_DIR=/var/www/lc_vn/data`, `NEXT_PUBLIC_SITE_URL=https://gamesise.co.kr`.
- 앱 정상(게임시세 렌더), 4앱 동거 RAM 여유 1.0Gi → 합배포 검증 통과.

### 9) 🔴 핵심 발견: 바로템 API 고장
- 서버 lc_vn 데이터 분석: 1700개 포인트 **전부 가격 null** (수집은 5분마다 계속됨).
- 바로템 직접 요청 → `{"code":0,"msg":"Undefined variable $common"}` (PHP 에러), 모든 파라미터에서 동일. 메인 페이지는 200.
- 결론: **바로템 API가 개편/고장** → lc_vn·게임시세 둘 다 시세 비어있음. 앞선 로컬 null도 이 때문(스로틀 아님).
- 해결 위치: lc_vn `src/lib/barotem.ts` (새 엔드포인트 재분석 필요).

### 10) DNS + HTTPS (당일 후반)
- 사용자가 gamesise.co.kr A레코드(@·www → 111.90.148.135) 입력 → 전파 확인.
- `certbot --nginx`로 Let's Encrypt 발급, HTTP→HTTPS 301 리다이렉트, 자동갱신(만료 2026-09-27).
- **https://gamesise.co.kr 라이브** 확인(게임시세 렌더). 단 시세 데이터는 바로템 고장으로 비어있음.
- 이어서 gamesise.com A레코드 입력 → 전파 확인 → nginx 직접 재작성(.co.kr 앱 / .com 301) + 인증서 webroot로 4도메인 확장.
  - 검증: 인증서 SAN 4개, https .co.kr=200(앱), https/http .com → .co.kr 301. **도메인 구성 완료.**

### 11) 바로템 API 복구 (블로커 해소)
- 진단: `productTable`에 **Referer 헤더 없으면** `code:0 / Undefined variable $common`, **있으면 정상**(`rows[]`/`total` 동일 형식).
  → 바로템이 2026-06경 Referer 검사 추가한 것. 응답 구조는 그대로.
- 수정: lc_vn `src/lib/barotem.ts` fetch에 `Referer: .../product/lists/{threadId}` 추가 (커밋 `c48b1f7`, 매물수 커밋 `7275900`과 함께 배포).
- 서버 lc_vn 배포(git pull+build+pm2 reload) → 수집 강제 → **실데이터 흐름 복구 확인**:
  오렌 1,538원/매물 102건, https://gamesise.co.kr API price 28/29·count 29/29.
- lc_vn 라이브(gmhm365.com)도 동반 복구.
- 차트/24h등락은 수집 누적(300초 주기)에 따라 시간 지나며 채워짐(현재 실포인트 1개).

### 12) 콘텐츠 추가 (gamebit 참고 + 개선)
- 게임 페이지: **평균 시세 추이 차트**(전 서버 평균, `getGameTrend`) + **게임 소개 SEO 텍스트**(템플릿) + **FAQ 아코디언**(네이티브 `<details>`).
- 서버 상세: **시세 계산기**(수량 → 원/VND 환산, 클라이언트).
- 새 파일: `data/content.ts`, `components/{TrendChart,Faq,PriceCalc}.tsx`.
- 배포·라이브 확인 완료 (커밋 `c7c5cf2`).
- gamebit의 네임드/BJ 순위·실시간 거래피드는 데이터 소스 없어 스킵(스텁 유지).

### 13) 네임드/BJ 순위 + 거래완료 피드 + #1 SEO (gamebit 보강)
- **실시간 거래완료 피드(실데이터)**: lc_vn에 `trades.ts` + `barotem.ts` `fetchCompletedTrades`(display=3) 추가 → `trades-{game}.json` 수집. 게임시세 `TradeFeed` 사이드바(빈 커뮤니티 스텁 대체). 라이브 확인(듀크데필 50만 아데나 41,000원 등 40건).
- **네임드/BJ 순위 위젯**: `data/rankings.ts`(큐레이션 모델, 비면 준비중) + `Rankings` 컴포넌트. 자동 소스(BJ=치지직/SOOP API, 네임드=랭킹/수동)는 후속.
- **#1 서버별 SEO 텍스트**: `content.ts serverIntro` + 상세 페이지 문단.
- lc_vn 커밋 `c10ab38`, 게임시세 `7f239f8`/`6278262`. 양쪽 배포·라이브 확인.

### 1~7 추천작업 진행: #1 완료. 남음 #2 주간리포트 · #3 가이드 · #4 게임확대 · #5 멀티거래소 · #6 약관/정책 · #7 텔레/디스코드 알림.
### 현재 상태: gamesise.co.kr 라이브 + 실데이터 흐름. 인프라/파이프라인 완성.

### 다음 세션 진입점
1. **바로템 API 복구** (lc_vn `barotem.ts`) — 데이터의 전제. 1순위.
2. **DNS**(사용자: A레코드 @·www → 111.90.148.135) → **certbot** HTTPS 발급.
3. **lc_vn 서버 재배포** — 매물수 라이브 반영(바로템 복구 후).
4. (선택) gametick→gamesise 리네이밍, 멀티거래소 실연동.
→ 상세는 `../MEMORY.md` §4~6.
