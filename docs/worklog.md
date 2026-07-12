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

### 14) 추천작업 #2 · #6 · #3 (배포·라이브)
- **#2 시세 리포트**(`/[locale]/report`): `getReport()` — 가용기간 평균 등락 + 급등/급락 서버, 게임별 카드. 헤더/푸터 링크.
- **#6 소개/약관/정책**(`/about /terms /privacy`): `legal.ts` + `Prose` 공용 컴포넌트, 푸터 링크.
- **#3 가이드**(`/guide`, `/guide/[slug]`): 시세보는법·안전거래·사기예방 3편, `guides.ts`.
- sitemap에 신규 페이지 반영. 커밋 `3462bc3`, 전부 라이브 200.

### 15) #4 게임 확대 (4종 → 14종)
- 바로템 메인 임베드 JSON(line 106 게임메뉴)에서 money thread(`2382r` 접두) = 게임별 머니 스레드 발견. 메뉴 순서 = 인기순.
- 우리 없는 상위 10종 추가: 리니지M·로드나인·조선협객전·레이븐2·나이트크로우·뱀피르·RF온라인넥스트·리니지2M·아이온·아키에이지워 (총 164서버).
- **게임마다 서버 필터 필드가 다름**(opt1 vs opt2) → `GameInfo.serverParam` 추가, lc_vn `barotem.ts`가 게임별 사용. (gen-games.py로 자동감지·수집, gen-config.py로 TS 생성)
- 통화 대부분 다이아(아이온=키나), 단위 대부분 천당. 서버명은 nameEn=nameKo(검색용).
- lc_vn `2455a09`, gamesise `e575375`. 배포·라이브 확인(리니지M 15,385원, 로드나인 6,400원, 14게임 전부 200).

### 1~7 추천작업: ✅#1 #2 #3 #4 #6 / 남음: #5 멀티거래소(리버스, 큼) · #7 텔레/디스코드 알림(봇 토큰 필요).
### 현재 상태: gamesise.co.kr 라이브 + 실데이터 흐름. 인프라/파이프라인 완성.

### 다음 세션 진입점
1. **바로템 API 복구** (lc_vn `barotem.ts`) — 데이터의 전제. 1순위.
2. **DNS**(사용자: A레코드 @·www → 111.90.148.135) → **certbot** HTTPS 발급.
3. **lc_vn 서버 재배포** — 매물수 라이브 반영(바로템 복구 후).
4. (선택) gametick→gamesise 리네이밍, 멀티거래소 실연동.
→ 상세는 `../MEMORY.md` §4~6.

---

## 2026-06-30 — BJ 순위 실데이터 연동 (세션)

### 16) BJ 순위 = 치지직 라이브 검색 자동화 (`233fb84`, 배포·라이브 완료)
- 그동안 "준비 중" 스텁이던 BJ 순위 위젯에 **치지직(Chzzk) 공개 라이브 검색 API** 실데이터 연동.
- `src/lib/chzzk.ts`: `search/lives?keyword=` 호출 → `concurrentUserCount` 내림차순, 채널 dedupe, 상위 5. `fetch revalidate:300`(5분 캐시), 실패 시 `[]` → 위젯 "준비 중" graceful. **별도 수집기/워커·DB 불필요**(요청 시 직접 fetch, 페이지가 force-dynamic이라 자연스럽게 동작).
- `games.ts`: `GameInfo.chzzkKeyword`(없으면 nameKo). 보정: 메이플→메이플랜드, 조선협객전·RF온라인·아키에이지.
- 위젯(`Rankings.tsx`): BJ는 채널 링크(`chzzk.naver.com/live/{id}`)+방송중 빨간점+시청자수 note+"실시간·치지직" 서브타이틀. `RankItem`에 `url`/`live` 추가. `format.ts` `formatViewers`(1.2천/1.2만), i18n `bjLive`/`viewersSuffix`.
- **네임드 순위는 그대로 수동 큐레이션**(`rankings.ts` RANKINGS, 비면 "준비 중"). 깔끔한 자동 소스 없음.
- **검증**: 로컬(메이플 24/9/8…), **VPS(말레이시아)에서 api.chzzk.naver.com 200+데이터**(지역차단 없음), 배포 후 https://gamesise.co.kr/ko/maplestory-world BJ 5채널 렌더(27/10/6/6/2 시청) 확인.

### 17) "네임드 순위" → 치지직 인기 영상으로 전환 (`16cb1c1`)
- **조사 결론**: 게임 내 네임드(캐릭터) 순위는 깔끔한 자동 소스가 없음.
  - 치지직 라이브/영상/채널 검색은 다 되지만 전부 *스트리머*(캐릭터 아님).
  - 리니지 plaync 공식 랭킹은 JS/인증 장벽 + 게임마다 달라 14게임 스크래핑은 깨지기 쉬움.
  - **벤치마크 gamebit조차 네임드·BJ 둘 다 "준비 중"**으로 비워둠(따라 할 실데이터 없음).
  - 수동 입력은 라이브에 검증 불가 stale 데이터 → 기각.
- **결정(사용자 승인)**: 빈 네임드 슬롯을 **치지직 인기 영상(조회수순)** 실데이터로 채움.
- 구현: `chzzk.ts fetchPopularVideos`(`search/videos`, `revalidate:300`, 조회수 내림차순 상위5, videoNo dedupe) + `chzzkVideoUrl`. 위젯에 영상 제목+조회수+영상 링크+"조회순·치지직" 서브.
  `data/rankings.ts`는 RankItem 타입만 남김(RANKINGS/getRankings 제거). i18n namedTitle "인기 영상" 등.
- 검증: typecheck/build 통과, 로컬(3212) 렌더 확인(메이플랜드 인기영상5+BJ5 실데이터). 4게임 영상 데이터 실측 정상.
- 결과: 랭킹 위젯 **양쪽 다 치지직 실데이터** → gamebit을 두 위젯 모두에서 앞섬.

### 18) 라이브 페이지 — 멀티플랫폼 인페이지 시청 (`db57b4c`, 배포·라이브)
- **동기**: gamebit `/live` 분석 → `/v2_get_bj_data.php`로 게임별 라이브 BJ 목록(유튜브+SOOP, **치지직 안 씀**)을 받아 사이트 안에서 플레이어+채팅 임베드. 우리 치지직 BJ 위젯은 이 게임들 시청자가 거의 없어(리니지 3명 vs 유튜브 688명) "비어 보임"이 문제였음.
- **핵심 인사이트**: 임베드(플레이어/채팅)는 무료 iframe(쿼터 무관). 쿼터는 "발견"에만. SOOP·치지직은 발견도 키리스 → 유튜브 빼면 키 0.
- 구현: `lib/live.ts`(치지직 search/lives + SOOP liveSearch + 유튜브 Data API 또는 스크래핑 폴백, 임베드 URL), `LivePlayer.tsx`(client, 플레이어+채팅+목록 전환), `/[locale]/live/[game]` 페이지(+`/live` redirect), Header "● 라이브" nav + data/live 토글, chzzk.ts thumbnail, sitemap, i18n.
- **유튜브 스크래핑 디버깅**(node OK·서버 0): lazy 정규식 절단→중괄호 균형 파서, videoRenderer/lockupViewModel A/B→SOCS consent 쿠키, 라이브 감지 확대. 근본책은 `GAMETICK_YT_API_KEY`(Data API). `embed_domain`은 headers() host로(hydration).
- 검증: tsc/build, 로컬·프로덕션 3플랫폼 렌더(리니지 유튜브 쌈용 664 / 메이플·아이온 SOOP·치지직 다수), 채팅 embed_domain=gamesise.co.kr.
- **남은 튜닝**: 라이브 키워드가 `chzzkKeyword ?? nameKo` 공용 → 플랫폼별 최적 아님. 게임/플랫폼별 `liveKeyword` 분리 여지.

### 19) 게임 페이지 BJ 위젯 멀티플랫폼화 (`7214783`, 배포·라이브)
- 치지직 단독이라 "비어 보이던" 게임 페이지 BJ 위젯을 `fetchAllLives` 상위5(치지직+SOOP+유튜브 통합·시청자순)로 교체. `RankItem.platform` + Y/S/C 배지, 랭킹 섹션에 "● 라이브 →" 전체보기 링크, `bjLive` 서브타이틀 3사 표기.
- 검증: 로컬·프로덕션(리니지=유튜브 강세, 배지·외부링크·라이브링크 정상). 참고: 게임 페이지에도 유튜브 스크래핑이 매 로드(캐시 180s)에 걸림.

### 20) 유튜브 라이브 안정화 (`2aaefc8`, 배포·라이브)
- **측정**: SOCS consent 쿠키 적용 후 스크래퍼 6/6 안정(매번 videoRenderer 20, lockup 0). 데스크톱 UA에선 신형 lockupViewModel 미재현(쿠키 없이도 videoRenderer). 즉 이전 서버 0건은 lazy 정규식 절단·ytInitialData 오선택 버그였고 SOCS+균형파서로 해결됨.
- **구조 변경**: `fetchYoutubeLives` = 스크래핑 1순위 → 빈 배열일 때만 `GAMETICK_YT_API_KEY` 있으면 Data API 폴백. 평소 쿼터 0, 폴백 캐시 15분.
  - 이유: Data API 무료 1만 유닛/일·search=100유닛이라 14게임 3분캐시면 쿼터 폭발 → 폴백 전용이 정답.
- 검증: 로컬·프로덕션 유튜브 11건 등 정상(배포 직후 콜드 첫 요청만 빈 상태, 워밍업 후 정상).

### 21) 라이브 키워드 튜닝 + 관련성 필터 (`0a8f4a7`, 배포·라이브)
- **문제**: 라이브/BJ 위젯에 타게임 혼입. SOOP는 매물 적으면 인기 무관 방송 끼워넣음(솔인챈트·로드나인에 리니지 366명 1위), chzzk/youtube도 부분일치로 섞임("클래식"→조선협객전, "메이플"→본가, "아이온"→아이온2).
- **해결**: `games.ts`에 `liveKeywords`(플랫폼별 검색어)·`liveMatch`(포함 토큰)·`liveExclude`(제외 토큰) + `liveQuery()` 리졸버. `live.ts fetchAllLives(LiveQuery)`가 제목 정규화 후 전 플랫폼에 include/exclude 적용(풀20→필터→정렬→슬라이스).
- 튜닝: 아이온/아이온2 분리, 리니지 클래식/M/2M exclude 분리, 메이플=서브게임명 매칭+본가 제외, 나이트크로우 약어 "나크".
- **남은 한계**: 이름 포함관계(아이온2를 "아이온"으로만 표기 등)는 완전 분리 불가 — 감수.
- 검증: 로컬·프로덕션에서 솔인챈트·리니지클래식 누수 제거, 아이온 분리 확인.

### 22) #5 멀티거래소 Phase 1 — 바로템+아이템베이 (gametick `ed91823` / lc_vn `fb8763e`, 배포·라이브)
- **정찰**: 아이템베이 시세 API keyless 확인 — `getRealTimeMarket?iGameServerSeq=`(최저가·시장가) + `market-info`(단위). 서버명이 우리와 동일 → 이름 매핑. (아이템매니아=`gamemoney_servers.xml.php?gamecode=` 게임당 1콜 XML, 땡스아이템=매물 파싱 필요 — Phase 2/3용으로 확인해둠)
- **구조**: 거래소 "부품" 방식. 수집은 lc_vn 단일 수집기에 추가(A 방식 유지), 거래소별 파일 분리(`history-{game}-itembay.json`), gametick은 읽어서 최저가/스프레드 계산.
- **lc_vn**: `history.ts` exchange 인자 일반화 + `itembay.ts`(collectItembay, 클래식 매핑 내장, 단위 정규화, 150ms 딜레이·게임당 주기 게이트) + instrumentation 훅(try-catch 격리).
- **gametick**: `exchanges.ts` itembay active, `market.ts` 멀티거래소 계산(quotes/lowest/spreadPercent), `MarketTable` 최저가+거래소칩(최저=앰버).
- **검증**: 서버 수집기가 `history-lineage-classic-itembay.json` 생성(23/29서버), 라이브 22/29 멀티거래소. 서버마다 최저 거래소 다름(데포로쥬 베이1220<바로템1300, 이실로테 바로템1100<베이1180). ✅ "진짜 최저가" 구현.

### 23) #5 Phase 2/3 시도 → 아이템매니아·땡스 VPS 차단으로 보류 (gametick `27a5688` / lc_vn `317d16f`,`b77bed3`)
- **정찰 성공**: 아이템매니아 = 시세 XML `_xml/gamemoney_servers.xml.php?gamecode=`(게임당 1콜 전서버, 단가=price/multiple, 클래식 5913, 서버명 매핑). `itemmania.ts` 작성·로컬 검증(27/29, 데포로쥬 1410/하딘 949). 땡스 = EUC-KR 매물목록+총액(수량 범위)→단가 불안정.
- ⛔ **그러나 둘 다 말레이시아 VPS에서 한국 외 차단**: 매니아=연결 타임아웃(134s), 땡스=403. 로컬(KR)만 됨 → 현재 서버 수집 불가.
- **부작용 수정(중요)**: 무타임아웃 매니아 fetch가 instrumentation tick을 134초 행시킴(바로템/베이 수집 지연) → `AbortSignal.timeout(8s)` 추가 + 매니아 훅 제거. lc_vn 재배포로 복구(베이 87s전 갱신 확인).
- **결론**: 현재 가용 멀티거래소 = 바로템+아이템베이(라이브 22/29). 매니아 코드는 보존(KR 수집기 확보 시 부활). 라이브 검증: 활성 거래소=바로템·아이템베이만 표시.

### 24) 아이템베이 확대 — 아이온2 추가 (lc_vn `73180da`, 라이브)
- 아이온2(itembay game-3603) 44서버 매핑(이름 정규화로 ()↔[] 자동 매칭 44/44). 단위 base=백만→천만 factor 10. 라이브 25/44 멀티거래소(카이시넬 바로템8500/베이8800, 유스티엘 8000/9400). gametick 무수정(자동 반영).
- **추가 안 되는 게임 확인**: 리니지M(2583)·2M(3429)=아이템베이 통합거래소 단일(서버별 없음), 메이플월드(4047)·나크(3954)=시세 데이터 없음. → 바로템만.
- ⚠️ 정찰 중 아이템베이 레이트리밋(code -1) 겪음 — API 연타 금지(딜레이 필수). 수집기는 150ms+300s라 안전.

### 25) 서버 상세 거래소별 시세 비교 오버레이 (`b18bfe3`, 라이브)
- 한 서버의 거래소별 가격 추이를 한 차트에 겹쳐 그림(선 간격=스프레드). PLAN.md 차별점.
- `market.getServerExchangeSeries`(활성 거래소별 7d 시계열, 데이터 있는 곳만), `ExchangeOverlay.tsx`(멀티라인 SVG+범례, 1포인트는 점). 거래소 2곳+ 일 때만 표시.
- 라이브 검증: 데포로쥬 상세에 바로템(빨강)+아이템베이(파랑) 선 2개+범례. (기존 데이터 재활용, 신규 수집 없음)

### 26) #7 텔레그램 가격 알림 (lc_vn `3c4eea5` / gametick `e232f48`, 라이브)
- 무료 텔레그램 Bot API. 봇 @gamesise_alert_bot(토큰=lc_vn 서버 .env.local). VPS→telegram OK.
- lc_vn `telegram.ts`: alerts.json 구독 + getUpdates 폴러(/start 딥링크, /list/clear) + checkAlerts(tick, 최저가 비교·발송·재무장). gametick `TelegramAlert.tsx`: 서버상세 딥링크 버튼.
- 폴러 생존 확인: 외부 getUpdates→409 Conflict(정상). 봇 명령어/설명 setMyCommands로 설정.
- 검증: 빌드·배포·버튼 렌더·폴러 409 확인. **✅ E2E 성공**(사용자 봇 [시작]→알림 수신 확인, 2026-06-30).

### 27) #7 디스코드 알림 추가 (lc_vn `60c51c3` / gametick `2516084`, 라이브)
- 웹훅 방식(폴러 불필요). `AlertSub.webhook` + `sendDiscord`/`notify`/`addDiscordSub` + lc_vn `POST /api/alert`. gametick `DiscordAlert.tsx`(웹훅URL+기준가) → `/api/discord-alert` 프록시가 lc_vn(127.0.0.1:3001)로 서버측 전달(CORS 없음). alerts.json 단일 writer=lc_vn.
- 검증: 버튼 렌더 + 프록시→lc_vn→검증에러 반환(체인 정상). **✅ 실제 웹훅 수신 확인 완료**(사용자, 2026-06-30).
- → #7 알림 3종(브라우저·텔레그램·디스코드) 전부 E2E 완료.

### 28) OG 공유 썸네일 (`dad0251`, 라이브)
- 카톡/디스코드/SNS 링크 공유 카드 이미지. 루트 `opengraph-image.tsx`(전 페이지 기본). `next/og` ImageResponse + Black Han Sans 한글 woff(287KB 번들). 다크+빨강 "게임시세"+태그라인+기능칩.
- **교훈**: satori(ImageResponse)는 한글 폰트 필수(시스템 폰트 없음), **ttf/otf/woff만**(woff2 X). 폰트는 @fontsource jsDelivr woff로 확보. 구형 UA Google Fonts는 EOT/라틴만 줌(주의).
- 검증: 로컬·라이브 PNG 1200×630, og:image 메타 적용.

### 29) 수집 주기 게임별 차등 (lc_vn `1f1db72`)
- `GameInfo.refreshSeconds` 추가. 리니지클래식·아이온2 = 180초(3분), 나머지 300초(5분) 유지. barotem cacheSeconds·itembay 게이트에 적용. 주기 단축은 무료(설정)지만 거래소 차단위험 trade-off라 인기 2종만.

### 30) 아이템매니아 부활 — 한국 Vultr 프록시 경유 (lc_vn `1ebf919` / gametick `44fefb8`, 라이브)
- 매니아는 한국 외 차단 → 한국 Vultr(서울 `158.247.239.183`)에 tinyproxy(8888, ufw로 말레이시아만 허용) 설치. lc_vn `itemmania.ts`가 undici ProxyAgent로 그 fetch만 경유(`KR_PROXY_URL` env). 미설정 시 skip.
- 설정은 말레이시아 VPS에서 sshpass 경유로 KR박스 구성(내 환경엔 비번 SSH 도구 없음). KR박스 매니아 200·땡스 403(데이터센터 WAF, 보류).
- 라이브: 클래식 27/27 매니아 수집 → 3거래소(바로템·베이·매니아) 24서버. (데포로쥬 베이1220/바로템1319/매니아1410)
- 비용: Vultr 월 ~$5(끄면 매니아만 중단). 확장: itemmania.ts ITEMMANIA에 게임별 gamecode 추가(현재 클래식만).

### 31) 아이템매니아 아이온2 추가 (lc_vn `8e8f5e4`, 라이브)
- 아이온2(매니아 gamecode 5799) 추가 → 아이온2도 3거래소(바로템·베이·매니아) 42/42 수집. 서버명 동일·정규화 OK.
- **솔인챈트 불가**: 매니아 시세 `na`(미제공), 아이템베이도 `bMarketIsRunning:false`(시세 미운영). 신생 게임이라 바로템만 → 멀티거래소 대상 아님.
- **현재 멀티거래소 게임**: 리니지클래식·아이온2(3거래소). 다른 게임은 거래소들이 시세 피드를 안 만들어 확장 한계.

### 32) 시세표 "다음 갱신" 카운트다운 (`eb7ce1a`, 라이브)
- 게임별 수집 주기(games.ts refreshSeconds, 클래식·아이온2 3분/나머지 5분) 기준 "다음 갱신 m:ss" 1초 카운트다운. updatedAt+interval 지나면 "갱신 중". MarketTable 내 분리 컴포넌트(UpdateCountdown)로 그것만 리렌더.
- 라이브 확인: "다음 갱신 2:50" 등 정상(검증 시 카운트다운 숫자가 태그로 쪼개져 grep 주의).

## 2026-07-02 — SEO / 검색엔진 색인 등록 (세션)

### 33) 구글·네이버 서치콘솔 등록 + 색인 준비
- **진단**: `site:gamesise.co.kr` 결과 0개 → 구글 미색인. 원인은 코드가 아니라 **신규 도메인(이틀 전 라이브) + 서치콘솔 미등록**. 기술 SEO는 정상(robots Allow, sitemap 576 URL 200, title O, noindex 없음, `/`→`/ko` 307, 게임페이지 canonical O).
- **네이버 서치어드바이저**: 소유확인 = **메타태그**(`layout.tsx` metadata.verification.other `naver-site-verification`, 커밋 `3e6a45e` 배포). 사이트맵 제출 완료. robots.txt "없음" 표시는 **네이버 Yeti 미방문(신규)** 탓 — robots는 200·text/plain·Yeti 200 정상 확인, 수집되면 채워짐.
- **구글 서치콘솔**: 소유확인 = **DNS TXT**(`google-site-verification=cIEw5v1aglRSrVpxB2Zb2u_yNjOu4ImQ2iG7gqDZdZ0`, 구글/CF DNS 전파 확인 → 코드 불필요). 사이트맵 제출 완료. 도메인 속성이라 전 서브도메인 커버.
- **URL 색인요청(구글)/웹페이지 수집(네이버)**: 대표 페이지(홈·리니지클래식·아이온2·메이플·리니지M·report·guide) 수동 요청 = 색인 가속(하루 ~10개 할당).
- **.com → .co.kr 301 확인**: `gamesise.com`/`www`/`http`/경로 전부 301 → `gamesise.co.kr`(경로 보존). 정식 도메인 = **gamesise.co.kr**로 일원화. 서치콘솔은 .co.kr만 등록하면 됨.
- 결론: 등록 완료, **실제 노출까지 며칠~2주 대기**(신규 도메인 정상). 코드 변경 없음(네이버 메타만).

---

## 📌 세션 요약 (2026-06-30 ~ 07-01) — #16~#32

이번 세션에 **차별 기능 대부분이 라이브**가 됨. 핵심 결과:
- **라이브 탭**(`/live/[game]`): 치지직+SOOP+유튜브 인페이지 시청(플레이어+채팅 임베드, 키리스). 유튜브는 스크래핑(SOCS 쿠키)+Data API 폴백. 게임/플랫폼별 키워드+관련성 필터(`liveMatch`/`liveExclude`).
- **인기영상 위젯**: 네임드(빈 큐레이션)를 치지직 인기영상으로 대체. BJ 위젯도 멀티플랫폼화.
- **멀티거래소**(핵심 차별점): 바로템+아이템베이+**아이템매니아**(한국 Vultr 프록시 경유) 통합 — **리니지클래식·아이온2 = 3거래소**. 시세표 최저가+거래소칩+스프레드, 서버상세 **거래소 비교 오버레이**.
- **가격 알림**(#7): **텔레그램**(봇 @gamesise_alert_bot) + **디스코드**(웹훅) 둘 다 E2E 확인. 백엔드는 lc_vn.
- **OG 공유 썸네일**, **다음 갱신 카운트다운**, **게임별 수집주기 차등**(클래식·아이온2 3분).

상세는 위 #16~#32 + MEMORY.md §6 박스 참고.

## 2026-07-02~03 — 대규모 UX·SEO·i18n·수익화 세션

### SEO / 검색엔진 (신규)
- 네이버 서치어드바이저(메타 소유확인)+사이트맵, 구글 서치콘솔(DNS TXT)+사이트맵 등록 완료(색인 대기).
- **구조화 데이터(JSON-LD)**: 게임=FAQPage, 게임·서버·가이드=BreadcrumbList, 루트 layout=Organization+WebSite. (`components/JsonLd.tsx`의 `JsonLd`/`breadcrumbLd`/`SITE`)
- **가이드 확장**: 게임 정보 총정리 `/guide/game-info`(`data/gamemeta.ts`+`GameInfoTable`, 출처 나무위키) · 게임별 시세 가이드 14편 `/guide/price-{game}`(게임×통화 키워드, ×4언어=56p, 하단 실시간시세 CTA) · 공통 FAQ `/guide/faq`(`generalFaq`)+푸터 링크. **FAQ는 게임 페이지에서 제거**(56p 중복 정리, JSON-LD는 faq 페이지로).

### i18n — 영어·중국어 추가 (ko/en/zh/vi)
- `i18n/config.ts` 로케일 4종. `dictionaries.ts` en/zh 전체 UI. `content.ts`(소개·FAQ)·`guides.ts`·`legal.ts` en/zh. `exchange.ts` 보조통화(en=$, zh=¥, +cny). `format.ts` **언어별 시간대**(ko KST·zh UTC+8·vi UTC+7·en UTC, GMT±N 표기) + 시각 KST 고정(서버가 UTC라 9h 어긋나던 것 수정).
- **통화 영문화**: `games.ts` `currencyOf`(아데나→Adena·키나→Kinah·메소→Meso·다이아→Dia)·`gameNameOf`. 제목·단위·H1·메타에 적용.
- 언어 스위처 `LangSwitch`(드롭다운·국기+원어명). 브랜드는 고유명사라 전 언어 **"GameSise"**(로고 고정, ZH 번역 원복).

### UI / UX
- **라이트/다크 테마 토글**(☀️/🌙, 즐겨찾기 옆): `html.light`에서 zinc CSS변수 반전(globals.css) → 컴포넌트 수정 없이 전체 전환. `ThemeToggle`+layout 선적용 스크립트. `.themed-scroll`.
- **게임 메뉴 `GameNav`**: 기본 1줄+"더보기"(PC·모바일), **선택 게임 맨 앞 고정**(URL+localStorage `gamesise:primaryGame`).
- **시세표 `MarketTable`**: 정렬 기본 현재가 desc+헤더 클릭 토글(현재가·등락·매물). **급등/급락=서버명 옆** (급등)빨강·(급락)파랑(rows에서 max/min 계산). 요약카드→작은 텍스트, 게임명 삭제(sr-only h1), 단위 폰트↑, 데이터출처 줄바꿈, 업데이트 시각을 실시간 옆으로 이동.
- **라이브 메뉴** 강조(빨간 알약+ping 점). 모바일 가로넘침 방지(html·body `overflow-x-clip`), 매물·추이 열 모바일 숨김, 매니아 칩 "~" 표기.
- **거래 카드 탭화 `TradeFeed`**(gamebit 참고, 클라이언트화): ①서버 거래량(전 서버 메달 랭킹·스크롤) ②최근 거래완료(서버수만큼). 수량 파싱 `parseQty`.
- **차트 `CandleChart`**: 가격축(Y)·날짜축(X, KST) 라벨 추가. ※이벤트 마커·크로스헤어 툴팁은 미구현(자체 SVG라 라이브러리 없음).

### 수익화 / 브랜딩
- **파비콘 GS 로고**: `app/icon.png`(512)·`apple-icon.png`(180)·`favicon.ico`(48). sharp로 정사각 크롭. ※Next ICO 디코더는 **내부 PNG가 RGBA**여야 함(`ensureAlpha`).
- **광고 배너**: `public/ads/boost-ad.jpg`(대리육성) 사이드 슬롯에 `next/image`+`rel=sponsored`(→gameboostforge). 푸터 자사 CTA 박스(매입·대리육성 버튼) 제거.

### 🔴 데이터 정합성 수정 (중요·교훈)
- **솔인챈트 단위 오류 수정**: 만(10,000)→**천(1,000)**. 바로템 실단위가 "천당"인데 설정만 10,000이라 표시가 10배 틀림. gametick `games.ts` unitAmount + lc_vn `site.ts fallbackUnit` **양쪽** 수정. **전 14게임 바로템 실단위 대조 완료**(나머지 정상: 나크·RF는 만당 맞음).
- 교훈: **바로템은 단위를 원시 저장(정규화 안 함)** → gametick `unitAmount`는 반드시 바로템 실단위와 일치해야 함. 검증법: 바로템 productTable `rows[0].unit_price`의 "천당/만당" 확인(헤더 `X-Requested-With: XMLHttpRequest`+Referer 필요).

---

## 2026-07-11 — 차트 전면개편(lightweight-charts) + 데이터 노이즈 제거 + 거래소 비교 표 + 시세표 거래소 전환

> gamebit 실제 차트 코드/데이터(`v3_get_chart_data.php`)를 직접 대조하며 차트·거래소 UX를 대폭 개선. lc_vn 보관 7→90일, 바로템 수집단 노이즈 제거까지. **전부 배포·라이브.**

### A. 캔들차트: 자체 SVG → TradingView lightweight-charts (v4.2.3)
- `9df2040` SVG→lightweight-charts 전환 + 거래량(매물수) 바. `components/LightweightChart.tsx`(캔버스라 SSR불가 → useEffect 동적 import).
- `0747da4` 라이트/다크 반응형(MutationObserver로 `html.light` 감지) + 로케일.
- `e351637` 시간축 **로케일별 시간대**(ko/ja+9·zh/tl+8·vi/th+7·en UTC, 타임스탬프에 tz오프셋 더해 표시). 플레이스홀더 i18n(`dict.noData`/`chartLoading` 7언어).
- `efa7413` **크로스헤어 툴팁**(종가+매물수). v4는 `param.seriesData`(Map). ※gamebit은 거래량 툴팁만.
- `5fc20cc` 가격축 통화표기(ko=원/그외=₩), 시간축 `MM-DD HH:mm`(`timeFormatter`/`tickMarkFormatter`).
- `8f99fd0` lookback 확대(3분 6h→24h, 1시간 24h→7d) + 캔들 `priceFormat` + `autoscaleInfoProvider` 줌 버퍼.
- `d657788` **타임프레임별 기본 표시구간**(fitContent 대신 `setVisibleRange`, 3분=최근8h/1시간=최근24h). gamebit도 전체 안 보이고 최근만+스크롤 → 눈금 간격 정상화.
- `936ff3c` **3분봉 캔들 안 보임 수정**: 수집주기(3분)=버킷이라 캔들당 데이터 1개 → o=h=l=c 몸통0(안 보임). `candles.ts`에서 몸통0 비율>80%면 **선(line) 차트 자동 전환**(추세색=스파크 관례). + **MA 토글 버튼**.
- `7d861e2` MA 토글을 일봉 탭 오른쪽으로(`components/ChartPanel.tsx` 클라이언트, MA=controlled `showMa` prop).
- `ae82eed` 가격축 눈금 간격 **금액 자릿수 기반**(만원대=50/천원대=10/백원대=5/십원대=1, `priceFormat.minMove` 동적).
- `eb5b0ca` **MA 기본 OFF**.

### B. 데이터 노이즈(스파이크) 제거 — 표시단 + 수집단 근본책
- **원인**: 바로템 "최저가"에 순간 오등록 매물(1·2·160·200·766원 등)이 잡혀 차트 밑꼬리·가격축 폭발. **gamebit엔 없음**(오렌 07-05 09시 우리 160 vs gamebit 1561 → gamebit은 수집단에서 걸러냄).
- `4690cbb` `candles.ts` **despike**(초기 median-5) + 1시간봉 기본 24h.
- `d82119d` despike를 **롤링 중앙값(Hampel식: ±10창 중앙값 대비 25%이탈만 대체)**으로 강화 → 3연속+ 클러스터 제거. 오렌 저가 160→1350.
- **수집단 근본책** lc_vn `da80a00`: `barotem.ts` **`robustLowest`** — `rows[0]`(절대최저) 대신 상위12 표본 중앙값 40%미만은 오등록 배제 후 첫 정상 최저가. **전 게임 적용**. 표본<3은 최저가 유지, 실제할인(40%+)은 보존.
- ⚠️ 아주 긴(>10점) 지속 이상치는 잔존 가능. 과거 저장분은 소급 불가(표시단 despike가 계속 처리). memory: `barotem-price-spikes`.

### C. 거래소 비교: 선그래프 → 표 (리니지클래식·아이온2)
- `3cbe955` `ExchangeOverlay`(SVG) **삭제** → **`ExchangeTable`**. 세로=시간, 가로=바로템·아이템매니아·아이템베이. 시간별 종가, **행별 최저가 앰버 강조**, despike 적용. `market.getServerExchangeTable`, `format.formatShort`, dict `time`(7언어).
- `276a5cc` 제목 오른쪽 **1시간/일간 탭**(3분 제외 — 베이·매니아 3~5분수집이라 빈칸多). `components/ExchangeTablePanel`(client) 전환, **서버 파일 1회 읽고 두 표 계산(부담0)**. 일간=KST자정 정렬, `format.formatDay`.

### D. 시세표(MarketTable) 거래소 선택
- `1d3b22d`/`48d88f6` 현재가 줄 작은 거래소 글씨(가독성↓) 제거 → 현재가 헤더에 **거래소 실제 로고 3개 토글**(바로템·매니아·베이). 클릭 시 현재가 컬럼·정렬이 그 거래소 기준, **기본 바로템**. 로고=`public/exchanges/*.png`(64px, 구글 파비콘). **서버 부담0**(`quotes` 이미 초기·라이브 전송 중, 전부 클라이언트). 헤더 한 줄 배치.

### E. lc_vn 보관 7→90일 (`fce328d` + gametick `8aaf031`)
- `history.ts MAX_AGE_MS` 7→90일(일봉 장기데이터). gametick 일봉 lookback도 90d.
- ⚠️ **과거 소급 불가**(07-11부터 누적, 90일 다 차는 건 ~2026-10-09). 파일 증가(클래식 ~1.8→최대23MB) → 디스크/RAM 모니터링. memory: `lc_vn-retention-90d`.

### 교훈
- **lightweight-charts v4**: `addCandlestickSeries`/`addLineSeries`(v5는 `addSeries`), 크로스헤어 `param.seriesData`(Map, v3는 `seriesPrices`), `minMove`는 **눈금 간격 하한만**(실제 간격은 보이는 가격범위로 자동) → 촘촘한 눈금은 **좁은 뷰**가 전제.
- **gamebit도 `lightweight-charts@3.8.0`** 사용, fitContent+최근만+스크롤 로드. 보유 데이터 min14일/hour60일/day60일. gamebit 3분봉 캔들이 보이는 건 3분내 가격변동 데이터가 있어서(우리는 3분수집=버킷이라 선차트가 맞음).
- **노이즈**: 단발 스파이크=median, **지속 클러스터=median 무력** → 롤링중앙값+상대임계. 근본은 수집단.
- **아이템베이 빈칸**(예 이실로테): `getRealTimeMarket` `code:-1`(그 서버 매물 없음). 버그 아님, 서버별 매물 유무 차이(클래식 18/29만 베이 시세 있음).

---

## 2026-07-11 (이어서) — 14게임 시세 복구 · 이벤트마커 · 문의시스템 · 관리자 허브

> 같은 날 후반 세션. 전 사이트 점검 + 빈 게임 복구 + 신규 기능(이벤트 마커·문의 쪽지)·관리자 허브. 전부 배포·라이브.

### F. 레이븐2·아이온 시세 복구 (14게임 전부 시세 나옴) — lc_vn `1762c56`~`ea70559`
- **원인**: 두 게임은 바로템이 `unit_price`("만당 N원") 없이 **`baro_price`(총액)+`unitExcut`(수량)**로만 응답 → 파서 null → 시세 0건이었음.
- `barotem.ts robustLowestByBaro`: `baro_price/unitExcut × fallbackUnit`(검증: 리니지클래식과 정확 일치). 아이온은 셀러가 수량을 만/억(큐나) 단위로 제각각 기입해 폭발 → ①`unitExcut<1000` 오기입 제외 ②**크로스서버 안전망**(게임 중앙값 8배 초과 서버 null).
- 결과: 레이븐2 15/16(3,500~6,750원/천), 아이온 5/7(2,800~3,300원/천만). memory: [[barotem-price-spikes]].
- 부분 커버리지(메이플 3/8 등)는 **진짜 매물 없음**(count>0인데 null=0 확인, 파싱 문제 아님).

### G. 차트 이벤트 마커 (gamebit식 setMarkers) — lc_vn `c10329b` / gametick `f5af82d`
- 관리자가 lc_vn `/admin/events`에서 등록(`data/chart-events.json`) → gametick이 읽어 캔들 위 핀(제목·색·위치·모양). **서버별 + 게임전체(server="*")**. 각 이벤트를 가장 가까운 캔들에 매핑, 표시범위 밖 제외.

### H. 광고/제휴 문의 쪽지 시스템 — lc_vn `d39ec3c` / gametick `c62d820`
- 푸터 mailto → **`/[locale]/contact` 폼**(제목·내용 + Telegram·KakaoTalk·Zalo·WeChat 아이디). gametick `/api/inquiry` 프록시(discord-alert 패턴) → lc_vn `inquiries.json`. 관리자 `/admin/inquiries`에서 조회·**확인완료 토글**·삭제. contact 페이지 noindex.

### I. 관리자 허브 (AdminNav) — lc_vn `e5dfa48`~`8c29898`
- 관리자 3페이지(할인율·이벤트·문의) 공유 **sticky 상단 네비**. `[gmhm365·할인율][차트 이벤트 마커][문의 쪽지 🔴미확인배지]`. 클릭해도 목적지에 같은 네비 있어 고정. 현재 페이지 앰버. 세션 키(`lc_vn_admin_key`) 공유. memory: [[admin-pages]].
- `/admin` 제목 '관리자 설정'→'관리자', 할인율 설명 줄 삭제.

### J. 기타 (gametick)
- **og:image/twitter:image 명시**(`0fe3318`) — 루트 layout + openGraph 오버라이드 3페이지. 카톡/메신저 미리보기가 광고배너(boost-ad.jpg) 대신 **브랜드 OG 카드**를 쓰도록. (원인: og:image 메타 부재 → 스크래퍼가 페이지 최대 이미지 주움)
- **시세 계산기**(`624eefb`): 수량 입력 천단위 쉼표(기본 1,000,000), VND 하드코딩→`secondaryCurrency`(원화 + 언어별 현지통화).
- **차트 보조통화 옵션**(`dc05a52`): 원화 유지 + 통화기호 토글(vi₫·en$·ja/zh¥·th฿·tl₱, ko숨김)로 툴팁에 현지통화 병기. 환율은 기존 getRates(1h캐시) 재사용.
- 거래소 표 탭 i18n(`0485bf8`), **평균 시세 추이(트렌드) 섹션 제거**(`3a75ca7`, 차트라 SEO영향 없음), 푸터 정리(문의 링크 약관 옆 이동·앰버 옅게·관리자 허브 링크).

### K. 마무리 UX (gametick)
- **미확인 문의 점 알림**(`3ed2669`): 메인 푸터 "관리자" 옆에, 미확인 문의 있으면 **빨간 점만**(숫자 없음). gametick이 `GAMETICK_DATA_DIR`로 lc_vn `inquiries.json` 직접 읽어(`lib/inquiries.ts hasUnreadInquiry`, 30s 캐시) 판단 → **Footer async화**. 확인완료/삭제 시 사라짐.
- **랭킹/BJ 위젯 모바일 오버플로우 수정**(`afe4385`,`5b1c585`): `Rankings.RankRow` 중첩 flex 평탄화 + **이름 span에 `min-w-0`**(flex 자식 기본 min-width:auto라 긴 영상제목이 truncate 안 되고 박스를 밀던 문제) + 박스 `overflow-hidden`. 교훈: **truncate는 flex 자식에 min-w-0 없으면 무력**.

### 사이트 점검 결과
- ✅ 전 라우트·14게임·서버 200. 4앱 online, 디스크 19%, 메모리 여유(752MB). 수집 2~3분 신선, 거래소·KR프록시 작동.
- ✅ SEO 기술 정상(sitemap 2,128 URL·robots·canonical). **색인 수는 서치콘솔 확인 필요**(로그인 요).
- ⚠️ 90일 보관 파일 증가 중(아이온2 2.9MB) → 몇 주 뒤 메모리 재점검.

---

## 2026-07-12 — 모바일 오버플로우 · 다국어 SEO(hreflang)

> 모바일 레이아웃 점검 + 다국어 SEO 대폭 보강. 전부 배포·라이브.

### 모바일 오버플로우 전수 점검 (`c90c9fb`)
- 코드 전반 스캔(테이블·고정폭·nowrap·flex). **시세표·즐겨찾기 테이블**만 `overflow-hidden`이라 현재가 헤더 거래소 로고 추가 후 좁은 화면서 컬럼 잘림 → **`overflow-x-auto`(가로 스크롤)** + `min-w-340px`. 나머지(TradeFeed·LivePlayer·GameNav·Header 등)는 이미 `min-w-0`/`truncate`/스크롤 처리로 안전.

### 다국어 SEO — hreflang + lastmod (`d324dc7`)
- **최대 격차였던 hreflang 부재 해결**. `lib/seo.ts altLanguages` → 게임·서버 페이지 metadata `alternates.languages`(7언어+x-default). **sitemap** 전 2,128 URL에 `alternates.languages`(hreflang **17,024개**) + `lastModified`. 구글이 ko/en/zh/vi/ja/th/tl을 **중복 아닌 언어 대체**로 인식.

### 다국어 콘텐츠 SEO 교정 (`b07ee84`)
- **`currencyOf` vi도 로마자화**: 기존 `ko·vi 한글통화 유지`라 vi 페이지가 "아데나"(한글) → 이제 **`Adena`**(비한국어 검색자 키워드 매칭). ko만 한글, 나머지 6개 로마자.
- **`<html lang>` 로케일 교정**: 루트 layout이 `lang="ko"` 고정(locale 접근 불가 구조)이라, 인라인 스크립트로 URL 로케일 기준 교정. 언어 타깃팅 1차 신호는 서버렌더 hreflang, lang은 보조.
- **6개 외국어 전수 확인**: en/zh/ja/th/tl/vi 게임페이지 제목·설명·본문 전부 해당 언어로 정상 번역, 통화 `Adena` 통일, 한국어 누락 없음.

### 구글 색인 상태
- 서치콘솔 접근 불가(로그인). 미국 구글 `site:`엔 미노출(경쟁사 gamebit은 노출) — 신규 도메인 초기 정상 범위. **서치콘솔에서 색인 리포트·URL검사·사이트맵(hreflang·lastmod 추가로 재제출) 확인 필요**. SEO 기술 요소(sitemap·robots·canonical·JSON-LD·og:image·hreflang·lang)는 이제 전부 갖춤.

---

## 2026-07-12~13 — 색인예산 최적화 · SEO 텍스트 콘텐츠 · 방문자통계 · 안전거래 가이드 확장

> 전략 보고서(자문자답) 기반 P0/P1 실행. 색인 예산을 알짜 페이지에 집중 + 검색엔진이 읽는 텍스트 콘텐츠 확충. 전부 배포·라이브.

### 매물 없는 서버 자동 noindex + 사이트맵 제외 (`dd27de4`)
- **문제**: 매물 0인 빈 서버 페이지가 색인 예산 낭비 + 저품질 신호.
- 서버 metadata `robots: indexable ? undefined : { index:false, follow:true }` — `latestPrice(history, server.id) > 0` 기준. **sitemap도 동일 조건으로 제외**(2,128→2,079 URL). 링크는 유지(follow)라 내부 크롤 경로 보존.
- **데이터 기반·자동 복귀**: 매물이 생기면 다음 렌더에 자동으로 다시 색인·사이트맵 포함. 수동 관리 불필요.

### '오늘의 급등/급락' 텍스트 섹션 (`f4752d1`)
- 게임페이지에 `movers(table, 5)` 기반 **서버명·등락%·가격 텍스트** 섹션(상승/하락 2컬럼). 캔버스 마커와 달리 **검색엔진이 읽는 실텍스트** → SEO 유효. 서버명은 내부 링크(크롤 경로 + 사용자 이동).
- dict `moversTitle·moversNote·rise·fall` 7언어 번역.

### 안전거래 가이드 3→8 섹션 확장 (`81b74a6` ko · `ad8f84c` en·vi·zh)
- 기존 단문 → **8개 섹션**: ①적정가 확인 ②에스크로 정식거래소 ③판매자 평판·이력 ④선입금·장외유인 위험신호 ⑤소액·분할 첫거래 ⑥게임머니 특유 사기(회수·도용) ⑦거래 증거 보관 ⑧사고 대응 + GameSise 면책.
- ko/en/vi/zh 작성(ja/th/tl은 `guideList` en 폴백). **전부 원본 작성·번역**(저작권 무관). 프로덕션 h2 8개 렌더 확인.

### 방문자 통계(umami) — 운영 (lc_vn `AdminNav`)
- gamesise가 umami에 미집계 → DB에 웹사이트 생성(id `2ea27e0e…`) + `NEXT_PUBLIC_UMAMI_SRC/ID` env 인라인 후 재빌드. 관리자 네비에 **"방문자 통계 ↗"**(stats.gameboostforge.com) 박스 추가.
- umami 관리자 비번 분실 → `"user"` 테이블 password를 bcrypt 재해시로 리셋(SSH heredoc + `psql -f` 임시SQL로 인용 이슈 우회).

### 홈페이지 색인 문제 해결 — 리디렉션 → 실제 허브 (`b08ef50`)
- **서치콘솔 진단**: `/ko` URL 검사에서 **"리디렉션이 포함된 페이지"로 색인 제외**, 색인된 페이지 0개. 원인 = `[locale]/page.tsx`가 `/[locale]` → `/[locale]/기본게임`으로 `redirect()`. 즉 `gamesise.co.kr → /ko → /ko/lineage-classic` 이중 튕김으로 **대표 홈페이지가 통째로 색인 불가**(사이트맵 priority-1 URL들이 전부 리디렉션).
- **해결**: `/[locale]`을 **전 게임 시세 카드 허브**(게임명·평균가·최저가·활성서버수, 시세순 정렬)로 렌더 — redirect 제거, 200 실페이지. WebSite JSON-LD + self-canonical + hreflang(빈 세그먼트) + `homeAbout` SEO 문단. `homeHeadline/homeLead/homeGamesTitle/homeAbout` 7언어 추가.
- 개별 게임/서버 페이지와 콘텐츠가 달라 중복색인 없음. 검증: `/ko`·`/en` **200**, canonical=자기자신, 루트 `/`→`/ko` 단일 리디렉션.
- **후속(운영)**: 서치콘솔에서 `/ko` 등 대표 URL **색인 재요청** + 며칠 뒤 "리디렉션 포함" 제외가 사라지는지 확인.

### 홈 허브 후속 + 외국어 서버명 로마자화 (`3b45978`~`e78ce48`)
- **홈 카드 개선**: 게임별 **최소 거래단위+통화**(예: `10,000 아데나`·`1,000 다이아`) 칩 + **평균가·최저가 현지통화 환산**(secondaryCurrency) 병기.
- **시세표 현지통화**: MarketTable에 `rates` prop → 서버별 현재가 아래 현지통화(선택 거래소 기준). 이제 홈·시세표·상세·계산기 전부 일관.
- **외국어 페이지 서버명 한글 → 로마자**(외국인 SEO 핵심): 렌더가 로케일 무관 `nameKo`만 쓰던 문제. 로마자 없던 **서버명 164개 로마자화**(도시=Gangneung/Gyeongju…, 리니지 공식명=Talking Island·Bartz·Gludio…, 나머지 개정로마자). `localizedName/serverNameOf` 헬퍼(한글 폴백). 적용면: 서버상세(title·h1·breadcrumb·소개·alert)·시세표·급등락·거래피드·즐겨찾기·리포트·게임내비·라이브. `ReportServer/GameReport`에 nameEn 추가. 검증: `/en/vampir/20553` title "Olga", 시세표 Oren/Deporoju… 한글 잔존 0.

### SEO 성장전략 보고서 + P0-① 서버 페이지 강화 (`13380b7`)
- **딥 분석 보고서**(아티팩트): 기술감사+웹조사 10건. 핵심 결론 = "가진 데이터를 검색가능 콘텐츠로". P0(서버페이지 두껍게·날짜별리포트·Product스키마)/P1(게임FAQ·신작선점·현금화가이드)/P2(외국어·계산기). 경쟁사 백본="[서버]시세" 롱테일, adena.kr=날짜별 신선도, 아이온2 글로벌 H2가 외국어 최대기회.
- **P0-① 착수·완료**: 서버 251페이지의 얇은 템플릿(크롤됨-미색인 원인)을 고유 콘텐츠로. `serverStats`(history 재사용 순수함수, despike, 7일 최고·최저·평균·등락·매물수) + `serverFaq`(실시세 숫자 넣은 서버별 FAQ 3문항 7언어). 서버페이지에 '시세 통계' 카드 + FAQ 아코디언 + FAQPage 스키마. **검증: 단어수 452→810, 오렌 1,420원 vs 데포로쥬 1,039원(서버별 상이), FAQPage Q 3개, en "How much is Oren…" 로마자 정상.**

### SEO P0-② 날짜별 시세 리포트 아카이브 (`9dc5b98`)
- adena.kr 모델. 매일 고유 dated URL `/report/YYYY-MM-DD` → 크롤 신선도 신호. `getDailyReport`(그 날 KST 서버별 시가·종가·변동+게임별 평균가·급등락, despike), `lib/reportDates.ts`(KST 날짜 유틸). `/report/[date]` 신설(일별 카드+이전/다음/최신 네비+canonical·hreflang+Breadcrumb, 보관 90일 밖·미래는 notFound). `/report` 인덱스에 '지난 리포트' 14일 링크+hreflang. 사이트맵에 최근 14일 dated URL(lastmod=그 날). dict 5키 7언어. **검증: 200·canonical·평균가(857·7,919…)·날짜별 값 상이(07-12 -2.14% vs 07-10 +0.52%)·en·미래/무효 404.**
- **P0-③ Product/Offer 스키마: 보류 검토중** — 판매 없는 참고가 페이지에 Offer 마크업은 구글 가이드라인 위반(수동조치) 위험. 사용자 확인 후 결정.

### SEO P1-④ 게임 FAQ + P1-⑥ 정보성 가이드 확장 (`07d6753`·`eddb50e`)
- **P1-④**: 미사용이던 `faqItems()`를 14개 게임 페이지에 렌더 + FAQPage 스키마. 검증: 화면 summary 5 = Q마커 5 = 스키마 Question 5(표시=마크업, 규정준수), aion2 "per 10,000,000", 1200→1575단어.
- **P1-⑥**: 정보성 가이드 2종 신설(원본) — `cash-out`(현금화: 정의·정식거래소·정산액·시세확인·위험·세금/합법성·체크리스트·고지 8섹션), `exchange-guide`(거래소: 개념·주요3사·비교·에스크로·수수료·확인·고지). ko/en/vi/zh(ja/th/tl=en폴백). **ToS/법률 단정 회피·위험고지·전문가상담 권고**로 규정 안전. 검증: 4언어 200·제목 로컬라이즈·가이드목록/사이트맵 자동반영.

### 신규 게임 추가: 오딘: 발할라 라이징 (108서버, grouped 수집) (`4da7a7a` + lc_vn `d8f4d4d`)
- **점검**: 수집 14 = 표시 14(누락 없음). 단 바로템 인기 게임머니 10개 중 **오딘만 미표시** 발견 → 즉시 추가.
- **grouped 수집 신설(방식 B)**: 오딘 서버 108개(북유럽 12그룹×9)라 서버별 필터 108회 대신, **전체 매물 페이징(~14회) 후 서버명 그룹핑**. lc_vn `barotem.ts`에 `fetchAllRows`+`fetchGroupedQuotes`(robustLowest 재사용), `GameInfo.collectMode:"grouped"`, `fetchSnapshot` 분기. 매칭 키=서버 nameKo=바로템 server 필드.
- **양쪽 등록**: lc_vn site.ts(다이아·만·108서버·grouped) + gametick games.ts(동일 108서버, 로마자 nameEn). 빌드 게이트 후 pm2 reload.
- **검증**: history-odin.json 108/108 서버 시세 수집(18,966~70,000원). `/ko/odin` 200·시세표·홈카드, `/ko/odin/odin-03` 통계+FAQ 자동, `/en/odin` 로마자(Skadi 02…). **기존 P0/P1 기능 전부 신규 게임에 자동 적용 확인.**
- lc_vn 로컬 작업본: `C:\Users\User\lc_vn_work`(향후 수집기 편집용 클론).

---

## 다음 세션 할 일 (우선순위)

0. **(운영·모니터링) 색인 상태 확인** — 며칠 뒤 구글 서치콘솔 "색인 생성" 리포트 + `site:gamesise.co.kr`로 색인 페이지 수 증가 확인. 네이버 서치어드바이저 "검색 노출/수집" 현황도. 색인 지연/오류(예: 제외 사유) 있으면 대응. 대표 URL 색인요청 추가(하루 할당 재충전).
1. **(완료·차트) 차트 개편 완료**. ✅lightweight-charts 교체 ✅크로스헤어 툴팁 ✅선차트 자동전환 ✅금액축 자릿수눈금 ✅노이즈 despike ✅MA토글 ✅**이벤트 마커**(lc_vn `events.ts` + `/admin/events` 관리자 등록 → `ChartPanel setMarkers`). 남은 선택지: 급등락 자동 마커 UX(급락 캔들 강조).
4. **(완료·i18n) 7개 언어 지원** — ko/en/zh/vi/ja/th/tl 전부 등록(`a8d92bf`). 가이드 8섹션은 ko/en/vi/zh 번역, ja/th/tl은 en 폴백 — 필요 시 개별 번역 확장 가능.
5. **(수익화) 광고 배너 링크/확장** — 현재 배너 링크=gameboostforge(임시). 카카오 오픈챗 URL 받으면 교체. 슬롯 추가(시세표 위 리더보드 등)·실규격(300×250) 고려.
6. **(선택·정리) gametick→gamesise 리네이밍** — 레포/폴더/`GAMETICK_*` env. 리스크(배포경로·CI).
7. **(운영·주의) KR 프록시 모니터링** — Vultr `158.247.239.183`(tinyproxy:8888) 꺼지면 아이템매니아만 중단. 월 ~$5.
8. **(데이터·기회) 멀티거래소 확장** — 새 게임 거래소 등록 시 `itembay.ts`/`itemmania.ts`에 매핑 추가. (한계: 리니지M/2M=통합거래소, 신생=시세 미운영)
9. **(선택) 동적 OG**(게임/서버 카드) · **유튜브 Data API 키**(`GAMETICK_YT_API_KEY`, 라이브 결정성↑).

### ⚠️ 다음 세션 진입 전 확인
- 양쪽 레포 푸시 완료(gametick·lc_vn). 서버 라이브 정상.
- KR 프록시·텔레그램 토큰·KR_PROXY_URL은 **서버 `.env.local`에만**(깃 X). MEMORY §6 참고.
- 수집기 변경은 **lc_vn**(gmhm365 매입 라이브 사이트)이라 신중 + fetch엔 항상 timeout.
