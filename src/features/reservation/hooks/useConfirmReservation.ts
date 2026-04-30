import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReservation } from '@/lib/functions';
import { ReservationCreateRequest } from '@/shared/types';

export const useConfirmReservation = (formData: ReservationCreateRequest) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

  const handleConfirm = async () => {
    if (!guidelinesAccepted) {
      setError('使用事項と使用規程への同意が必要です。');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await createReservation(formData);
      const token = data.token || data;
      navigate(`/complete/${token}`, {
        state: { message: '予約を確定しました', type: 'reserve' },
      });
    } catch (error: any) {
      let errorMessage = '予約の確定に失敗しました。もう一度お試しください。';
      if (error?.message) errorMessage = error.message;
      if (errorMessage.includes('指定された時間帯に既に予約が存在します')) {
        errorMessage =
          '申し訳ございません。選択された時間帯は既に予約されています。別の時間帯をお選びください。';
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/reserve', { state: { reservationData: formData } });
  };

  return { submitting, error, guidelinesAccepted, setGuidelinesAccepted, handleConfirm, handleGoBack };
};
