'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  index?: number;
}

export function StatsCard({ title, value, icon: Icon, trend, className, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn('group relative', className)}
    >
      {/* Subtle glow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
      
      <div className="relative h-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn(
                'text-xs mt-1',
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}% from last month
              </p>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-colors">
            <Icon className="w-5 h-5 text-violet-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
