import { ReactNode } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

interface PageActionsProps {
  children: ReactNode;
  delay?: number;
}

export default function PageActions({ children, delay = 0.3 }: PageActionsProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <HStack justify="center" gap={4}>
        {children}
      </HStack>
    </MotionBox>
  );
}
