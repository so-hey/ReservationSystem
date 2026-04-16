import { useState } from 'react';
import {
  Dialog,
  Portal,
  DialogOpenChangeDetails,
  Box,
  Heading,
  Image,
  Button,
  Spacer,
  VStack,
  Text,
} from '@chakra-ui/react';
import { LuImageOff } from 'react-icons/lu';
import { ReservationStatus } from '@/shared/types';
import Loading from '@/shared/components/ui/Loading';
import ReservationDetailTable from './ReservationDetailTable';
import DeleteConfirmDialog from '@/shared/components/ui/DeleteConfirmDialog';
import { useReservationData } from '../hooks/useReservationData';
import { useReservationActions } from '../hooks/useReservationActions';

// 型定義
interface ReservationDetailProps {
  id: number;
  onClose: () => void;
}

// 定数
const { Root, Backdrop, Content, Header, Body, Footer, Positioner } = Dialog;

const DIALOG_CONFIG = {
  closeOnEscape: true,
  closeOnInteractOutside: true,
  size: { base: 'full', md: 'xl' } as const,
  placement: 'center' as const,
  motionPreset: 'slide-in-bottom' as const,
} as const;

const IMAGE_STYLES = {
  width: { base: '280px', md: '400px' },
  height: { base: '200px', md: '300px' },
  objectFit: 'cover' as const,
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'gray.200',
  flexShrink: 0,
} as const;

const ReservationDetail = ({ id, onClose }: ReservationDetailProps) => {
  const { data, loading } = useReservationData(id);
  const {
    showDeleteConfirm,
    handleConfirm,
    handleReject,
    handleDelete,
    confirmDelete,
    cancelDelete,
    isApproving,
    isRejecting,
  } = useReservationActions(id, onClose, data);

  // 画像拡大モーダルの状態
  const [selectedImage, setSelectedImage] = useState<{ url: string; index: number } | null>(null);

  const handleImageClick = (url: string, index: number) => {
    setSelectedImage({ url, index });
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  try {
    return (
      <Root
        open
        onOpenChange={(details: DialogOpenChangeDetails) => {
          if (!details.open) onClose();
        }}
        {...DIALOG_CONFIG}
      >
        <Portal>
          <Backdrop />
          <Positioner>
            <Content>
              <Header>
                <Box textAlign="center">
                  <Heading>予約詳細</Heading>
                </Box>
              </Header>
              <Loading loading={loading}>
                <Body
                  maxH={{ base: 'auto', md: '60vh' }}
                  overflowY={{ base: 'visible', md: 'auto' }}
                >
                  <ReservationDetailTable data={data} />
                  <Box mt={4} textAlign="center">
                    <Heading size="md" mb={2}>
                      返却画像 ({data?.returnImageUrls?.length || 0}枚)
                    </Heading>
                    {data?.returnImageUrls &&
                    Array.isArray(data.returnImageUrls) &&
                    data.returnImageUrls.length > 0 ? (
                      <Box
                        overflowX="auto"
                        py={2}
                        css={{
                          '&::-webkit-scrollbar': {
                            height: '8px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '4px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#c1c1c1',
                            borderRadius: '4px',
                          },
                          '&::-webkit-scrollbar-thumb:hover': {
                            background: '#a8a8a8',
                          },
                        }}
                      >
                        <Box display="flex" gap={4} minW="fit-content" px={2}>
                          {data.returnImageUrls.map((url, index) => {
                            if (!url || typeof url !== 'string') {
                              console.warn(`Invalid image URL at index ${index}:`, url);
                              return null;
                            }

                            return (
                              <Box
                                key={index}
                                textAlign="center"
                                minW={{ base: '280px', md: '300px' }}
                              >
                                <Image
                                  src={url}
                                  alt={`予約${data?.id}の部屋返却画像${index + 1}`}
                                  {...IMAGE_STYLES}
                                  mb={2}
                                  cursor="pointer"
                                  transition="all 0.2s"
                                  _hover={{
                                    transform: 'scale(1.05)',
                                    shadow: 'lg',
                                  }}
                                  onClick={() => handleImageClick(url, index)}
                                  onError={(e) => {
                                    console.error(`Failed to load image ${index + 1}:`, url);
                                    e.currentTarget.style.display = 'none';
                                  }}
                                  onLoad={() => {
                                    console.log(`Successfully loaded image ${index + 1}:`, url);
                                  }}
                                />
                                <Text fontSize="sm" color="gray.600">
                                  画像 {index + 1} / {data.returnImageUrls!.length}
                                </Text>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ) : (
                      <VStack
                        justify="center"
                        align="center"
                        bg="gray.100"
                        border="2px dashed"
                        borderColor="gray.300"
                        borderRadius="md"
                        p={8}
                        minH="200px"
                        maxW="400px"
                        mx="auto"
                      >
                        <LuImageOff size="4rem" color="gray.400" />
                        <Text color="gray.500" fontSize="lg" fontWeight="medium">
                          返却画像なし
                        </Text>
                        <Text color="gray.400" fontSize="sm" textAlign="center">
                          返却処理が完了していないか、
                          <br />
                          画像がアップロードされていません
                        </Text>
                      </VStack>
                    )}
                  </Box>
                </Body>
              </Loading>
              <Footer flexDirection={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 2 }}>
                <Button
                  colorPalette="gray"
                  onClick={onClose}
                  disabled={isApproving || isRejecting}
                  w={{ base: 'full', md: 'auto' }}
                  order={{ base: 4, md: 1 }}
                >
                  閉じる
                </Button>
                <Spacer display={{ base: 'none', md: 'block' }} order={{ base: 1, md: 2 }} />
                <Button
                  colorPalette="red"
                  onClick={handleDelete}
                  disabled={isApproving || isRejecting}
                  w={{ base: 'full', md: 'auto' }}
                  order={{ base: 3, md: 3 }}
                >
                  削除
                </Button>
                {data?.status === ReservationStatus.PENDING && (
                  <Button
                    colorPalette="orange"
                    onClick={handleReject}
                    loading={isRejecting}
                    w={{ base: 'full', md: 'auto' }}
                    order={{ base: 2, md: 4 }}
                  >
                    却下
                  </Button>
                )}
                {(data?.status === ReservationStatus.PENDING ||
                  data?.status === ReservationStatus.RETURNED) && (
                  <Button
                    colorPalette="green"
                    onClick={handleConfirm}
                    loading={isApproving}
                    w={{ base: 'full', md: 'auto' }}
                    order={{ base: 1, md: 5 }}
                  >
                    {data?.status === ReservationStatus.RETURNED ? '返却承認' : '承認'}
                  </Button>
                )}
              </Footer>
            </Content>
          </Positioner>
        </Portal>

        <DeleteConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          reservationId={data?.id}
        />

        {/* 画像拡大モーダル */}
        {selectedImage && (
          <Dialog.Root open onOpenChange={handleCloseImageModal}>
            <Portal>
              <Dialog.Backdrop bg="blackAlpha.800" />
              <Dialog.Positioner>
                <Dialog.Content maxW="90vw" maxH="90vh" bg="transparent" shadow="none" p={0}>
                  <Box position="relative" textAlign="center">
                    <Image
                      src={selectedImage.url}
                      alt={`予約${data?.id}の部屋返却画像${selectedImage.index + 1}（拡大表示）`}
                      maxW="100%"
                      maxH="90vh"
                      objectFit="contain"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={handleCloseImageModal}
                    />
                    <Button
                      position="absolute"
                      top={2}
                      right={2}
                      size="sm"
                      colorPalette="gray"
                      variant="solid"
                      onClick={handleCloseImageModal}
                      bg="blackAlpha.700"
                      color="white"
                      _hover={{ bg: 'blackAlpha.800' }}
                    >
                      ✕
                    </Button>
                    <Box
                      position="absolute"
                      bottom={4}
                      left="50%"
                      transform="translateX(-50%)"
                      bg="blackAlpha.700"
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                    >
                      画像 {selectedImage.index + 1} / {data?.returnImageUrls?.length || 0}
                    </Box>
                  </Box>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )}
      </Root>
    );
  } catch (error) {
    console.error('ReservationDetail rendering error:', error);
    return (
      <Root open onOpenChange={() => onClose()}>
        <Portal>
          <Backdrop />
          <Positioner>
            <Content>
              <Header>
                <Heading>エラー</Heading>
              </Header>
              <Body>
                <Text color="red.500">予約詳細の表示中にエラーが発生しました。</Text>
              </Body>
              <Footer>
                <Button onClick={onClose}>閉じる</Button>
              </Footer>
            </Content>
          </Positioner>
        </Portal>
      </Root>
    );
  }
};

export default ReservationDetail;
