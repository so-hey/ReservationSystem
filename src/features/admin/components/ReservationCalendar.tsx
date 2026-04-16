import { Box, VStack, HStack, Heading, Button, Badge, Text, Grid, Card } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { ReservationListResponse } from '@/shared/types';
import { formatRoomLabel, getStatusBadgeInfo, getActualStatus } from '@/shared/utils';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';

interface ReservationCalendarProps {
  data: ReservationListResponse[];
  onSelectReservation: (id: number) => void;
}

// 曜日の配列（日〜土）
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function ReservationCalendar({
  data,
  onSelectReservation,
}: ReservationCalendarProps) {
  const { year, month, calendarDays, isToday, handlePrevMonth, handleNextMonth, handleToday } =
    useCalendarNavigation(data);

  return (
    <VStack width="100%" gap={{ base: 2, md: 4 }} align="stretch">
      {/* ヘッダー */}
      <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
        <Button size="sm" variant="outline" onClick={handlePrevMonth}>
          <LuChevronLeft />
          <Box display={{ base: 'none', md: 'inline' }}>前月</Box>
        </Button>
        <VStack gap={0}>
          <Heading size={{ base: 'md', md: 'lg' }}>
            {year}年 {month + 1}月
          </Heading>
        </VStack>
        <HStack gap={2}>
          <Button size="sm" variant="outline" onClick={handleToday}>
            今日
          </Button>
          <Button size="sm" variant="outline" onClick={handleNextMonth}>
            <Box display={{ base: 'none', md: 'inline' }}>次月</Box>
            <LuChevronRight />
          </Button>
        </HStack>
      </HStack>

      {/* カレンダー */}
      <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden" bg="white">
        {/* 曜日ヘッダー */}
        <Grid templateColumns="repeat(7, 1fr)" bg="gray.100" w="100%">
          {WEEKDAYS.map((day, index) => (
            <Box
              key={day}
              p={{ base: 1, md: 2 }}
              textAlign="center"
              fontWeight="bold"
              fontSize={{ base: 'xs', md: 'sm' }}
              borderRight={index < 6 ? '1px solid' : 'none'}
              borderColor="gray.200"
              color={index === 0 ? 'red.500' : index === 6 ? 'blue.500' : 'gray.700'}
              minW={0}
            >
              {day}
            </Box>
          ))}
        </Grid>

        {/* 日付グリッド */}
        <Grid templateColumns="repeat(7, 1fr)" w="100%">
          {calendarDays.map((day, index) => {
            const isSat = day.dayOfWeek === 6;
            const isSun = day.dayOfWeek === 0;
            const isWeekend = isSat || isSun;
            const weekendBg = isSat ? 'blue.50' : 'red.50';
            const weekendHoverBg = isSat ? 'blue.100' : 'red.100';
            return (
            <Box
              key={index}
              minH={{ base: '80px', md: '100px' }}
              p={{ base: 1, md: 2 }}
              borderRight={(index + 1) % 7 !== 0 ? '1px solid' : 'none'}
              borderBottom={index < calendarDays.length - 7 ? '1px solid' : 'none'}
              borderColor="gray.200"
              bg={day.date === null ? 'gray.50' : isToday(day.date) ? 'blue.50' : isWeekend ? weekendBg : 'white'}
              outline={isToday(day.date) ? '2px solid' : undefined}
              outlineColor={isToday(day.date) ? 'blue.400' : undefined}
              outlineOffset="-2px"
              _hover={day.date !== null ? { bg: isToday(day.date) ? 'blue.100' : isWeekend ? weekendHoverBg : 'gray.50' } : undefined}
              position="relative"
              minW={0}
              overflow="hidden"
            >
              {day.date !== null && (
                <>
                  {/* 日付 */}
                  <Text
                    fontWeight={isToday(day.date) ? 'bold' : 'normal'}
                    color={isToday(day.date) ? 'white' : isSat ? 'blue.500' : isSun ? 'red.500' : 'gray.700'}
                    bg={isToday(day.date) ? 'blue.500' : 'transparent'}
                    borderRadius="full"
                    w={{ base: '20px', md: '24px' }}
                    h={{ base: '20px', md: '24px' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    mb={1}
                  >
                    {day.date}
                  </Text>

                  {/* 予約バッジ */}
                  <VStack gap={1} align="stretch">
                    {day.reservations.slice(0, 3).map((reservation) => {
                        const { color, variant } = getStatusBadgeInfo(getActualStatus(reservation));
                        return (
                          <Badge
                            key={reservation.id}
                            colorPalette={color}
                            variant={variant}
                            size="xs"
                            cursor="pointer"
                            onClick={() => onSelectReservation(reservation.id)}
                            _hover={{ opacity: 0.8 }}
                            textOverflow="ellipsis"
                            overflow="hidden"
                            whiteSpace="nowrap"
                            fontSize={{ base: '0.6rem', md: '0.75rem' }}
                            px={{ base: 0.5, md: 1 }}
                            w="100%"
                          >
                            {formatRoomLabel(reservation.room)} {reservation.startTime}
                          </Badge>
                        );
                      })}
                    {day.reservations.length > 3 && (
                      <Text
                        fontSize={{ base: '0.6rem', md: 'xs' }}
                        color="gray.500"
                        textAlign="center"
                      >
                        +{day.reservations.length - 3}件
                      </Text>
                    )}
                  </VStack>
                </>
              )}
            </Box>
            );
          })}
        </Grid>
      </Box>

      {/* 凡例 */}
      <Card.Root size="sm">
        <Card.Body>
          <HStack wrap="wrap" gap={2} justify={{ base: 'center', md: 'flex-start' }}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              mr={2}
              w={{ base: '100%', md: 'auto' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              凡例:
            </Text>
            {[
              'PENDING',
              'APPROVED',
              'USING',
              'WAITED',
              'RETURNED',
              'COMPLETED',
              'CANCELLED',
              'REJECTED',
            ].map((status) => {
              const { color, label, variant } = getStatusBadgeInfo(status);
              return (
                <HStack key={status} gap={1}>
                  <Badge colorPalette={color} variant={variant} size="sm" fontSize={{ base: 'xs', md: 'sm' }}>
                    {label}
                  </Badge>
                </HStack>
              );
            })}
          </HStack>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
}
