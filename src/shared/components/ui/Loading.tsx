import { Center, Spinner } from '@chakra-ui/react';

export default function Loading({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) {
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
}
