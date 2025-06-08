export const FOODS: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    category: 'Protein',
    nutrients: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, sugar: 0 },
    allergens: [],
    healthScore: 9,
    tags: ['lean', 'high-protein', 'low-carb']
  },
  {
    id: '2',
    name: 'Brown Rice',
    category: 'Grains',
    nutrients: { calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sodium: 10, sugar: 0.7 },
    allergens: [],
    healthScore: 7,
    tags: ['whole-grain', 'complex-carb']
  },
  {
    id: '3',
    name: 'Salmon Fillet',
    category: 'Protein',
    nutrients: { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sodium: 59, sugar: 0 },
    allergens: ['fish'],
    healthScore: 9,
    tags: ['omega-3', 'high-protein', 'healthy-fat']
  },
  {
    id: '4',
    name: 'Broccoli',
    category: 'Vegetables',
    nutrients: { calories: 25, protein: 3, carbs: 5, fat: 0.4, fiber: 2.3, sodium: 33, sugar: 1.5 },
    allergens: [],
    healthScore: 10,
    tags: ['antioxidant', 'low-calorie', 'fiber-rich']
  },
  {
    id: '5',
    name: 'White Bread',
    category: 'Grains',
    nutrients: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sodium: 477, sugar: 6 },
    allergens: ['gluten', 'wheat'],
    healthScore: 3,
    tags: ['processed', 'high-sodium', 'refined']
  },
  {
    id: '6',
    name: 'Greek Yogurt',
    category: 'Dairy',
    nutrients: { calories: 100, protein: 17, carbs: 6, fat: 0.4, fiber: 0, sodium: 36, sugar: 4 },
    allergens: ['dairy'],
    healthScore: 8,
    tags: ['probiotic', 'high-protein', 'low-fat']
  }
];