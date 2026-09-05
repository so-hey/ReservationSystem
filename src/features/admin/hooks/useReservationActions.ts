import { useCallback, useRef, useState } from 'react';
import { updateReservationStatusAsAdmin, deleteReservation } from '@/lib/functions';
import { ReservationDetailResponse, ReservationStatus } from '@/shared/types';
import { formatRoomLabel, formatTimeToHHMM, formatDateOnly } from '@/shared/utils';
import { APP_CONFIG } from '@/shared/constants';

export const buildGmailUrl = (
  action: 'approve' | 'reject' | 'contact',
  data: ReservationDetailResponse,
): string => {
  const isApprove = action === 'approve';
  const subject = isApprove
    ? `【承認】ミーティングルーム予約のお知らせ`
    : action === 'reject'
      ? `【却下】ミーティングルーム予約のお知らせ`
      : `【ご連絡】ミーティングルームのご予約について`;

  const reservationInfo = [
    '━━━━━━━━━━━━━━━━━━━━━━',
    '【予約内容】',
    `部屋：${formatRoomLabel(data.room)}`,
    `日時：${formatDateOnly(data.reservationDate)}　${formatTimeToHHMM(data.startTime)} 〜 ${formatTimeToHHMM(data.endTime)}`,
    `利用人数：${data.numPeople}名`,
    `目的：${data.purpose}`,
    '━━━━━━━━━━━━━━━━━━━━━━',
  ].join('\n');

  const baseUrl = window.location.origin;
  const cancelUrl = `${baseUrl}/cancel/${data.token}`;
  const returnUrl = `${baseUrl}/return/${data.token}`;

  const signature = '\n\n神戸商科キャンパス 学生会';

  const body = action === 'contact'
    ? `${data.reservatorName} 様\n\nミーティングルームのご予約についてご連絡いたします。\n\n▼▼▼ ご連絡内容の記入欄 ▼▼▼\n【未記入・送信前に必ず編集してください】\nここに連絡内容を記入し、この案内文を削除してください。\n\n\n\n\n▲▲▲ ご連絡内容の記入欄ここまで ▲▲▲\n\n${reservationInfo}\n\nよろしくお願いいたします。${signature}`
    : isApprove
    ? `${data.reservatorName} 様\n\nこの度はご予約いただきありがとうございます。\n以下の予約が承認されましたのでお知らせいたします。\n\n${reservationInfo}\n\nご利用当日は時間厳守でお願いいたします。\n\n■ 返却手続き（利用終了後にこちらから）\n${returnUrl}\n\n■ キャンセルはこちら\n${cancelUrl}\n\nご不明な点がございましたら、お気軽にお問い合わせください。\n\nよろしくお願いいたします。${signature}`
    : `${data.reservatorName} 様\n\nこの度はご予約いただきありがとうございます。\n誠に申し訳ありませんが、以下のご予約については却下となりましたのでお知らせいたします。\n\n${reservationInfo}\n\nご不明な点がございましたら、お気軽にお問い合わせください。\n\nよろしくお願いいたします。${signature}`;

  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: data.email,
    su: subject,
    body,
    ...(APP_CONFIG.GMAIL_SENDER && { authuser: APP_CONFIG.GMAIL_SENDER }),
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

export type ReservationConfirmAction = 'approve' | 'reject' | 'complete';

export const useReservationActions = (
  id: number,
  onClose: () => void,
  data?: ReservationDetailResponse,
) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [pendingAction, setPendingAction] = useState<ReservationConfirmAction | null>(null);
  const [actionError, setActionError] = useState('');
  const isSubmitting = useRef(false);

  const handleConfirm = useCallback(() => {
    if (!data || isSubmitting.current) return;
    setActionError('');
    setPendingAction(data.status === ReservationStatus.RETURNED ? 'complete' : 'approve');
  }, [data]);

  const handleReject = useCallback(() => {
    if (!data || isSubmitting.current) return;
    setActionError('');
    setPendingAction('reject');
  }, [data]);

  const cancelAction = useCallback(() => {
    if (isSubmitting.current) return;
    setPendingAction(null);
    setActionError('');
  }, []);

  const confirmAction = useCallback(async () => {
    if (!pendingAction || !data || isSubmitting.current) return;
    isSubmitting.current = true;
    setActionError('');
    const setLoading = pendingAction === 'reject' ? setIsRejecting : setIsApproving;
    setLoading(true);
    try {
      await updateReservationStatusAsAdmin(id, pendingAction);
      if (pendingAction !== 'complete') window.open(buildGmailUrl(pendingAction, data), '_blank');
      setPendingAction(null);
      onClose();
    } catch (error) {
      console.error('予約の更新に失敗しました:', error);
      setActionError('予約の更新に失敗しました。時間をおいて再度お試しください。');
    } finally {
      isSubmitting.current = false;
      setLoading(false);
    }
  }, [id, onClose, data, pendingAction]);

  const handleDelete = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await deleteReservation(id);
      onClose();
    } catch (error) {
      console.error('予約削除に失敗しました:', error);
    } finally {
      setShowDeleteConfirm(false);
    }
  }, [id, onClose]);

  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  return {
    showDeleteConfirm,
    handleConfirm,
    handleReject,
    handleDelete,
    confirmDelete,
    cancelDelete,
    isApproving,
    isRejecting,
    pendingAction,
    actionError,
    confirmAction,
    cancelAction,
  };
};
