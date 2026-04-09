import { useNavigate } from 'react-router-dom';
import { Box, VStack, Text, Button, Heading } from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';

export default function NotFound() {
  const navigate = useNavigate();

  // ページロード時にトップにスクロール
  useScrollToTop();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box p={8} maxW="600px" mx="auto" textAlign="center">
      <VStack gap={8}>
        <VStack gap={4}>
          <Heading size="4xl" color="red.500">
            404
          </Heading>
          <Heading size="xl" color="gray.700">
            ページが見つかりません
          </Heading>
          <Text color="gray.600" fontSize="lg">
            お探しのページは存在しないか、移動された可能性があります
          </Text>
        </VStack>

        <Button size="lg" colorPalette="blue" onClick={handleGoHome}>
          <FaHome style={{ marginRight: '8px' }} />
          トップページに戻る
        </Button>
      </VStack>
    </Box>
  );
}
