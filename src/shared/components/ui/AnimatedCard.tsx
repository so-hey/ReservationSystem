import { ReactNode } from 'react';
import { Card } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card.Root);

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
}

export default function AnimatedCard({ children, delay = 0.1 }: AnimatedCardProps) {
  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </MotionCard>
  );
}
