# 게임시세 (GameSise) 프로젝트 메모리

> 마지막 갱신: 2026-06-30 / 작업 일지: `docs/worklog.md` / 계획서: `PLAN.md`
> **세션 시작 시 이 파일부터 읽으세요.**

## 0. 한 줄 요약

한국 게임머니 **서버별 실시간 시세·차트·가격알림 플랫폼** (gamebit.co.kr 벤치마크, 더 좋게).
- 시세 자체는 수집하지 않고 **자매 프로젝트 lc_vn의 수집기가 쌓은 데이터를 공유해서 읽기만** 함(A 방식).
- 한국어(메인) + 베트남어(보조) i18n. 수익은 광고배너 + 자사 CTA(하이브리드).

## 1. ⚠️ 이름/경로 혼동 주의 (가장 먼저 알아야 할 것)

| 항목 | 값 |
| --- | --- |
| **브랜드(표시명)** | **게임시세** (ko) / **GameSise** (en·vi) |
| 도메인 | **gamesise.co.kr** (메인) + gamesise.com (등록 완료, 보유) |
| 로컬 코드 경로 | `C:\Users\User\gametick` ← **폴더명은 아직 `gametick`** |
| GitHub 레포 | `https://github.com/ky87423-byte/gametick` ← **레포명도 아직 `gametick`** |
| 서버 배포 경로 | `/var/www/gamesise` (PM2 이름도 `gamesise`) |
| 환경변수 prefix | `GAMETICK_DATA_DIR` ← 옛 이름 그대로 (코드 곳곳) |

→ **브랜드는 게임시세, 코드/레포/폴더/env는 gametick**. 리네이밍은 아직 안 함(선택 작업). 헷갈리지 말 것.

## 2. 아키텍처 (핵심)

- **스택**: Next.js 16.2.9 + React 19 + Tailwind v4 (lc_vn/lc_info와 동일).
- **데이터 (A 방식)**: 직접 거래소 폴링 안 함. lc_vn 수집기가 만든 `history-{game}[-{exchange}].json`을 `GAMETICK_DATA_DIR` 경로로 **읽기 전용** 접근.
  - 로컬: `C:\Users\User\lc_vn\data` / 서버: `/var/www/lc_vn/data`
  - 이유: 같은 VPS IP에서 거래소를 두 번 긁으면 차단 위험 → 수집기 1개만 둠.
  - **멀티거래소(Phase 1)**: 바로템=`history-{game}.json`(기본·시계열 기준), 아이템베이=`history-{game}-itembay.json`. 거래소 추가 시 파일만 늘어남. `market.ts`가 활성 거래소(`data/exchanges.ts`)를 다 읽어 서버별 **최저가/거래소칩/스프레드** 계산(등락·스파크·매물수는 바로템 기준 유지).
- **표시**: 시세 정보 사이트라 매입가/할인 없음. 시장가(원/단위) 그대로 표시.
- **시세 단위**: 아데나 만당 / 키나 천만당 / 메소 백만당 / 다이아 만당(미확정). `games.ts`의 `unitAmount`+`unitLabelKo`.
- **색상 관례(한국식)**: 상승=🔴빨강, 하락=🔵파랑 (`lib/format.ts`).

## 3. 배포 상태 (2026-06-30 완료)

VPS: **Shinjiru `111.90.148.135`**, SSH `ssh -i "$env:USERPROFILE\.ssh\lc_info_deploy" -o IdentitiesOnly=yes -p 20203 root@111.90.148.135`
(같은 서버에 lc_info:3000 / lc_vn:3001 / umami:3002 동거 중)

- [x] `/var/www/gamesise` 클론 + `npm ci` + `npm run build` 완료
- [x] **PM2 `gamesise` 포트 3003** 기동 + `pm2 save` (재부팅 생존)
- [x] **nginx** `/etc/nginx/conf.d/gamesise.conf` → `server_name gamesise.co.kr www.gamesise.co.kr` → `127.0.0.1:3003`
- [x] **스왑 1GB→2GB 증설** (`/swapfile2`, fstab 등록). 빌드 OOM 없음, 4앱 RAM 여유 1.0Gi 유지 → **합배포 RAM 우려 실측 통과**
- [x] 서버 `.env.local`: `GAMETICK_DATA_DIR=/var/www/lc_vn/data`, `NEXT_PUBLIC_SITE_URL=https://gamesise.co.kr`
- [x] 앱 정상(게임시세 렌더), nginx Host 라우팅 OK
- [x] **DNS gamesise.co.kr + www → 111.90.148.135** 전파 완료
- [x] **HTTPS 발급 완료** (certbot, 만료 2026-09-27, 자동갱신, HTTP→HTTPS 301) → **https://gamesise.co.kr 라이브**
- [x] **gamesise.com + www** A레코드 전파 + 인증서 4도메인 확장 + **.com → .co.kr 301 리다이렉트** 완료
- [x] **시세 데이터 복구** — 바로템 Referer 수정 배포(§4)로 실데이터 흐름. 현재가·매물수 표시됨, 차트/등락은 수집 누적에 따라 채워짐

**업데이트 절차**: `cd /var/www/gamesise && git pull && npm ci && npm run build && pm2 reload gamesise`

## 4. ✅ (해결됨) 바로템 API — Referer 헤더 요구로 변경됐던 것

- 증상: `productTable` API가 모든 파라미터에서 `{"code":0,"msg":"Undefined variable $common"}` 반환 → 수집 포인트 전부 null.
- **원인**: 바로템이 2026-06경 **Referer 헤더 검사**를 추가. UA/X-Requested-With만 보내던 lc_vn은 거부당함.
- **해결**: lc_vn `src/lib/barotem.ts` fetch에 `Referer: https://www.barotem.com/product/lists/{threadId}` 추가 (커밋 `c48b1f7`). 응답 형식(`rows[]`/`total`/`unit_price`)은 그대로 → 파서 무수정.
- 배포 완료(서버 lc_vn reload). lc_vn(gmhm365)·게임시세 **양쪽 데이터 복구 확인**(오렌 1,538원/102건).
- **교훈**: 바로템 비공식 API라 또 막힐 수 있음. 깨지면 응답 헤더 요구사항(Referer 등)부터 의심. 진단법: `curl`로 Referer 유무 비교.

## 5. DNS / HTTPS 상태 — 완료

- [x] **gamesise.co.kr + www + gamesise.com + www** 전부 A레코드 → 111.90.148.135.
- [x] 인증서 1장으로 4도메인 SAN 커버(`live/gamesise.co.kr/`), 자동갱신, 만료 2026-09-27.
- [x] **.co.kr → 앱(3003) 서빙 / .com → .co.kr 301 리다이렉트** (정식=.co.kr).
- nginx 설정은 내가 직접 작성(certbot --nginx 아님): `/etc/nginx/conf.d/gamesise.conf` = 3개 server 블록(:80 챌린지+리다이렉트 / :443 .co.kr 프록시 / :443 .com 301). 인증서 갱신은 webroot(`/var/www/html`).
- 로컬 사본: `C:\Users\User\gamesise.conf` (scp 원본).

## 6. 다음 작업 (우선순위)

> 인프라·데이터 파이프라인 완성(라이브 + 실데이터). 콘텐츠 보강 진행 중.

### gamebit 보강 (완료)
- 실시간 거래완료 피드(바로템 display=3 실데이터), 평균 추이 차트, 게임 소개·FAQ, 시세 계산기, 네임드/BJ 순위 위젯(데이터 비어 "준비중").

### 1~7 추천작업: ✅#1 SEO · ✅#2 리포트 · ✅#3 가이드 · ✅#4 게임확대 · ✅#6 약관/정책 / 남음:
- **#5 멀티 거래소**: 🟢**바로템+아이템베이 라이브**(리니지클래식 22/29, 아이온2 25/44). ⛔**아이템매니아·땡스는 VPS(말레이시아)에서 한국 외 차단** → 현재 인프라론 수집 불가(아래 §6 박스). 남은: 추가 게임 itembay 매핑(아래 주의) + 서버상세 거래소 오버레이 + (KR 수집기 확보 시) 매니아/땡스.
  - **아이템베이 게임 추가법**: 홈 JSON-LD/검색으로 `iGameSeq` 찾고 `game-{id}/type-3` 페이지의 `data-server-seq`↔서버명 추출 → 우리 nameKo와 **이름 정규화 매칭**(괄호/공백 제거), `itembay.ts ITEMBAY`에 추가. 단위는 `market-info` biBasePrice로 factor 정규화.
  - **추가 안 되는 게임**: 리니지M(2583)·리니지2M(3429)=아이템베이 "통합거래소" 단일(서버별 없음), 메이플월드(4047)·나이트크로우(3954)=아이템베이 시세 데이터 없음. → 바로템만.
  - ⚠️ **레이트리밋**: 아이템베이 API를 무딜레이로 연타하면 일시 차단(code -1). 정찰 스크립트는 딜레이 넣을 것. 수집기는 150ms 딜레이+300초 게이트라 안전.
- **#7 텔레그램/디스코드 알림**: 별도 워커(봇 토큰) 필요.

### ✅ #5 멀티거래소 Phase 1 — 바로템+아이템베이 (2026-06-30, gametick `ed91823` / lc_vn `fb8763e`)
- **아이템베이 시세 API(keyless)**: `GET itembay.com/item/api/sell/getRealTimeMarket?iGameServerSeq={seq}` → `{iMarkePrice, iLowestPrice}`. 단위: `/api/game/server/market-info?iGameSeq=&iGameServerSeq=` → `{biBasePrice, vcUnit}`. 서버명이 우리와 동일 → **이름으로 매핑**.
- **수집(lc_vn)**: `src/lib/itembay.ts`(부품 모듈, 매핑 내장: 클래식 iGameSeq=3828) → `collectItembay`가 서버별 최저가를 우리 단위로 정규화해 `history-{game}-itembay.json` 기록. instrumentation tick에 추가(게임당 priceRevalidateSeconds 주기, 서버 호출 150ms 딜레이, try-catch 격리). **lc_vn은 gmhm365 라이브 사이트라 변경 주의**.
- **계산/표시(gametick)**: `market.ts`가 최저가·스프레드 계산, 시세표에 최저가+거래소칩(최저=앰버). 라이브 검증: 22/29서버, 서버마다 최저 거래소 다름(데포로쥬 베이1220<바로템1300, 이실로테 바로템1100<베이1180).
- **다음 거래소 추가법**: `data/exchanges.ts`에 active=true, lc_vn에 `{exchange}.ts` 부품(매핑) 작성+instrumentation 훅. gametick은 자동 합산.

### ⛔ 아이템매니아·땡스 — VPS 한국 외 차단(중요)
- **정찰은 성공**: 아이템매니아 시세 XML `_xml/gamemoney_servers.xml.php?gamecode=`(게임당 1콜 전서버, 단가=price/multiple, 클래식 gamecode=5913, 서버명 매핑). 땡스(`itemthankyou.com`)는 EUC-KR 매물목록+총액(수량 범위)이라 단가 산출 불안정.
- **그러나 둘 다 말레이시아 VPS에서 차단**: 매니아=연결 타임아웃(http 000, ~134s), 땡스=403. 로컬(한국)은 됨. → **현재 서버에선 수집 불가**.
- 대응: lc_vn `itemmania.ts`는 보존(향후 KR 수집기/프록시 확보 시 instrumentation에 훅 다시 추가). 땡스 모듈은 미작성. `exchanges.ts`에서 둘 다 active=false.
- **교훈(수집기)**: 외부 fetch엔 반드시 `AbortSignal.timeout` — 무타임아웃이면 차단 사이트가 instrumentation tick을 134초 행시킴(바로템/베이 수집까지 지연). itembay/itemmania에 8s 타임아웃 적용.
- VPS 가용성 요약: 바로템✅ 아이템베이✅ chzzk✅ SOOP✅ 유튜브✅ / 아이템매니아❌ 땡스❌.

### ✅ BJ 순위 실데이터 연동 (2026-06-30, `233fb84`)
- **BJ 순위 = 치지직 공개 라이브 검색 API 자동화**. `src/lib/chzzk.ts`가 게임별
  `chzzkKeyword`(없으면 nameKo)로 검색 → 동시 시청자순 상위 5(채널 dedupe).
  fetch `revalidate:300`(5분 캐시), 실패 시 빈 배열("준비 중"). **수집기/워커·DB 불필요**(요청 시 직접 fetch, 페이지가 force-dynamic).
- 위젯: BJ는 치지직 채널 링크+방송중 빨간점+시청자수+"실시간·치지직" 서브타이틀.
- **VPS(말레이시아)에서 api.chzzk.naver.com 접근 OK**(지역차단 없음, 200+데이터 확인). 라이브 검증 완료.
- 키워드 보정: 메이플→메이플랜드, 조선협객전·RF온라인·아키에이지(나머지는 게임명).

### ✅ 라이브 페이지 — 멀티플랫폼 인페이지 시청 (2026-06-30, `db57b4c`)
- **gamebit `/live` 방식 1:1 + 우위.** `/[locale]/live/[game]`에서 게임별 라이브 방송을 사이트 안에서 **플레이어+채팅 임베드**로 시청. gamebit은 유튜브+SOOP, **우리는 치지직까지 3플랫폼**.
- **핵심 인사이트**: 임베드(플레이어/채팅)는 전부 **무료 iframe**(API·쿼터 무관). 쿼터는 "발견(누가 라이브냐)"에만 해당. 그리고 **SOOP·치지직은 발견도 키리스** → 유튜브만 빼면 키 0.
- `src/lib/live.ts` 발견+임베드:
  - 치지직 `search/lives`(재사용) / SOOP `sch.sooplive.co.kr api.php?m=liveSearch`(키리스, `user_id`로 임베드) / 유튜브.
  - **유튜브**: `GAMETICK_YT_API_KEY` 있으면 Data API(결정적·ToS 준수·권장), 없으면 검색결과 스크래핑 폴백. 스크래핑은 유튜브가 videoRenderer/lockupViewModel을 **A/B 비결정적**으로 내려줘 까다로웠음 → 해결: `SOCS` consent 쿠키로 classic 포맷 유도 + **중괄호 균형 파서**(lazy 정규식은 설명문 `};</script>`에서 절단됨) + `"videoRenderer":` 블록 직접 추출 + 라이브 감지 확대(overlay/badge/"시청 중").
  - 임베드: 유튜브 `embed/{vid}`+`live_chat?v=&embed_domain={host}`, SOOP `play.sooplive.co.kr/{id}/embed`(채팅 미지원→안내), 치지직 `embed/player/{id}`+`embed/chat/{id}`.
- `LivePlayer.tsx`(client): 플레이어+채팅+방송목록(시청자순) 전환. `embed_domain`은 `window` 대신 **서버 `headers()` host**를 prop으로(hydration 불일치 방지).
- Header: "● 라이브" nav + `section="data"|"live"` 게임탭 토글. `/ko/live`→기본게임 redirect. sitemap 추가.
- **검증**: 로컬·프로덕션 3플랫폼 렌더(리니지=유튜브 강세 쌈용 664, 메이플/아이온=SOOP·치지직 다수), 채팅 `embed_domain=gamesise.co.kr` 확인.
- **남은 튜닝**: 라이브 검색 키워드가 `chzzkKeyword ?? nameKo` 공용이라 플랫폼별 최적이 아님(예: maple "메이플랜드"는 SOOP 대형 BJ "메이플"을 못 잡음). 게임/플랫폼별 `liveKeyword` 분리 여지.

### ✅ "네임드 순위" → "인기 영상"으로 전환 (2026-06-30)
- **게임 내 네임드(캐릭터) 순위는 깔끔한 자동 소스 없음** — plaync 공식 랭킹은 JS/인증 장벽+게임마다 다름, 벤치마크 gamebit조차 네임드·BJ 둘 다 "준비 중"으로 비워둠. 수동 입력은 라이브에 검증 불가 stale 데이터라 기각.
- **대안: 빈 네임드 슬롯을 치지직 인기 영상(조회수순)으로 채움**(실데이터). `chzzk.ts fetchPopularVideos`(`search/videos`, `revalidate:300`, 조회수 내림차순 상위5, videoNo dedupe). 위젯에 영상 제목+조회수+영상 링크(`chzzk.naver.com/video/{no}`)+"조회순·치지직" 서브타이틀.
- `data/rankings.ts`는 이제 **타입(RankItem)만** 보유(RANKINGS 수동 큐레이션·getRankings 제거). 페이지가 BJ·인기영상 둘 다 직접 fetch.
- 결과: 랭킹 위젯 **양쪽 다 치지직 실데이터** → gamebit(둘 다 준비중)을 두 위젯 모두에서 앞섬.

### 기타
1. **차트 누적 확인** — 바로템 복구 직후라 실데이터 포인트가 1개. 시간 지나며 스파크/캔들/24h등락이 채워지는지 며칠 모니터링. (서버 lc_vn 수집기가 300초 주기로 쌓음)
2. (선택) **리네이밍** gametick → gamesise: GitHub 레포명, 로컬 폴더, `GAMETICK_DATA_DIR` env명. 순전히 정리용.
3. (선택) **멀티 거래소 실연동** (아이템매니아/베이) — `data/exchanges.ts` 추상화 있음, 현재 barotem만 active. 바로템이 또 막히면 대체 소스로도 유용.
4. (선택) 커뮤니티 위젯 실데이터, 텔레그램/디스코드 알림(워커 필요).
5. (선택) 콘텐츠/연락처/광고 슬롯 실링크, 메타 OG 이미지.

## 7. 기능 인벤토리 (실동작 vs 스텁)

**실동작**: 시세표(검색·정렬·즐겨찾기) · 자동갱신 폴링(`/api/prices`, 60s, 탭 숨김 시 중단) · 서버상세 캔들차트(3분/1시간/일봉 + 이동평균선) · 24h 등락 · 매물수 표시 · 브라우저 가격알림(localStorage) · 즐겨찾기 대시보드 · SEO(페이지별 메타+sitemap+robots) · 임베드 위젯 · VND 환산(vi) · PWA manifest · umami(env로 켬) · 다크테마/한국색상 · **BJ 순위(치지직+SOOP+유튜브 라이브 통합·시청자순, 게임페이지 위젯)** · **인기 영상(치지직 영상 조회수순)** · **라이브 페이지(3플랫폼 인페이지 시청, `/live/[game]`)**.

**스텁/대기**: 멀티거래소(🟢바로템+아이템베이 활성/클래식·아이온2, 매니아·땡스·타게임은 후속) · 커뮤니티 위젯(빈 상태) · **🟢텔레그램 가격알림(라이브)** / 디스코드(후속).
**선택 설정**: `GAMETICK_YT_API_KEY` — 라이브 유튜브 발견의 **폴백**(스크래핑이 빈 배열일 때만 Data API 사용). 평소엔 스크래핑(SOCS 쿠키로 안정, 무료)만 써서 쿼터 미사용. 현재 미설정이어도 정상 동작.

### 🟢 #7 텔레그램 가격 알림 (2026-06-30, lc_vn `3c4eea5` / gametick `e232f48`, 라이브)
- **무료**(텔레그램 Bot API). 봇 **@gamesise_alert_bot**, 토큰은 **lc_vn 서버 `.env.local` `TELEGRAM_BOT_TOKEN`**(코드/깃 X). VPS→telegram 접근 OK.
- **백엔드(lc_vn `src/lib/telegram.ts`)**: `data/alerts.json` 구독저장 + `getUpdates` 폴러(`/start` 딥링크 등록, `/list`·`/clear`) + `checkAlerts`(매 tick, 활성 거래소 최저가 비교→조건 도달 시 발송→히스테리시스 재무장). instrumentation에서 폴러 시작+tick 훅. **토큰 없으면 전부 no-op**.
- **UI(gametick `TelegramAlert.tsx`)**: 서버 상세에 "📲 텔레그램 알림" — 기준가/이하·이상 입력 → 딥링크 `t.me/gamesise_alert_bot?start={slug}_{serverId}_{price}_{b|a}`. 사용자가 [시작]만 누르면 등록.
- **폴러 생존 확인법**: 외부에서 `getUpdates` 호출 시 **409 Conflict**면 서버 폴러 작동중(텔레그램은 getUpdates 단일 소비자만 허용). 절대 외부에서 getUpdates/webhook 걸지 말 것(폴러 깨짐).
- **✅ E2E 검증 완료**(2026-06-30, 실제 봇 [시작]→알림 수신 확인). 디스코드(웹훅 POST)는 후속.

## 8. 파일 가이드 (게임시세)

| 파일 | 역할 |
| --- | --- |
| `src/data/games.ts` | 4게임 87서버 + 시세단위. slug는 lc_vn history 파일명과 일치 필수 |
| `src/data/exchanges.ts` | 거래소 목록. barotem·**itembay active**, 매니아 false. `ACTIVE_EXCHANGES`/`SOURCE_LABEL` |
| `src/lib/live.ts` | 멀티플랫폼 라이브 발견(치지직/SOOP/유튜브)+임베드 URL. `fetchAllLives(LiveQuery)`=검색+관련성필터(include/exclude). 유튜브=스크래핑 1순위/Data API 폴백 |
| `src/data/games.ts` | …+ `liveKeywords`/`liveMatch`/`liveExclude` 필드 + `liveQuery(game)` 리졸버(라이브 검색 설정) |
| `src/components/LivePlayer.tsx` | (client) 라이브 플레이어+채팅+방송목록 전환 위젯 |
| `src/app/[locale]/live/[game]/page.tsx` | 멀티플랫폼 인페이지 시청 페이지 (`/live` = 기본게임 redirect) |
| `src/lib/history.ts` | **읽기전용** 공유 history (`GAMETICK_DATA_DIR`). `readHistory(slug,exchange?)`/`seriesFor`/`change24h`/`latestCount`/`latestPrice`/`downsample` |
| `src/lib/market.ts` | 시세표(`getMarketTable`, 멀티거래소 최저가/quotes/spread), `summarize`/`movers`, `getServerChart`, `listingCount` |
| `src/lib/candles.ts` | OHLC 버킷팅(3m/1h/1d) + 이동평균 |
| `src/lib/alerts.ts` | 브라우저 가격알림(localStorage, 백엔드 없음) |
| `src/lib/exchange.ts` | KRW→VND/USD 환율(1시간 캐시, er-api) |
| `src/lib/format.ts` | 한국식 색상(상승빨강/하락파랑)·포맷 |
| `src/i18n/{config,dictionaries}.ts` | ko/vi 로케일 + 카피 |
| `src/components/Header,Footer,MarketTable,Sparkline,CandleChart,AlertButton,FavoritesView` | UI. MarketTable이 클라이언트(폴링·정렬·검색·즐겨찾기) |
| `src/components/ExchangeOverlay.tsx` | 서버상세 거래소별 시세 비교 오버레이(멀티라인 SVG+범례). `market.getServerExchangeSeries` |
| `src/components/TelegramAlert.tsx` | 서버상세 텔레그램 알림 딥링크 버튼. 백엔드는 lc_vn `lib/telegram.ts` |
| `src/app/[locale]/[game]/page.tsx` | 시세표 페이지 |
| `src/app/[locale]/[game]/[server]/page.tsx` | 서버 상세 + 캔들차트 |
| `src/app/[locale]/favorites/page.tsx` | 즐겨찾기 대시보드 |
| `src/app/api/prices/route.ts` | 시세 JSON (폴링·즐겨찾기용) |
| `src/app/embed/[game]/[server]/page.tsx` | iframe 임베드 위젯 |
| `src/app/{sitemap,robots,manifest}.ts` | SEO/PWA. **sitemap은 `dynamic="force-dynamic"` 필수**(§9) |
| `scripts/gen-sample.mjs` | 로컬 차트 확인용 **샘플** 데이터 생성기 (실데이터 아님) |

## 9. 밟은 함정 / 교훈 (재발 방지)

1. **sitemap.ts는 반드시 `export const dynamic = "force-dynamic"`** — 안 하면 루트 `[locale]` 동적 세그먼트가 `/sitemap.xml`을 가로채 `notFound()`로 404. (robots는 라우트핸들러라 영향 없음)
2. **로컬 lc_vn 데이터가 23일 전이라 차트 빈 화면** — 스파크/캔들은 최근 24h 창. 로컬 확인은 `scripts/gen-sample.mjs`로 샘플 시드(실데이터 아님).
3. **바로템을 로컬에서 몰아 폴링 금지** (IP 리스크). 단 현재 null은 바로템 자체 고장 때문(§4).
4. **PowerShell 커밋 메시지에 큰따옴표 넣지 말 것** — 파싱 깨짐. here-string `@'...'@` 사용.
5. **Set-Content는 UTF-8 BOM 붙여 JSON.parse 깨뜨림** → `[System.IO.File]::WriteAllText` 사용.
6. **next start는 한 번에 하나만** — 옛 인스턴스가 포트 점유 중이면 새 빌드가 안 뜨고 옛 빌드에 검사가 맞음. 재시작 전 포트 점유 프로세스 kill.
8. **게임 추가법(검증됨)**: 바로템 메인 HTML의 게임메뉴 JSON에서 `{"title":"게임명","thread":"2382rXXX"}` = 그 게임의 머니 스레드(메뉴 순서=인기순). **서버 필터는 게임마다 opt1/opt2로 다름** — lists 페이지의 `<li data-title="optN" data-optN="ID"><p>서버명</p>`로 확인. lc_vn `GameInfo.serverParam`로 지정. (조사/생성 스크립트: `C:\Users\User\gen-games.py`, `gen-config.py`)
9. 로컬 테스트: `cd C:\Users\User\gametick; npx next start -p 3212` (3000은 lc_info, 3001 lc_vn 등 점유 가능). 검증용 데이터는 lc_vn/data 또는 샘플.
10. **유튜브 검색결과 스크래핑 함정(라이브 페이지)**: ① lazy 정규식(`{[\s\S]*?};</script>`)은 영상 설명문에 들어간 `};</script>`에서 조기 절단 → **중괄호 균형 파서** 써라. ② 유튜브가 `videoRenderer`(구형)/`lockupViewModel`(신형)을 **요청마다 A/B 비결정적**으로 내려줌(node는 구형, 서버 fetch는 랜덤) → `SOCS` consent 쿠키로 classic 유도하면 안정. ③ 라이브 감지는 overlay만 보지 말고 badge `LIVE_NOW`·viewText "시청 중"까지. ④ 근본 안정책은 `GAMETICK_YT_API_KEY`(Data API). **임베드(플레이어/채팅)는 무료 iframe이라 이 고생과 무관** — 쿼터/스크래핑은 "발견"에만.
11. **iframe `embed_domain`은 `window`로 잡지 말 것**(SSR/CSR hydration 불일치) — 서버 `headers()`의 host를 prop으로 내려라. (유튜브 live_chat 임베드는 부모 도메인 HTTPS + embed_domain 일치 필요)
12. **라이브 검색은 세 플랫폼 다 느슨함** — SOOP `liveSearch`는 매물 적으면 인기 무관 방송을 끼워넣고, chzzk/youtube도 "클래식"·"메이플"·"아이온" 같은 부분일치로 타게임이 섞임. → `games.ts liveMatch`(제목에 토큰 하나는 포함) + `liveExclude`(타게임 토큰 제외)로 거른다(`live.ts`가 제목 정규화 후 전 플랫폼 적용). 이름이 포함관계인 경우(아이온⊂아이온2, 리니지 클래식/M/2M)는 exclude로 분리하되, "아이온"으로만 적은 아이온2 방송 등은 완전 분리 불가(감수).

## 10. 커밋 히스토리 (2026-06-30, master)

- `c6bd622` MVP 스캐폴딩
- `d21f098` gamebit 참고 디자인 개편
- `b33a452` 기능 대량 추가(A~E): 자동갱신·캔들·알림·즐겨찾기·SEO·임베드·PWA
- `01a5996` 매물수(listingCount) 표시
- `f39ea96` 리브랜딩 겜틱→게임시세/GameSise
- `233fb84` BJ 순위 치지직 라이브 검색 실데이터 연동 (배포·라이브 검증 완료)
- `16cb1c1` 네임드 슬롯 → 치지직 인기 영상(조회수순) 실데이터 연동
- `db57b4c` 라이브 페이지 — 멀티플랫폼(치지직+SOOP+유튜브) 인페이지 시청 (배포·라이브 검증)
- `7214783` 게임 페이지 BJ 위젯 멀티플랫폼화(`fetchAllLives` 상위5)+라이브 링크 (배포·라이브 검증)
- `2aaefc8` 유튜브 라이브 안정화: 스크래핑 1순위 + Data API 폴백 (배포·라이브 검증)
- `0a8f4a7` 라이브 키워드 튜닝: 플랫폼별 검색어 + 관련성 필터(포함/제외) (배포·라이브 검증)
- `ed91823` #5 멀티거래소 Phase 1: 바로템+아이템베이 최저가/스프레드 (배포·라이브 검증)
- `27a5688` 멀티거래소: 아이템매니아·땡스 비활성(VPS 한국 외 차단)
- `b18bfe3` 서버 상세 거래소별 시세 비교 오버레이 (배포·라이브 검증)
- `e232f48` #7 텔레그램 알림 UI(딥링크) / (lc_vn) `3c4eea5` 텔레그램 알림 백엔드 (배포·라이브)
- (lc_vn 레포) `fb8763e` 아이템베이 부품 / `317d16f` 아이템매니아 부품(보존·미사용) / `b77bed3` 수집기 타임아웃+매니아 훅 제거 / `73180da` 아이템베이 아이온2(44서버) 추가
- (lc_vn 레포) `7275900` 수집기 listingCount 저장 (서버 미배포)
