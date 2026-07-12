// 요청 간 공유 TTL 캐시 — force-dynamic 페이지가 매 요청마다 무거운 계산을
// 반복하지 않도록 결과를 짧게(기본 60초) 캐싱한다. 동시 요청은 진행 중 계산 1건을
// 공유(thundering herd 방지). 데이터는 어차피 수 분마다 갱신되고 클라이언트가
// 폴링으로 실시간 반영하므로 짧은 지연은 무해하다.

export function makeTtlCache<A extends (string | number)[], T>(
  fn: (...args: A) => Promise<T>,
  ttlMs = 60_000
): (...args: A) => Promise<T> {
  const store = new Map<string, { at: number; data: T }>();
  const inflight = new Map<string, Promise<T>>();
  return (...args: A): Promise<T> => {
    const key = args.join("|");
    const cached = store.get(key);
    if (cached && Date.now() - cached.at < ttlMs) {
      return Promise.resolve(cached.data);
    }
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
        // 실패 시 만료된 값이라도 있으면 폴백(가용성 우선)
        const stale = store.get(key);
        if (stale) return stale.data;
        throw e;
      }
    );
    inflight.set(key, p);
    return p;
  };
}
