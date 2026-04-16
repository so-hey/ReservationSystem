import { useCallback, useMemo, useState } from 'react';
import { ReservationListResponse } from '@/shared/types';
import { getActualStatus } from '@/shared/utils';

const STATUS_PRIORITY: Record<string, number> = {
  PENDING:   0,
  RETURNED:  0,
  APPROVED:  1,
  USING:     1,
  WAITED:    1,
  COMPLETED: 2,
  CANCELLED: 2,
  REJECTED:  2,
};

export const useReservationSort = (data: ReservationListResponse[]) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortKey, setSortKey] = useState<'id' | 'status'>('id');

  const getStatusPriority = useCallback((item: ReservationListResponse) => {
    return STATUS_PRIORITY[getActualStatus(item)] ?? 1;
  }, []);

  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) => {
        if (sortKey === 'status') {
          const pd = getStatusPriority(a) - getStatusPriority(b);
          if (pd !== 0) return pd;
          return b.id - a.id;
        }
        return sortOrder === 'desc' ? b.id - a.id : a.id - b.id;
      }),
    [data, sortKey, sortOrder, getStatusPriority],
  );

  return { sortKey, setSortKey, sortOrder, setSortOrder, sortedData };
};
