import { useState } from 'react';
import { ReservationListResponse } from '@/shared/types';

const ITEMS_PER_PAGE = 10;

export const useReservationPagination = (sortedData: ReservationListResponse[]) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.max(Math.ceil(sortedData.length / ITEMS_PER_PAGE), 1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return { currentPage, totalPages, paginatedItems, handlePageChange };
};
