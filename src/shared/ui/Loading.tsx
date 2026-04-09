import { Center, Spinner } from '@chakra-ui/react';

interface LoadingProps {
  children: React.ReactNode;
  loading: boolean;
}

/**
 * ローディングスピナーを表示するコンポーネント
 */
export const Loading = ({ children, loading }: LoadingProps) => {
  return (
    <>
      {loading ? (
        <Center height="100vh">
          <Spinner size="lg" />
        </Center>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
