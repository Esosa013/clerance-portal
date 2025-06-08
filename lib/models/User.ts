// lib/models/User.ts
export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  profile?: {
    age?: number;
    gender?: 'male' | 'female' | 'other';
    weight?: number;
    height?: number;
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goals?: string[];
    allergies?: string[];
    restrictions?: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}