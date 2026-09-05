import { useRef } from 'react';
import { Dialog, Portal, Button, Text, VStack } from '@chakra-ui/react';
import { ReservationDetailResponse } from '@/shared/types';
import { formatRoomLabel, formatDateOnly, formatTimeToHHMM } from '@/shared/utils';
import type { ReservationConfirmAction } from '../hooks/useReservationActions';

interface ReservationActionConfirmDialogProps {
  action: ReservationConfirmAction;
  data: ReservationDetailResponse;
  isSubmitting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ReservationActionConfirmDialog({
  action, data, isSubmitting, error, onClose, onConfirm,
}: ReservationActionConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const label = action === 'reject' ? '却下' : action === 'complete' ? '返却承認' : '承認';

  return (
    <Dialog.Root
      open
      role="alertdialog"
      onOpenChange={(details) => {
        if (!details.open && !isSubmitting) onClose();
      }}
      closeOnEscape={!isSubmitting}
      closeOnInteractOutside={!isSubmitting}
      initialFocusEl={() => cancelRef.current}
      size="md"
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>予約{label}の確認</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description>以下の予約を{label}してよろしいですか？</Dialog.Description>
              <VStack align="stretch" gap={2} my={4} p={4} bg="gray.50" borderRadius="md">
                <Text>予約ID：{data.id}</Text>
                <Text>予約者：{data.reservatorName} 様（{data.clubName || '個人利用'}）</Text>
                <Text>部屋：{formatRoomLabel(data.room)}</Text>
                <Text>日時：{formatDateOnly(data.reservationDate)} {formatTimeToHHMM(data.startTime)} 〜 {formatTimeToHHMM(data.endTime)}</Text>
              </VStack>
              {action !== 'complete' && (
                <Text fontSize="sm">{label}後、{data.email} 宛てのGmail作成画面が開きます。内容を確認・編集してから送信してください。</Text>
              )}
              {error && <Text role="alert" color="red.600" mt={3}>{error}</Text>}
            </Dialog.Body>
            <Dialog.Footer>
              <Button ref={cancelRef} variant="outline" onClick={onClose} disabled={isSubmitting}>
                キャンセル
              </Button>
              <Button colorPalette={action === 'reject' ? 'orange' : 'green'} onClick={onConfirm} loading={isSubmitting}>
                {label}する
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
