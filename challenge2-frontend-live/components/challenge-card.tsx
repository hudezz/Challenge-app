'use client';

import { motion } from 'framer-motion';
import { Pencil, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { Challenge } from '@/lib/api';
import { cn } from '@/lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
  onEdit: (challenge: Challenge) => void;
  onDelete: (challenge: Challenge) => void;
}

const difficultyColors = {
  easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  hard: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

const statusColors = {
  active: 'bg-violet-500/20 text-violet-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
  upcoming: 'bg-slate-500/20 text-slate-400',
};

export function ChallengeCard({ challenge, index, onEdit, onDelete }: ChallengeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />
      
      {/* Card */}
      <div className="relative h-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-full border',
                difficultyColors[challenge.difficulty]
              )}>
                {challenge.difficulty}
              </span>
              <span className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-full',
                statusColors[challenge.status]
              )}>
                {challenge.status}
              </span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(challenge)}
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(challenge)}
                className="p-2 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          {/* Title & Description */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
            {challenge.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
            {challenge.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{challenge.month}</span>
            </div>
            {challenge.progress !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-violet-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{challenge.progress}%</span>
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          {challenge.progress !== undefined && (
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${challenge.progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
