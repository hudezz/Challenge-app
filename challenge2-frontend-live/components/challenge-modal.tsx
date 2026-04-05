'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Challenge, CreateChallengeDTO } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const challengeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  month: z.string().min(1, 'Month is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  status: z.enum(['active', 'completed', 'upcoming']),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChallengeDTO) => Promise<void>;
  challenge?: Challenge | null;
  isLoading?: boolean;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function ChallengeModal({
  isOpen,
  onClose,
  onSubmit,
  challenge,
  isLoading = false,
}: ChallengeModalProps) {
  const isEditing = !!challenge;
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: '',
      description: '',
      month: '',
      difficulty: 'medium',
      status: 'upcoming',
    },
  });

  useEffect(() => {
    if (challenge) {
      reset({
        title: challenge.title,
        description: challenge.description,
        month: challenge.month,
        difficulty: challenge.difficulty,
        status: challenge.status,
      });
    } else {
      reset({
        title: '',
        description: '',
        month: '',
        difficulty: 'medium',
        status: 'upcoming',
      });
    }
  }, [challenge, reset]);

  const handleFormSubmit = async (data: ChallengeFormData) => {
    await onSubmit(data);
    reset();
  };

  const difficulty = watch('difficulty');
  const status = watch('status');
  const month = watch('month');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500" />
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {isEditing ? 'Edit Challenge' : 'New Challenge'}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input
                    {...register('title')}
                    placeholder="Enter challenge title..."
                    className={cn(
                      'bg-secondary/50 border-border/50 focus:border-violet-500/50 focus:ring-violet-500/20',
                      errors.title && 'border-destructive'
                    )}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title.message}</p>
                  )}
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    {...register('description')}
                    placeholder="Describe the challenge..."
                    rows={3}
                    className={cn(
                      'bg-secondary/50 border-border/50 focus:border-violet-500/50 focus:ring-violet-500/20 resize-none',
                      errors.description && 'border-destructive'
                    )}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>
                
                {/* Month */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Month</label>
                  <Select value={month} onValueChange={(value) => setValue('month', value)}>
                    <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-violet-500/50 focus:ring-violet-500/20">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      {months.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.month && (
                    <p className="text-xs text-destructive">{errors.month.message}</p>
                  )}
                </div>
                
                {/* Difficulty & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Difficulty</label>
                    <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setValue('difficulty', value)}>
                      <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-violet-500/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <Select value={status} onValueChange={(value: 'active' | 'completed' | 'upcoming') => setValue('status', value)}>
                      <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-violet-500/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50">
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? 'Update' : 'Create'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
