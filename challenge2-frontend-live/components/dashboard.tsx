'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Flame, Calendar, Zap } from 'lucide-react';
import { api, Challenge, CreateChallengeDTO, ApiError } from '@/lib/api';
import { ChallengeCard } from './challenge-card';
import { ChallengeModal } from './challenge-modal';
import { SearchFilter } from './search-filter';
import { FloatingActionButton } from './floating-action-button';
import { DeleteDialog } from './delete-dialog';
import { StatsCard } from './stats-card';
import { useToast } from '@/hooks/use-toast';

// Mock data for demo purposes when API is unavailable
const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: '30-Day Fitness Challenge',
    description: 'Complete a workout every day for 30 days. Build strength, endurance, and healthy habits.',
    month: 'January',
    difficulty: 'medium',
    status: 'active',
    progress: 65,
  },
  {
    id: 2,
    title: 'Read 12 Books',
    description: 'Read one book per month throughout the year. Expand your knowledge and imagination.',
    month: 'February',
    difficulty: 'easy',
    status: 'completed',
    progress: 100,
  },
  {
    id: 3,
    title: 'Learn a New Language',
    description: 'Dedicate 30 minutes daily to learning Spanish. Achieve conversational fluency.',
    month: 'March',
    difficulty: 'hard',
    status: 'active',
    progress: 42,
  },
  {
    id: 4,
    title: 'Meditation Streak',
    description: 'Practice mindfulness meditation for 15 minutes every morning. Find your inner peace.',
    month: 'April',
    difficulty: 'easy',
    status: 'upcoming',
    progress: 0,
  },
  {
    id: 5,
    title: 'Code 100 Days',
    description: 'Write code every day for 100 days. Master new technologies and build projects.',
    month: 'May',
    difficulty: 'hard',
    status: 'active',
    progress: 78,
  },
  {
    id: 6,
    title: 'Healthy Eating Plan',
    description: 'Follow a balanced nutrition plan. Track macros and discover new healthy recipes.',
    month: 'June',
    difficulty: 'medium',
    status: 'upcoming',
    progress: 0,
  },
];

export function Dashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const { toast } = useToast();

  // Fetch all challenges
  const fetchChallenges = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getChallenges();
      setChallenges(data);
      setFilteredChallenges(data);
      setIsSearchMode(false);
    } catch (error) {
      console.log('[v0] API unavailable, using mock data:', error);
      // Use mock data when API is unavailable
      setChallenges(mockChallenges);
      setFilteredChallenges(mockChallenges);
      toast({
        title: 'Demo Mode',
        description: 'Using sample data. Connect your Spring Boot backend to see real data.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // Search by month
  const handleSearch = async (month: string) => {
    setIsSearching(true);
    try {
      const result = await api.getChallengeByMonth(month);
      setFilteredChallenges([result]);
      setIsSearchMode(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        // Filter mock data locally
        const filtered = challenges.filter(c => 
          c.month.toLowerCase().includes(month.toLowerCase())
        );
        setFilteredChallenges(filtered);
        setIsSearchMode(true);
        if (filtered.length === 0) {
          toast({
            title: 'No results',
            description: `No challenges found for "${month}"`,
            variant: 'destructive',
          });
        }
      } else {
        // Fallback to local filtering
        const filtered = challenges.filter(c => 
          c.month.toLowerCase().includes(month.toLowerCase())
        );
        setFilteredChallenges(filtered);
        setIsSearchMode(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setFilteredChallenges(challenges);
    setIsSearchMode(false);
  };

  // Create/Update challenge
  const handleSubmit = async (data: CreateChallengeDTO) => {
    setIsSubmitting(true);
    try {
      if (selectedChallenge) {
        // Update
        const updated = await api.updateChallenge(selectedChallenge.id, data);
        setChallenges(prev => prev.map(c => c.id === updated.id ? updated : c));
        setFilteredChallenges(prev => prev.map(c => c.id === updated.id ? updated : c));
        toast({ title: 'Success', description: 'Challenge updated successfully' });
      } else {
        // Create
        const created = await api.createChallenge(data);
        setChallenges(prev => [...prev, created]);
        setFilteredChallenges(prev => [...prev, created]);
        toast({ title: 'Success', description: 'Challenge created successfully' });
      }
      setIsModalOpen(false);
      setSelectedChallenge(null);
    } catch (error) {
      console.log('[v0] API error, simulating locally:', error);
      // Simulate locally for demo
      if (selectedChallenge) {
        const updated = { ...selectedChallenge, ...data };
        setChallenges(prev => prev.map(c => c.id === updated.id ? updated : c));
        setFilteredChallenges(prev => prev.map(c => c.id === updated.id ? updated : c));
        toast({ title: 'Success', description: 'Challenge updated (demo mode)' });
      } else {
        const newChallenge: Challenge = {
          ...data,
          id: Date.now(),
          progress: 0,
        };
        setChallenges(prev => [...prev, newChallenge]);
        setFilteredChallenges(prev => [...prev, newChallenge]);
        toast({ title: 'Success', description: 'Challenge created (demo mode)' });
      }
      setIsModalOpen(false);
      setSelectedChallenge(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete challenge
  const handleDelete = async () => {
    if (!selectedChallenge) return;
    setIsSubmitting(true);
    try {
      await api.deleteChallenge(selectedChallenge.id);
      setChallenges(prev => prev.filter(c => c.id !== selectedChallenge.id));
      setFilteredChallenges(prev => prev.filter(c => c.id !== selectedChallenge.id));
      toast({ title: 'Success', description: 'Challenge deleted successfully' });
      setIsDeleteOpen(false);
      setSelectedChallenge(null);
    } catch (error) {
      console.log('[v0] API error, simulating deletion:', error);
      // Simulate locally for demo
      setChallenges(prev => prev.filter(c => c.id !== selectedChallenge.id));
      setFilteredChallenges(prev => prev.filter(c => c.id !== selectedChallenge.id));
      toast({ title: 'Success', description: 'Challenge deleted (demo mode)' });
      setIsDeleteOpen(false);
      setSelectedChallenge(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats
  const stats = {
    total: challenges.length,
    active: challenges.filter(c => c.status === 'active').length,
    completed: challenges.filter(c => c.status === 'completed').length,
    avgProgress: Math.round(
      challenges.reduce((acc, c) => acc + (c.progress || 0), 0) / (challenges.length || 1)
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/50">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent"
                >
                  Challenge Hub
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground mt-1"
                >
                  Track and manage your personal challenges
                </motion.p>
              </div>
              
              <SearchFilter
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isSearching={isSearching}
              />
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {/* Stats Bento Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <StatsCard
              title="Total Challenges"
              value={stats.total}
              icon={Target}
              index={0}
            />
            <StatsCard
              title="Active"
              value={stats.active}
              icon={Flame}
              trend={{ value: 12, isPositive: true }}
              index={1}
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon={Trophy}
              trend={{ value: 8, isPositive: true }}
              index={2}
            />
            <StatsCard
              title="Avg. Progress"
              value={`${stats.avgProgress}%`}
              icon={Zap}
              trend={{ value: 5, isPositive: true }}
              index={3}
            />
          </motion.div>
          
          {/* Search Mode Indicator */}
          <AnimatePresence>
            {isSearchMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  <span>Showing filtered results</span>
                  <button
                    onClick={handleClearSearch}
                    className="text-violet-400 hover:text-violet-300 underline-offset-2 hover:underline"
                  >
                    Show all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Challenge Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-card/40 backdrop-blur-xl border border-border/30 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredChallenges.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredChallenges.map((challenge, index) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    index={index}
                    onEdit={(c) => {
                      setSelectedChallenge(c);
                      setIsModalOpen(true);
                    }}
                    onDelete={(c) => {
                      setSelectedChallenge(c);
                      setIsDeleteOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="p-4 rounded-full bg-secondary/50 mb-4">
                <Target className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No challenges found
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {isSearchMode
                  ? 'Try a different search term or clear the filter to see all challenges.'
                  : 'Create your first challenge to get started on your journey!'}
              </p>
            </motion.div>
          )}
        </main>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => {
          setSelectedChallenge(null);
          setIsModalOpen(true);
        }}
      />
      
      {/* Create/Edit Modal */}
      <ChallengeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChallenge(null);
        }}
        onSubmit={handleSubmit}
        challenge={selectedChallenge}
        isLoading={isSubmitting}
      />
      
      {/* Delete Confirmation */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedChallenge(null);
        }}
        onConfirm={handleDelete}
        challenge={selectedChallenge}
        isLoading={isSubmitting}
      />
    </div>
  );
}
