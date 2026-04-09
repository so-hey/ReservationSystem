import { Box, HStack, Heading, Button, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { LuShield, LuLogOut } from 'react-icons/lu';
import { useAuth } from '@/features/auth/hooks/useAuth';

const MotionBox = motion.create(Box);

export default function AdminHeader() {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      logout();
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* PC表示: タイトル中央、ログアウトボタン右端 */}
      <Box display={{ base: 'none', md: 'block' }} position="relative" mb={6}>
        {/* 中央のタイトル */}
        <HStack justify="center" gap={3}>
          <LuShield size="32px" color="blue.600" />
          <Heading size="2xl" color="blue.600">
            管理者画面
          </Heading>
        </HStack>

        {/* 右端のログアウトボタン（絶対位置） */}
        <Box position="absolute" top="0" right="0">
          <Button colorScheme="red" variant="outline" size="sm" onClick={handleLogout}>
            <HStack gap={2}>
              <LuLogOut size="14px" />
              <Text>ログアウト</Text>
            </HStack>
          </Button>
        </Box>
      </Box>

      {/* スマホ表示: 縦並び */}
      <Box display={{ base: 'block', md: 'none' }} mb={6} position="relative">
        <HStack justify="center" gap={2}>
          <LuShield size="28px" color="blue.600" />
          <Heading size="xl" color="blue.600">
            管理者画面
          </Heading>
        </HStack>

        {/* 右端のログアウトボタン（アイコンのみ） */}
        <Box position="absolute" top="0" right="0">
          <Button colorScheme="red" variant="outline" size="sm" onClick={handleLogout} px={2}>
            <LuLogOut size="16px" />
          </Button>
        </Box>
      </Box>
    </MotionBox>
  );
}
