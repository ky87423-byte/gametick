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

### 다음 세션 할 일
- [ ] (선택) 유튜브 폴백 강화하려면 `GAMETICK_YT_API_KEY`(Google Cloud, 무료) 발급해 서버 `.env.local`에 추가. 현재 스크래핑만으로 안정 동작 중이라 필수 아님.
- [ ] (선택) 게임별 `liveMatch` 추가 튜닝(누락/누수 발견 시).
- [ ] #5 멀티 거래소(아이템매니아/베이) · #7 텔레/디스코드 알림(봇 토큰 필요).
- [ ] 차트 누적 모니터링, (선택) gametick→gamesise 리네이밍.
