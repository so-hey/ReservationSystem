import { Box, Table, Badge } from '@chakra-ui/react';
import { ReservationDetailResponse } from '@/shared/types';
import { formatRoomLabel, formatTimeToHHMM, formatDateOnly, getStatusBadgeInfo } from '@/shared/utils';

interface ReservationDetailTableProps {
  data?: ReservationDetailResponse;
}

const TABLE_HEADERS = [
  'ID',
  '団体名',
  '予約者氏名',
  '学籍番号',
  'メールアドレス',
  '部屋',
  '人数',
  '目的',
  '使用開始日時',
  '使用終了日時',
  '予約申請日時',
  '状態',
  '実際の返却日時',
] as const;

const TABLE_STYLES = {
  container: {
    width: '100%',
    overflowY: 'auto' as const,
    border: '1px solid',
    borderColor: 'gray.50',
    borderRadius: 'md',
  },
  table: {
    size: 'sm' as const,
    variant: 'outline' as const,
    bg: 'gray.100',
    rounded: '2px',
    overflowX: 'scroll' as const,
    stickyHeader: true,
    interactive: true,
    showColumnBorder: true,
  },
  header: {
    fontSize: '0.8rem',
  },
  row: {
    height: '1.6rem',
    fontSize: '0.8rem',
    transitionProperty: 'background-color',
    transitionDuration: '0.1s',
    transitionTimingFunction: 'ease-out',
  },
  columnHeader: {
    textAlign: 'center' as const,
    fontWeight: 'bold',
    bg: 'gray.300',
  },
  cell: {
    textAlign: 'center' as const,
  },
} as const;

const ReservationDetailTable = ({ data }: ReservationDetailTableProps) => {
  return (
    <Box {...TABLE_STYLES.container}>
      <Table.ScrollArea borderWidth="1px">
        <Table.Root {...TABLE_STYLES.table}>
          <Table.ColumnGroup>
            <Table.Column htmlWidth="5%" />
          </Table.ColumnGroup>
          <Table.Header {...TABLE_STYLES.header}>
            <Table.Row>
              {TABLE_HEADERS.map((header, idx) => (
                <Table.ColumnHeader key={idx} {...TABLE_STYLES.columnHeader}>
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row {...TABLE_STYLES.row}>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.id}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.clubName || '個人利用'}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.reservatorName}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.studentId}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.email}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.room ? formatRoomLabel(data.room) : ''}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.numPeople}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.purpose}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.startTime ? formatTimeToHHMM(data.startTime) : ''}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.endTime ? formatTimeToHHMM(data.endTime) : ''}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.createdAt ? `${formatDateOnly(data.createdAt)} ${formatTimeToHHMM(data.createdAt)}` : ''}</Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>
                {data?.status
                  ? (() => { const { color, label, variant } = getStatusBadgeInfo(String(data.status)); return <Badge colorPalette={color} variant={variant}>{label}</Badge>; })()
                  : ''}
              </Table.Cell>
              <Table.Cell {...TABLE_STYLES.cell}>{data?.returnTime ? `${formatDateOnly(data.returnTime)} ${formatTimeToHHMM(data.returnTime)}` : '-'}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};

export default ReservationDetailTable;
