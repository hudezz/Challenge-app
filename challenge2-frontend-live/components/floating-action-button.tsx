'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 z-40 group"
    >
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 animate-ping opacity-30" />
      
      {/* Glow */}
      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-40 blur-xl group-hover:opacity-60 transition-opacity" />
      
      {/* Button */}
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30">
        <Plus className="w-6 h-6 text-white transition-transform group-hover:rotate-90 duration-300" />
      </div>
    </motion.button>
  );
}
