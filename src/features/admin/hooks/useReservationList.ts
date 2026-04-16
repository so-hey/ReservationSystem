import { useCallback, useEffect, useState } from 'react';
import { getAllReservations } from '@/lib/functions';
import { ReservationListResponse } from '@/shared/types';

export const useReservationList = () => {
  const [data, setData] = useState<ReservationListResponse[]>([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllReservations();
      setData(res);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [reload]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleRefresh = () => setReload((prev) => !prev);
  const triggerReload = () => setReload((prev) => !prev);

  return { data, loading, handleRefresh, triggerReload };
};
