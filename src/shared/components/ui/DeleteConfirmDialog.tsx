import { Dialog, Portal, Button, Text } from '@chakra-ui/react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reservationId?: number;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  reservationId,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size="sm"
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>予約削除の確認</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>予約ID: {reservationId} を本当に削除してよろしいですか？</Text>
              <Text color="red.500" fontSize="sm" mt={2}>
                この操作は取り消すことができません。
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button colorPalette="red" onClick={onConfirm}>
                削除する
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
