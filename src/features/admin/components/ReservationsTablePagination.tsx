import { Pagination, IconButton, HStack, Text } from '@chakra-ui/react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

type Props = {
  currentPage: number;
  itemsPerPage: number;
  itemLength: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const ReservationsTablePagination = ({
  currentPage,
  itemsPerPage,
  itemLength,
  totalPages,
  onPageChange,
}: Props) => {
  return (
    <Pagination.Root
      page={currentPage}
      pageSize={itemsPerPage}
      count={itemLength}
      onPageChange={(details: { page: number }) => {
        onPageChange(details.page);
      }}
      maxW="240px"
    >
      <HStack justify="center" alignItems="center" gap={2} minW="180px">
        {/* 前のページボタン：固定幅で位置を確保 */}
        <HStack w="40px" justify="center">
          {currentPage > 1 && (
            <Pagination.PrevTrigger asChild>
              <IconButton aria-label="前のページ" size="sm" variant="ghost">
                <IoChevronBack />
              </IconButton>
            </Pagination.PrevTrigger>
          )}
        </HStack>

        {/* ページ情報：中央固定 */}
        <HStack gap={1} minW="60px" justify="center">
          <Text as="span" fontSize="sm" fontWeight="medium">
            {currentPage}
          </Text>
          <Text as="span" fontSize="sm" color="gray.500">
            /
          </Text>
          <Text as="span" fontSize="sm" fontWeight="medium">
            {totalPages}
          </Text>
        </HStack>

        {/* 次のページボタン：固定幅で位置を確保 */}
        <HStack w="40px" justify="center">
          {currentPage < totalPages && (
            <Pagination.NextTrigger asChild>
              <IconButton aria-label="次のページ" size="sm" variant="ghost">
                <IoChevronForward />
              </IconButton>
            </Pagination.NextTrigger>
          )}
        </HStack>
      </HStack>
    </Pagination.Root>
  );
};

export default ReservationsTablePagination;
