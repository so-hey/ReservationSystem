import { useState } from 'react';
import { Box, Stack, Table, VStack, Button, HStack, Badge, Tabs } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  LuRefreshCw,
  LuClock,
  LuCheck,
  LuPlay,
  LuPackage,
  LuX,
  LuTable,
  LuCalendar,
  LuArrowUpDown,
  LuArrowUp,
} from 'react-icons/lu';
import ReservationsTablePagination from './ReservationsTablePagination';
import ReservationCalendar from './ReservationCalendar';
import { formatRoomLabel, getStatusBadgeInfo, getActualStatus } from '@/shared/utils';
import ReservationDetail from './ReservationDetail';
import { useReservationList } from '../hooks/useReservationList';
import { useReservationSort } from '../hooks/useReservationSort';
import { useReservationPagination } from '../hooks/useReservationPagination';

const MotionTableRow = motion.create(Table.Row);

export default function ReservationsTable() {
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [openDetailId, setOpenDetailId] = useState<number | null>(null);

  const { data, loading, handleRefresh, triggerReload } = useReservationList();
  const { sortKey, setSortKey, sortOrder, setSortOrder, sortedData } = useReservationSort(data);
  const { currentPage, totalPages, paginatedItems, handlePageChange } = useReservationPagination(sortedData);

  const onCloseDetail = () => {
    setOpenDetailId(null);
    triggerReload();
  };

  const getStatusBadgeProps = (status: string) => {
    const { color, label, variant } = getStatusBadgeInfo(status);
    const iconMap: Record<string, React.ReactNode> = {
      'PENDING':   <LuClock size={12} />,
      'APPROVED':  <LuCheck size={12} />,
      'USING':     <LuPlay size={12} />,
      'WAITED':    <LuClock size={12} />,
      'RETURNED':  <LuPackage size={12} />,
      'COMPLETED': <LuPackage size={12} />,
      'CANCELLED': <LuX size={12} />,
      'REJECTED':  <LuX size={12} />,
    };
    return { colorPalette: color, variant, text: label, icon: iconMap[status] ?? null };
  };

  return (
    <VStack width="100%">
      {/* 更新ボタンと表示切り替え */}
      <HStack width="100%" justify="space-between" mb={2} gap={2}>
        <Tabs.Root
          value={viewMode}
          onValueChange={(e) => setViewMode(e.value as 'table' | 'calendar')}
        >
          <Tabs.List>
            <Tabs.Trigger value="table" fontSize={{ base: 'xs', md: 'sm' }}>
              <Box display={{ base: 'none', md: 'inline' }} mr={1}>
                <LuTable />
              </Box>
              テーブル
            </Tabs.Trigger>
            <Tabs.Trigger value="calendar" fontSize={{ base: 'xs', md: 'sm' }}>
              <Box display={{ base: 'none', md: 'inline' }} mr={1}>
                <LuCalendar />
              </Box>
              カレンダー
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <Button
          onClick={handleRefresh}
          colorScheme="blue"
          size="sm"
          variant="outline"
          loading={loading}
          px={{ base: 2, md: 4 }}
        >
          <LuRefreshCw />
          <Box display={{ base: 'none', md: 'inline' }} ml={1}>
            更新
          </Box>
        </Button>
      </HStack>

      {/* テーブル表示 */}
      {viewMode === 'table' && (
        <>
          {/* テーブル本体：高さを固定し、中でスクロール */}
          <Box
            width="100%"
            overflowY="auto"
            border="1px solid"
            borderColor="gray.50"
            borderRadius="md"
            minH={`${Math.min(paginatedItems.length, 10) * 1.6 + 3}rem`}
          >
            <Table.ScrollArea borderWidth="1px">
              <Table.Root
                size="sm"
                variant="outline"
                bg="gray.100"
                rounded="2px"
                overflowX="scroll"
                stickyHeader
                interactive
                showColumnBorder
              >
                <Table.ColumnGroup>
                  <Table.Column htmlWidth="5%" />
                </Table.ColumnGroup>
                <Table.Header fontSize="0.8rem">
                  <Table.Row>
                    <Table.ColumnHeader textAlign="center" fontWeight="bold" bg="gray.300">
                      <HStack justify="center" gap={1}>
                        <span>ID</span>
                        <Box
                          as="button"
                          onClick={() => { setSortKey('id'); setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc'); }}
                          cursor="pointer"
                          _hover={{ color: 'blue.500' }}
                        >
                          <LuArrowUpDown size={12} />
                        </Box>
                      </HStack>
                    </Table.ColumnHeader>
                    {[
                      '団体名',
                      '予約者氏名',
                      '人数',
                      '部屋',
                      '使用日',
                      '使用開始時間',
                      '使用終了時間',
                    ].map((header, idx) => (
                      <Table.ColumnHeader
                        key={idx}
                        textAlign="center"
                        fontWeight="bold"
                        bg="gray.300"
                      >
                        {header}
                      </Table.ColumnHeader>
                    ))}
                    <Table.ColumnHeader textAlign="center" fontWeight="bold" bg="gray.300">
                      <HStack justify="center" gap={1}>
                        <span>状態</span>
                        <Box
                          as="button"
                          onClick={() => { if (sortKey !== 'status') setSortKey('status'); }}
                          cursor="pointer"
                          _hover={{ color: 'blue.500' }}
                        >
                          <LuArrowUp size={12} />
                        </Box>
                      </HStack>
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {paginatedItems.map((item, index) => {
                    const actualStatus = getActualStatus(item);
                    const rowBg =
                      actualStatus === 'PENDING' || actualStatus === 'RETURNED' ? 'orange.50'   : undefined;
                    const rowHoverBg =
                      actualStatus === 'PENDING' || actualStatus === 'RETURNED' ? 'orange.100'   : undefined;
                    return (
                    <MotionTableRow
                      height="1.6rem"
                      // chakra用
                      fontSize="0.8rem"
                      transitionProperty="background-color"
                      transitionDuration="0.1s"
                      transitionTimingFunction="ease-out"
                      bg={rowBg}
                      _hover={rowHoverBg ? { bg: rowHoverBg } : undefined}
                      // framer-motion用
                      key={`${sortKey}-${sortOrder}-${item.id}`}
                      initial={{ opacity: 0, x: 0, y: 4 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: 'easeOut',
                      }}
                      onClick={() => setOpenDetailId(item.id)}
                    >
                      <Table.Cell textAlign="center">{item.id}</Table.Cell>
                      <Table.Cell textAlign="center">{item.clubName || '個人利用'}</Table.Cell>
                      <Table.Cell textAlign="center">{item.reservatorName}</Table.Cell>
                      <Table.Cell textAlign="center">{item.numPeople}</Table.Cell>
                      <Table.Cell textAlign="center">{formatRoomLabel(item.room)}</Table.Cell>
                      <Table.Cell textAlign="center">{item.reservationDate}</Table.Cell>
                      <Table.Cell textAlign="center">{item.startTime}</Table.Cell>
                      <Table.Cell textAlign="center">{item.endTime}</Table.Cell>
                      <Table.Cell textAlign="center">
                        {(() => {
                          const badgeProps = getStatusBadgeProps(actualStatus);
                          return (
                            <Badge
                              colorPalette={badgeProps.colorPalette}
                              variant={badgeProps.variant}
                              size="sm"
                              display="inline-flex"
                              alignItems="center"
                              gap={1}
                            >
                              {badgeProps.icon}
                              {badgeProps.text}
                            </Badge>
                          );
                        })()}
                      </Table.Cell>
                    </MotionTableRow>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>

          {/* ページネーションは常に下に固定 */}
          <Stack align="center" width="100%" my={4}>
            <ReservationsTablePagination
              currentPage={currentPage}
              itemsPerPage={10}
              itemLength={sortedData.length}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Stack>
        </>
      )}

      {/* カレンダー表示 */}
      {viewMode === 'calendar' && (
        <ReservationCalendar data={sortedData} onSelectReservation={setOpenDetailId} />
      )}

      {openDetailId && <ReservationDetail id={openDetailId} onClose={onCloseDetail} />}
    </VStack>
  );
}
