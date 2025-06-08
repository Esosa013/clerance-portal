import { DietaryRuleEngine } from "@/lib/dietaryrulengine";
import { useState } from "react";

export const useDietary = () => {
    const [currentStep, setCurrentStep] = useState<'profile' | 'foods' | 'recommendations'>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30,
    gender: 'female',
    weight: 65,
    height: 165,
    activityLevel: 'moderate',
    goals: [],
    allergies: [],
    restrictions: [],
    medicalConditions: []
  });
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [ruleEngine, setRuleEngine] = useState<DietaryRuleEngine | null>(null);

  const goals = [
    'weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 
    'heart_health', 'diabetes_management', 'athletic_performance'
  ];

  const allergies = [
    'dairy', 'gluten', 'nuts', 'shellfish', 'eggs', 'soy', 'fish'
  ];

  const restrictions = [
    'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'low_sodium', 'low_sugar'
  ];

  const handleProfileSubmit = () => {
    const engine = new DietaryRuleEngine(userProfile);
    setRuleEngine(engine);
    setCurrentStep('foods');
  };

  const toggleFood = (food: FoodItem) => {
    setSelectedFoods(prev => {
      const exists = prev.find(f => f.id === food.id);
      if (exists) {
        return prev.filter(f => f.id !== food.id);
      } else {
        return [...prev, food];
      }
    });
  };

  const generateRecommendations = () => {
    if (ruleEngine && selectedFoods.length > 0) {
      const recs = ruleEngine.generateRecommendations(selectedFoods);
      setRecommendations(recs);
      setCurrentStep('recommendations');
    }
  };

  const toggleArrayItem = <T,>(array: T[], item: T, setter: (value: T[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const currentNutrients = ruleEngine && selectedFoods.length > 0 
    ? selectedFoods.reduce(
        (total, food) => ({
          calories: total.calories + food.nutrients.calories,
          protein: total.protein + food.nutrients.protein,
          carbs: total.carbs + food.nutrients.carbs,
          fat: total.fat + food.nutrients.fat,
          fiber: total.fiber + food.nutrients.fiber,
          sodium: total.sodium + food.nutrients.sodium,
          sugar: total.sugar + food.nutrients.sugar
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0 }
      )
    : null;

  const targetNutrients = ruleEngine?.getTargetNutrients();

  return{
    currentStep,
    setCurrentStep,
    userProfile,
    setUserProfile,
    selectedFoods,
    recommendations,
    goals,
    allergies,
    restrictions,
    handleProfileSubmit,
    toggleFood,
    generateRecommendations,
    toggleArrayItem,
    currentNutrients,
    targetNutrients,
    setRecommendations,
    setSelectedFoods,
  }
}