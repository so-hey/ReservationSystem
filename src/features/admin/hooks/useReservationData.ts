import { useEffect, useState } from 'react';
import { getReservationDetail } from '@/lib/functions';
import { ReservationDetailResponse } from '@/shared/types';

export const useReservationData = (id: number) => {
  const [data, setData] = useState<ReservationDetailResponse>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || id < 0) return;

      setLoading(true);
      try {
        const fetchedData = await getReservationDetail(id);
        setData(fetchedData);
      } catch (error) {
        console.error('予約詳細の取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading };
};
