import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Text,
  Alert,
  Card,
  Field,
  HStack,
  IconButton,
} from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { LuArrowLeft, LuLogIn, LuEye, LuEyeOff } from 'react-icons/lu';
import { LuLogIn, LuEye, LuEyeOff } from 'react-icons/lu';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '@/shared/api';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  // const navigate = useNavigate();

  // const handleGoHome = () => {
  //   navigate('/');
  // };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('ユーザー名またはパスワードが正しくありません');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('ログインに失敗しました。再度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Card.Root maxW="md" w="full" m={2} p={2}>
        <Card.Header>
          <Heading textAlign="center" size="lg" mb={2}>
            管理者ログイン
          </Heading>
          <Text textAlign="center" color="gray.600">
            管理画面にアクセスするにはログインが必要です
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              {error && (
                <Alert.Root status="error">
                  <Alert.Title>{error}</Alert.Title>
                </Alert.Root>
              )}

              <Field.Root>
                <Field.Label htmlFor="username">ユーザー名</Field.Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ユーザー名を入力"
                  required
                />
              </Field.Root>

              <Field.Root>
                <Field.Label htmlFor="password">パスワード</Field.Label>
                <Box position="relative" w="full">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワードを入力"
                    required
                    pr="12"
                    w="full"
                  />
                  <IconButton
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    size="sm"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'パスワードを非表示' : 'パスワードを表示'}
                  >
                    {showPassword ? <LuEyeOff /> : <LuEye />}
                  </IconButton>
                </Box>
              </Field.Root>

              <Button type="submit" colorScheme="blue" size="lg" w="full" loading={loading}>
                <HStack gap={2}>
                  <LuLogIn />
                  <Text>ログイン</Text>
                </HStack>
              </Button>

              {/* 控えめなホームに戻るボタン */}
              {/* <Box textAlign="center" mt={2}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoHome}
                  color="gray.400"
                  fontSize="xs"
                  _hover={{ color: 'gray.600' }}
                >
                  <HStack gap={1}>
                    <LuArrowLeft size="12px" />
                    <Text>ホームに戻る</Text>
                  </HStack>
                </Button>
              </Box> */}
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};
