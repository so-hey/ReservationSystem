import { ReactNode } from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';
import Loading from '@/shared/components/ui/Loading';

const MotionBox = motion.create(Box);

interface PageContainerProps {
  children: ReactNode;
  title: string;
  titleColor?: string;
  subtitle?: string;
  loading?: boolean;
  maxWidth?: string;
}

export default function PageContainer({
  children,
  title,
  titleColor = 'blue.500',
  subtitle,
  loading = false,
}: PageContainerProps) {
  // ページロード時にトップにスクロール
  useScrollToTop();

  return (
    <Loading loading={loading}>
      <Box p={2} maxW="800px" mx="auto">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack gap={6} align="stretch">
            {/* ヘッダー */}
            <Box textAlign="center">
              <Heading
                size="xl"
                color={titleColor}
                mb={2}
                maxW={{ base: '300px', md: 'none' }}
                mx="auto"
                lineHeight={1.2}
                wordBreak="auto-phrase"
              >
                {title}
              </Heading>
              {subtitle && (
                <Text color="gray.600" fontSize="lg">
                  {subtitle}
                </Text>
              )}
            </Box>

            {/* コンテンツ */}
            {children}
          </VStack>
        </MotionBox>
      </Box>
    </Loading>
  );
}
