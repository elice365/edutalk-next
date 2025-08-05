// Re-export all types
export type * from './auth';
export type * from './api'; 
export type * from './ui';

// Common utility types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStateType<T = any> {
  status: LoadingState;
  data: T | null;
  error: string | null;
}

// Next.js specific types
export interface PageProps<T = {}> {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
  children: React.ReactNode;
}