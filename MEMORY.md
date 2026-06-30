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
- **데이터 (A 방식)**: 직접 거래소 폴링 안 함. lc_vn 수집기가 만든 `history-{game}.json`을 `GAMETICK_DATA_DIR` 경로로 **읽기 전용** 접근.
  - 로컬: `C:\Users\User\lc_vn\data` / 서버: `/var/www/lc_vn/data`
  - 이유: 같은 VPS IP에서 거래소를 두 번 긁으면 차단 위험 → 수집기 1개만 둠.
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
- **#5 멀티 거래소**(아이템매니아/베이): 리버스 엔지니어링, 큰 작업. `data/exchanges.ts` 추상화 있음.
- **#7 텔레그램/디스코드 알림**: 별도 워커(봇 토큰) 필요.
- **네임드/BJ 데이터 소스**: BJ=치지직/SOOP API 자동화 후보, 네임드=수동/랭킹사이트.

### 기타
1. **차트 누적 확인** — 바로템 복구 직후라 실데이터 포인트가 1개. 시간 지나며 스파크/캔들/24h등락이 채워지는지 며칠 모니터링. (서버 lc_vn 수집기가 300초 주기로 쌓음)
2. (선택) **리네이밍** gametick → gamesise: GitHub 레포명, 로컬 폴더, `GAMETICK_DATA_DIR` env명. 순전히 정리용.
3. (선택) **멀티 거래소 실연동** (아이템매니아/베이) — `data/exchanges.ts` 추상화 있음, 현재 barotem만 active. 바로템이 또 막히면 대체 소스로도 유용.
4. (선택) 커뮤니티 위젯 실데이터, 텔레그램/디스코드 알림(워커 필요).
5. (선택) 콘텐츠/연락처/광고 슬롯 실링크, 메타 OG 이미지.

## 7. 기능 인벤토리 (실동작 vs 스텁)

**실동작**: 시세표(검색·정렬·즐겨찾기) · 자동갱신 폴링(`/api/prices`, 60s, 탭 숨김 시 중단) · 서버상세 캔들차트(3분/1시간/일봉 + 이동평균선) · 24h 등락 · 매물수 표시 · 브라우저 가격알림(localStorage) · 즐겨찾기 대시보드 · SEO(페이지별 메타+sitemap+robots) · 임베드 위젯 · VND 환산(vi) · PWA manifest · umami(env로 켬) · 다크테마/한국색상.

**스텁/대기**: 멀티거래소(추상화만, barotem 1곳) · 커뮤니티 위젯(빈 상태) · 텔레그램/디스코드 알림(워커 필요).

## 8. 파일 가이드 (게임시세)

| 파일 | 역할 |
| --- | --- |
| `src/data/games.ts` | 4게임 87서버 + 시세단위. slug는 lc_vn history 파일명과 일치 필수 |
| `src/data/exchanges.ts` | 거래소(데이터 출처) 목록. barotem active, 나머지 false |
| `src/lib/history.ts` | **읽기전용** 공유 history (`GAMETICK_DATA_DIR`). `readHistory`/`seriesFor`/`change24h`/`latestCount`/`downsample` |
| `src/lib/market.ts` | 시세표(`getMarketTable`), `summarize`/`movers`, `getServerChart`, `listingCount` |
| `src/lib/candles.ts` | OHLC 버킷팅(3m/1h/1d) + 이동평균 |
| `src/lib/alerts.ts` | 브라우저 가격알림(localStorage, 백엔드 없음) |
| `src/lib/exchange.ts` | KRW→VND/USD 환율(1시간 캐시, er-api) |
| `src/lib/format.ts` | 한국식 색상(상승빨강/하락파랑)·포맷 |
| `src/i18n/{config,dictionaries}.ts` | ko/vi 로케일 + 카피 |
| `src/components/Header,Footer,MarketTable,Sparkline,CandleChart,AlertButton,FavoritesView` | UI. MarketTable이 클라이언트(폴링·정렬·검색·즐겨찾기) |
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

## 10. 커밋 히스토리 (2026-06-30, master)

- `c6bd622` MVP 스캐폴딩
- `d21f098` gamebit 참고 디자인 개편
- `b33a452` 기능 대량 추가(A~E): 자동갱신·캔들·알림·즐겨찾기·SEO·임베드·PWA
- `01a5996` 매물수(listingCount) 표시
- `f39ea96` 리브랜딩 겜틱→게임시세/GameSise
- (lc_vn 레포) `7275900` 수집기 listingCount 저장 (서버 미배포)
