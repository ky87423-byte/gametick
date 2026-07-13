// 요청 간 공유 TTL 캐시 (stale-while-revalidate).
// force-dynamic 페이지가 매 요청마다 무거운 계산을 반복하지 않도록 결과를 캐싱한다.
// 만료돼도 기존값을 즉시 반환하고 갱신은 백그라운드에서 → origin이 재계산으로
// 블로킹되지 않아 응답이 항상 빠르다(첫 로드 제외). 동시 요청은 진행 중 계산 1건을
// 공유(thundering herd 방지). 데이터는 수 분마다 갱신되고 클라이언트 폴링으로
// 실시간 반영되므로 짧은 지연은 무해하다.

export function makeTtlCache<A extends (string | number)[], T>(
  fn: (...args: A) => Promise<T>,
  ttlMs = 60_000
): (...args: A) => Promise<T> {
  const store = new Map<string, { at: number; data: T }>();
  const inflight = new Map<string, Promise<T>>();

  function refresh(key: string, args: A): Promise<T> {
    const existing = inflight.get(key);
    if (existing) return existing;
    const p = fn(...args).then(
      (data) => {
        store.set(key, { at: Date.now(), data });
        inflight.delete(key);
        return data;
      },
      (e) => {
        inflight.delete(key);
        throw e;
      }
    );
    inflight.set(key, p);
    return p;
  }

  return (...args: A): Promise<T> => {
    const key = args.join("|");
    const cached = store.get(key);
    if (cached) {
      // 만료됐으면 백그라운드 갱신만 트리거하고, 기존값을 즉시 반환(SWR).
      if (Date.now() - cached.at >= ttlMs) {
        refresh(key, args).catch(() => {
          /* 백그라운드 실패는 무시 — 다음 요청이 재시도, 그동안 stale 제공 */
        });
      }
      return Promise.resolve(cached.data);
    }
    // 캐시가 전혀 없을 때만 대기(각 키의 최초 1회).
    return refresh(key, args);
  };
}
