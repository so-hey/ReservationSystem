import { Box, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Footer from '@/shared/components/layout/Footer';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <Stack w="100%" minH="100vh" bgColor={{ base: 'white', md: 'gray.100' }} align="center">
      <Box
        w="full"
        maxW={{ base: '100%', md: '46em', lg: '60em' }}
        bgColor="white"
        borderRadius={{ base: 'none', md: 'lg' }}
        my={{ base: 0, md: '1em' }}
        px={{ base: '0.75em', md: '1em' }}
        py={{ base: '1em', md: '2em' }}
        boxShadow={{ base: 'none', md: 'sm' }}
        display="flex"
        flexDirection="column"
        minH={{ base: '100vh', md: 'calc(100vh - 2em)' }}
      >
        <Box flex="1">{children}</Box>
        <Footer />
      </Box>
    </Stack>
  );
}
