import type { ReactNode } from 'react';
import { cn } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';

interface CollapseProps {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
}

export default function Collapse(props: CollapseProps) {
  const { children, className, isOpen } = props;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          animate={{ height: 'auto', opacity: 1 }}
          className={cn('overflow-hidden', className)}
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
