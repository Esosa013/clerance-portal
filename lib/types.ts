interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: string[];
  allergies: string[];
  restrictions: string[];
  medicalConditions: string[];
}

interface NutrientProfile {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
}

interface FoodItem {
  id: string;
  name: string;
  category: string;
  nutrients: NutrientProfile;
  allergens: string[];
  healthScore: number;
  tags: string[];
}

interface Recommendation {
  type: 'add' | 'reduce' | 'avoid' | 'maintain';
  category: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}