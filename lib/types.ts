export interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  tags: string[];
  language: string;
  satire: boolean;
  published_at?: string;
  source?: string;
  prompt_used?: string;
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
}

export interface GenerateArticleRequest {
  prompt: string;
  publish?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
