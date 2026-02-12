
export interface User {
  nickname: string;
  password?: string;
  isRegistered: boolean;
  language?: Language;
}

export type AuthMode = 'register' | 'login';
export type Language = 'en' | 'ru' | 'uz';

export interface ProjectIdea {
  title: string;
  description: string;
  techStack: string[];
}
