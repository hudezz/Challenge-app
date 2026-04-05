// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Challenge Types
export interface Challenge {
  id: number;
  title: string;
  description: string;
  month: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'upcoming';
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateChallengeDTO {
  title: string;
  description: string;
  month: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'upcoming';
}

export interface UpdateChallengeDTO extends Partial<CreateChallengeDTO> {
  id: number;
}

// API Error Class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fetch utility with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text().catch(() => 'Unknown error');
    throw new ApiError(response.status, errorMessage);
  }

  // Handle empty responses (like DELETE)
  const text = await response.text();
  if (!text) return {} as T;
  
  return JSON.parse(text) as T;
}

// API Client
export const api = {
  // GET /challenges - Fetch all challenges
  getChallenges: (): Promise<Challenge[]> => {
    return fetchApi<Challenge[]>('/challenges');
  },

  // GET /challenges/{month} - Search by month
  getChallengeByMonth: (month: string): Promise<Challenge> => {
    return fetchApi<Challenge>(`/challenges/${encodeURIComponent(month)}`);
  },

  // POST /challenges - Create new challenge
  createChallenge: (data: CreateChallengeDTO): Promise<Challenge> => {
    return fetchApi<Challenge>('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /challenges/{id} - Update challenge
  updateChallenge: (id: number, data: Partial<CreateChallengeDTO>): Promise<Challenge> => {
    return fetchApi<Challenge>(`/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /challenges/{id} - Delete challenge
  deleteChallenge: (id: number): Promise<void> => {
    return fetchApi<void>(`/challenges/${id}`, {
      method: 'DELETE',
    });
  },
};
