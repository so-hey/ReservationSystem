import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservationCancelReturnPageData, updateReservationStatus } from '@/lib/functions';
import { ReservationDetailResponse } from '@/shared/types';

export const useCancelReservation = (token: string | undefined) => {
  const navigate = useNavigate();
  const [data, setData] = useState<ReservationDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('トークンが指定されていません');
        return;
      }
      setLoading(true);
      try {
        const fetchedData = await getReservationCancelReturnPageData('cancel', token);
        setData(fetchedData);
      } catch (error) {
        console.error(error);
        setError(`${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleCancel = async () => {
    if (!data) return;
    setCancelling(true);
    try {
      await updateReservationStatus(data.id, 'cancel');
      navigate(`/complete/${token}`, {
        state: { message: '予約をキャンセルしました', type: 'cancel' },
      });
    } catch (error) {
      console.error('キャンセル処理に失敗しました:', error);
      setError('キャンセル処理に失敗しました');
    } finally {
      setCancelling(false);
    }
  };

  return { data, loading, cancelling, error, handleCancel };
};
