/**
 * 현재 시각을 주기적으로 갱신하는 훅.
 * 카운트다운/진행률 등 초 단위 갱신이 필요한 곳에서 사용.
 * (실시간 금액 카운터는 별도의 RAF 루프를 사용한다.)
 */
import { useEffect, useState } from 'react';

export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
