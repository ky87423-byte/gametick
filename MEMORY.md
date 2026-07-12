# 게임시세 (GameSise) 프로젝트 메모리

> 마지막 갱신: 2026-07-12 / 작업 일지: `docs/worklog.md` / 계획서: `PLAN.md`
> **세션 시작 시 이 파일부터 읽으세요.** (다음 할 일은 §6 + worklog 맨 끝)
>
> **2026-07-12 요약**(worklog "2026-07-12"): 모바일 테이블 오버플로우 수정(가로스크롤), **다국어 SEO 대폭 보강** — hreflang(페이지+sitemap 17k, `lib/seo.ts`), sitemap lastmod, vi 통화 로마자화(Adena), `<html lang>` 로케일 교정. 6개 외국어 전수 확인 완료. 색인은 서치콘솔 확인 대기.
>
> **최근 세션(2026-07-11) 요약** — 상세는 worklog "2026-07-11" 섹션:
> - **캔들차트 lightweight-charts v4 전면개편**: 크로스헤어 툴팁·로케일 시간대·자릿수 눈금·타임프레임별 기본뷰·MA토글(기본OFF)·3분봉 선차트 자동전환.
> - **데이터 노이즈 제거**: `candles.despike`(롤링중앙값) + lc_vn `barotem.robustLowest`(수집단 오등록 배제). bar/차트 밑꼬리 스파이크 해결.
> - **거래소 비교: 선그래프→표**(`ExchangeTable`, 세로시간/가로거래소, 1시간·일간, 최저가강조). **시세표 현재가=거래소 로고 토글**(기본 바로템, 전부 클라이언트).
> - **lc_vn 보관 7→90일**(일봉 장기). ⚠️소급불가·파일증가 모니터링.
> - **후반**: 레이븐2·아이온 시세 복구(baro_price 폴백, 14게임 전부 시세), **차트 이벤트 마커**(관리자 등록→setMarkers), **광고/제휴 문의 쪽지 시스템**(/contact 폼→lc_vn 저장→/admin/inquiries), **관리자 허브**(3페이지 공유 네비+미확인 배지), og:image 명시(카톡 미리보기), 시세계산기 천단위·현지통화, 차트 보조통화 옵션, 트렌드 섹션 제거.
> - memory 신규: `barotem-price-spikes`, `lc_vn-retention-90d`, `admin-pages`. 상세는 worklog "2026-07-11 (이어서)".
>
> **이전 세션(2026-07-03) 요약** — 상세는 worklog "2026-07-02~03" 섹션:
> - i18n **4개 언어**(ko/en/zh/vi) — 통화 영문화(Adena/Kinah/Meso/Dia), 언어별 시간대, `LangSwitch`.
> - **라이트/다크 테마 토글**(`html.light` zinc 반전), 게임 메뉴 1줄+선택 게임 고정, 시세표 정렬/급등락 표기, 거래 카드 탭화(거래량 랭킹+거래완료).
> - SEO: 구조화데이터(FAQPage·BreadcrumbList·Organization), 게임별 시세가이드 14편·게임정보표·공통 FAQ(`/guide/faq`), 구글·네이버 서치콘솔 등록.
> - **파비콘 GS 로고**, 광고 배너 삽입(대리육성), 푸터 CTA 제거, 차트 가격/날짜축.
> - 🔴 **솔인챈트 단위 오류 수정**(만→천, 양쪽 레포) — §9 교훈 참고.

## 0. 한 줄 요약

한국 게임머니 **서버별 실시간 시세·차트·가격알림 플랫폼** (gamebit.co.kr 벤치마크, 더 좋게).
- 시세 자체는 수집하지 않고 **자매 프로젝트 lc_vn의 수집기가 쌓은 데이터를 공유해서 읽기만** 함(A 방식).
- i18n **4개 언어**: 한국어(메인)·영어·중국어·베트남어. 수익은 광고배너(대리육성 등). 라이트/다크 테마.

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
  - **수집 주기**: 기본 300초(5분). 게임별 override = lc_vn `site.ts GameInfo.refreshSeconds` (리니지클래식·아이온2 = 180초/3분). 짧을수록 실시간↑·거래소 차단위험↑(돈/서버성능과 무관, 차단 회피용 의도적 텀).
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
- 로컬 사본: `C:\Users\User\gamesise.conf` (scp 원본). .com→.co.kr 301 정상(www/http/경로 보존) 재확인(2026-07-02).

### 5.1 검색엔진 색인 (2026-07-02 등록, 노출 대기)
- **정식 도메인 = gamesise.co.kr** (서치콘솔은 .co.kr만 등록. .com은 301로 흡수).
- **구글 서치콘솔**: 소유확인 **DNS TXT**(`google-site-verification=cIEw5v1aglRSrVpxB2Zb2u_yNjOu4ImQ2iG7gqDZdZ0`, 전파 확인) + 사이트맵 제출 완료. 도메인 속성.
- **네이버 서치어드바이저**: 소유확인 **메타태그**(`app/layout.tsx` metadata.verification.other `naver-site-verification`) + 사이트맵 제출. 네이버 "robots.txt 없음"은 Yeti 미방문(신규)일 뿐, robots는 정상(200/text-plain/Yeti 200).
- 기술 SEO 정상: robots Allow(+`/embed/` disallow), `sitemap.xml` 576 URL, 게임/서버/가이드 페이지 canonical·메타, noindex 없음. (홈 `/ko` canonical만 미설정 — 경미)
- **상태**: 등록 끝, **실검색 노출까지 며칠~2주 대기**(신규 도메인). 색인 진행은 서치콘솔 리포트로 모니터링.
- 구글 인증코드를 메타로도 넣고 싶으면 `layout.tsx` verification.google에 추가(현재 DNS라 불필요).

## 6. 현재 상태 & 다음 작업

> **차별 기능 대부분 라이브 완료**(멀티거래소·라이브·알림·OG). 추천작업 #1~#7 전부 처리.
> **다음 세션 할 일(우선순위)은 `docs/worklog.md` 맨 끝**에 정리됨 — 거기부터 보면 됨.
> **2026-07-11 세션**: 캔들차트 lightweight-charts 전면개편 + 데이터 노이즈 despike/robustLowest + 거래소 비교 표(선그래프→표) + 시세표 거래소 로고 전환 + lc_vn 보관 90일. 상세는 `docs/worklog.md` 2026-07-11 섹션. memory: `barotem-price-spikes`·`lc_vn-retention-90d`.

### 라이브 완료된 핵심 (요약)
- ✅ **멀티거래소**: 바로템+아이템베이+아이템매니아 통합 최저가/스프레드. **리니지클래식·아이온2 = 3거래소**, 나머지=바로템(거래소 시세피드 한계). 서버상세 **거래소 비교 표**(1시간/일간, 최저가 강조). 시세표 현재가=거래소 로고 토글(기본 바로템).
- ✅ **라이브 탭** `/live/[game]`(치지직+SOOP+유튜브 시청) + 인기영상/BJ 위젯.
- ✅ **가격 알림** #7: 텔레그램(@gamesise_alert_bot)+디스코드(웹훅), 둘 다 E2E 확인.
- ✅ OG 썸네일, 다음갱신 카운트다운, 게임별 수집주기 차등.
- 추천작업: ✅#1 SEO ✅#2 리포트 ✅#3 가이드 ✅#4 게임확대 ✅#5 멀티거래소 ✅#6 약관 ✅#7 알림.

### 멀티거래소 — 게임 추가법 (참고)
- **아이템베이**(말레이시아에서 직접 가능): 홈 JSON-LD/검색으로 `iGameSeq` 찾고 `game-{id}/type-3` 페이지의 `data-server-seq`↔서버명 추출 → 우리 nameKo와 **이름 정규화 매칭**(괄호/공백 제거) → `lib/itembay.ts ITEMBAY`에 추가. 단위는 `market-info` biBasePrice로 factor 정규화.
- **아이템매니아**(한국 차단 → KR 프록시 경유): `lib/itemmania.ts ITEMMANIA`에 게임별 gamecode만 추가(서버명 자동 매칭). gamecode = 매니아 `sell/list.html?search_game=N`의 N(=시세 gamecode). `result="na"`면 매니아가 시세 미제공.
- **현 한계**: 리니지M(2583)·2M(3429)=아이템베이 "통합거래소" 단일(서버별 없음), 메이플월드(4047)·나크(3954)·솔인챈트=거래소 시세 미운영. → 바로템만.
- ⚠️ **레이트리밋**: 아이템베이 API 무딜레이 연타 시 일시 차단(code -1). 정찰 스크립트는 딜레이 필수. 수집기는 150ms+게임주기 게이트라 안전.

### ✅ #5 멀티거래소 Phase 1 — 바로템+아이템베이 (2026-06-30, gametick `ed91823` / lc_vn `fb8763e`)
- **아이템베이 시세 API(keyless)**: `GET itembay.com/item/api/sell/getRealTimeMarket?iGameServerSeq={seq}` → `{iMarkePrice, iLowestPrice}`. 단위: `/api/game/server/market-info?iGameSeq=&iGameServerSeq=` → `{biBasePrice, vcUnit}`. 서버명이 우리와 동일 → **이름으로 매핑**.
- **수집(lc_vn)**: `src/lib/itembay.ts`(부품 모듈, 매핑 내장: 클래식 iGameSeq=3828) → `collectItembay`가 서버별 최저가를 우리 단위로 정규화해 `history-{game}-itembay.json` 기록. instrumentation tick에 추가(게임당 priceRevalidateSeconds 주기, 서버 호출 150ms 딜레이, try-catch 격리). **lc_vn은 gmhm365 라이브 사이트라 변경 주의**.
- **계산/표시(gametick)**: `market.ts`가 최저가·스프레드 계산, 시세표에 최저가+거래소칩(최저=앰버). 라이브 검증: 22/29서버, 서버마다 최저 거래소 다름(데포로쥬 베이1220<바로템1300, 이실로테 바로템1100<베이1180).
- **다음 거래소 추가법**: `data/exchanges.ts`에 active=true, lc_vn에 `{exchange}.ts` 부품(매핑) 작성+instrumentation 훅. gametick은 자동 합산.

### 🟢 아이템매니아 — 한국 프록시 경유로 부활 (2026-07-01)
- 아이템매니아는 한국 외 차단이라 **한국 Vultr 서버(서울)에 tinyproxy**를 띄우고 lc_vn이 그걸 경유해 수집.
- **KR 프록시 인프라**: Vultr 서울 `158.247.239.183`, tinyproxy 포트 `8888`, **ufw로 말레이시아 VPS(111.90.148.135)만 허용**(오픈프록시 아님). lc_vn 서버 `.env.local`에 `KR_PROXY_URL=http://158.247.239.183:8888`. (KR박스 비번은 비밀; SSH는 말레이시아에서 sshpass 경유로 설정함)
- **lc_vn 코드**: `itemmania.ts`가 `undici` `ProxyAgent`로 **그 fetch만** 프록시 경유(바로템/베이/텔레는 직접). `KR_PROXY_URL` 없으면 자동 skip. 라이브 검증: 클래식 27/27 수집 → gametick 3거래소(바로템·베이·매니아).
- **남은 확장**: `itemmania.ts ITEMMANIA`에 게임별 gamecode 추가하면 그 게임도 매니아 합류(현재 클래식=5913만). 아이온2 등은 gamecode 찾아 추가.
- ⚠️ **KR박스 비용**: Vultr 월 ~$5. 끄면 매니아 수집 중단(바로템·베이는 영향 없음).

### ⛔ 땡스아이템 — 데이터센터 IP까지 차단
- 땡스(`itemthankyou.com`)는 한국 프록시(Vultr 데이터센터 IP)로도 **403(WAF)**. 한국 IP여도 데이터센터면 막힘 + 데이터 품질도 낮음(총액·수량범위) → **보류**. (살리려면 residential proxy 필요)

### 교훈 / VPS 가용성 (수집 관련)
- **VPS 가용성(말레이시아 직접)**: 바로템✅ 아이템베이✅ chzzk✅ SOOP✅ 유튜브✅ / **아이템매니아❌(→KR 프록시로 해결)** / 땡스❌(데이터센터 IP까지 403, 보류).
- **교훈**: 외부 fetch엔 반드시 `AbortSignal.timeout`(undici fetch는 signal 지원). 무타임아웃이면 차단 사이트가 instrumentation tick을 134초 행시켜 바로템/베이 수집까지 지연됨(실제 겪음).
- 매니아 시세 형식: `_xml/gamemoney_servers.xml.php?gamecode=`(게임당 1콜 전서버, 단가=price/multiple). 땡스는 EUC-KR 매물목록+총액(수량범위)이라 단가 산출 불안정 + 차단이라 미작성.

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
- **✅ E2E 검증 완료**(2026-06-30, 실제 봇 [시작]→알림 수신 확인).
- **🟢 디스코드 알림도 추가**(lc_vn `60c51c3`/gametick `2516084`): 웹훅 방식(폴러 불필요). `AlertSub.webhook`, `sendDiscord`/`notify`/`addDiscordSub`, lc_vn `POST /api/alert`. gametick `DiscordAlert.tsx`(웹훅URL+기준가) → `POST /api/discord-alert` **프록시**가 lc_vn 내부(`LC_VN_INTERNAL_URL`=`127.0.0.1:3001`)로 서버측 전달(브라우저는 gamesise만 호출, CORS 없음). alerts.json 단일 writer=lc_vn. 체인 프로덕션 검증 + **✅ 실제 웹훅 수신 확인 완료**(2026-06-30).

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
| `src/lib/market.ts` | 시세표(`getMarketTable`, 멀티거래소 최저가/quotes/spread), `summarize`/`movers`, `getServerChart`, **`getServerExchangeTable`(거래소×시간 표, 1시간·일간)**, `listingCount` |
| `src/lib/candles.ts` | OHLC 버킷팅(3m/1h/1d) + 이동평균 + **`despike`(export, 롤링중앙값 노이즈제거)**. 3m 몸통0면 선차트로(chart 컴포넌트) |
| `src/lib/events.ts` | **차트 이벤트 마커(읽기전용)** — lc_vn `chart-events.json`, `eventsForServer`(서버별+게임전체). LightweightChart `setMarkers` |
| `src/components/ContactForm.tsx` + `app/[locale]/contact/page.tsx` + `api/inquiry` | **광고/제휴 문의 폼**(제목·내용·메신저ID)→프록시→lc_vn `inquiries.json`. 관리자는 lc_vn `/admin/inquiries`. [[admin-pages]] |
| `src/lib/inquiries.ts` | **미확인 문의 존재 여부**(읽기전용, `hasUnreadInquiry`, 30s캐시) — Footer(async)의 "관리자" 옆 점 알림용(숫자 없음) |
| `src/lib/alerts.ts` | 브라우저 가격알림(localStorage, 백엔드 없음) |
| `src/lib/exchange.ts` | KRW→VND/USD 환율(1시간 캐시, er-api) |
| `src/lib/format.ts` | 한국식 색상(상승빨강/하락파랑)·포맷 |
| `src/lib/seo.ts` | **hreflang** 언어대체(`altLanguages`, 게임·서버 metadata + sitemap). 통화는 `data/games.ts currencyOf`(ko만 한글, 그외 로마자 Adena) |
| `src/i18n/{config,dictionaries}.ts` | ko/vi 로케일 + 카피 |
| `src/components/Header,Footer,MarketTable,Sparkline,AlertButton,FavoritesView` | UI. MarketTable이 클라이언트(폴링·정렬·검색·즐겨찾기). **MarketTable 현재가 헤더에 거래소 로고 토글(바로템 기본)→그 거래소 시세로 전환, 전부 클라이언트** |
| `src/components/LightweightChart.tsx` | **캔들차트(lightweight-charts v4)**. 라이트/다크·로케일 시간대·크로스헤어툴팁·자릿수 눈금·despike된 데이터. 3m 몸통0면 선차트. |
| `src/components/ChartPanel.tsx` | 차트 타임프레임 탭(3분/1시간/일봉) + **MA 토글(기본 OFF)**, LightweightChart 래핑(client) |
| `src/components/ExchangeTable.tsx` + `ExchangeTablePanel.tsx` | 서버상세 **거래소별 시세 비교 표**(세로=시간/가로=바로템·매니아·베이, 행별 최저가 앰버). Panel=1시간/일간 탭(client). `market.getServerExchangeTable`. ※기존 ExchangeOverlay(SVG) 삭제됨 |
| `src/components/TelegramAlert.tsx` | 서버상세 텔레그램 알림 딥링크 버튼. 백엔드는 lc_vn `lib/telegram.ts` |
| `src/components/DiscordAlert.tsx` + `api/discord-alert` | 디스코드 알림(웹훅URL 입력)+lc_vn 프록시 |
| `src/app/[locale]/[game]/page.tsx` | 시세표 페이지 |
| `src/app/[locale]/[game]/[server]/page.tsx` | 서버 상세 + 캔들차트 |
| `src/app/[locale]/favorites/page.tsx` | 즐겨찾기 대시보드 |
| `src/app/api/prices/route.ts` | 시세 JSON (폴링·즐겨찾기용) |
| `src/app/embed/[game]/[server]/page.tsx` | iframe 임베드 위젯 |
| `src/app/{sitemap,robots,manifest}.ts` | SEO/PWA. **sitemap은 `dynamic="force-dynamic"` 필수**(§9) |
| `src/app/opengraph-image.tsx` | 공유 썸네일(전 페이지 기본). `next/og` ImageResponse + `src/assets/BlackHanSans.woff`(한글). satori는 ttf/otf/woff만(woff2 X) |
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
13. **게임 단위(unitAmount)는 바로템 실단위와 반드시 일치** — 바로템은 단위를 페이지에서 자동감지해 **원시 가격 그대로 저장**(정규화 안 함). gametick `games.ts unitAmount`/lc_vn `site.ts fallbackUnit`가 실단위와 어긋나면 표시가 배수만큼 틀림(솔인챈트: 만↔천 10배 오류 사례). 검증: 바로템 `productTable/{thread}?display=2&orderby=3&{opt}={sid}` 응답 `rows[0].unit_price`의 "천당/만당"(헤더 `X-Requested-With: XMLHttpRequest`+`Referer` 필요). 양쪽 레포 같이 고칠 것.
14. **Next ICO 파비콘은 내부 PNG가 RGBA여야** 빌드 통과(`sharp...ensureAlpha().png()`). RGB면 "Ico: PNG is not in RGBA format" 빌드 에러. `app/icon.png`·`apple-icon.png`도 자동 파비콘.
15. **라이트/다크 테마**: `html.light`에서 Tailwind v4 zinc CSS변수(`--color-zinc-*`) 반전으로 전체 전환(컴포넌트 수정 없음). 새 색은 zinc 계열 쓰면 자동 대응, 강조색(red/blue 등)은 양쪽 공용. 시각 시간은 `format.ts`가 로케일별 TZ 적용.

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
- `dad0251` OG 썸네일 / `2516084` 디스코드 알림 UI(+lc_vn `60c51c3`) / `44fefb8` 아이템매니아 활성(한국 프록시) / (lc_vn) `1ebf919` 매니아 프록시 수집·`1f1db72` 게임별 주기
- (lc_vn 레포) `fb8763e` 아이템베이 부품 / `317d16f` 아이템매니아 부품(보존·미사용) / `b77bed3` 수집기 타임아웃+매니아 훅 제거 / `73180da` 아이템베이 아이온2(44서버) 추가
- (lc_vn 레포) `7275900` 수집기 listingCount 저장 (서버 미배포)
