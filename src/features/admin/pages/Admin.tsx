import { Box, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import ReservationsTable from '../components/ReservationsTable';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';

const MotionBox = motion.create(Box);

export default function Admin() {
  // ページロード時にトップにスクロール
  useScrollToTop();

  return (
    <Box p={{ base: 1, md: 8 }} maxW="1200px" mx="auto">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack gap={{ base: 3, md: 6 }} align="stretch">
          <AdminHeader />
          <ReservationsTable />
        </VStack>
      </MotionBox>
    </Box>
  );
}
