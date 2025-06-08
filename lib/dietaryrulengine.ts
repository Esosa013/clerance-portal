export class DietaryRuleEngine {
  private profile: UserProfile;
  private targetNutrients: NutrientProfile;

  constructor(profile: UserProfile) {
    this.profile = profile;
    this.targetNutrients = this.calculateTargetNutrients();
  }

  private calculateTargetNutrients(): NutrientProfile {
    const bmr = this.calculateBMR();
    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }[this.profile.activityLevel];

    const calories = Math.round(bmr * activityMultiplier);
    
    // Macro distribution based on goals
    let proteinRatio = 0.25;
    let carbRatio = 0.45;
    let fatRatio = 0.30;

    if (this.profile.goals.includes('weight_loss')) {
      proteinRatio = 0.30;
      carbRatio = 0.35;
      fatRatio = 0.35;
    } else if (this.profile.goals.includes('muscle_gain')) {
      proteinRatio = 0.35;
      carbRatio = 0.40;
      fatRatio = 0.25;
    }

    return {
      calories,
      protein: Math.round((calories * proteinRatio) / 4),
      carbs: Math.round((calories * carbRatio) / 4),
      fat: Math.round((calories * fatRatio) / 9),
      fiber: Math.max(25, Math.round(calories / 100)),
      sodium: 2300,
      sugar: Math.round(calories * 0.05 / 4)
    };
  }

  private calculateBMR(): number {
    if (this.profile.gender === 'male') {
      return 88.362 + (13.397 * this.profile.weight) + (4.799 * this.profile.height) - (5.677 * this.profile.age);
    } else {
      return 447.593 + (9.247 * this.profile.weight) + (3.098 * this.profile.height) - (4.330 * this.profile.age);
    }
  }

  generateRecommendations(selectedFoods: FoodItem[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const currentNutrients = this.calculateCurrentNutrients(selectedFoods);

    // Calorie analysis
    const calorieDeficit = this.targetNutrients.calories - currentNutrients.calories;
    if (Math.abs(calorieDeficit) > 200) {
      recommendations.push({
        type: calorieDeficit > 0 ? 'add' : 'reduce',
        category: 'Calories',
        message: `${calorieDeficit > 0 ? 'Add' : 'Reduce'} approximately ${Math.abs(calorieDeficit)} calories`,
        priority: 'high',
        reasoning: `Target: ${this.targetNutrients.calories} cal, Current: ${currentNutrients.calories} cal`
      });
    }

    // Macronutrient analysis
    const proteinDeficit = this.targetNutrients.protein - currentNutrients.protein;
    if (proteinDeficit > 10) {
      recommendations.push({
        type: 'add',
        category: 'Protein',
        message: `Add ${proteinDeficit}g more protein to your diet`,
        priority: 'high',
        reasoning: 'Protein is essential for muscle maintenance and satiety'
      });
    }

    // Fiber analysis
    if (currentNutrients.fiber < this.targetNutrients.fiber) {
      recommendations.push({
        type: 'add',
        category: 'Fiber',
        message: 'Increase fiber intake with more vegetables and whole grains',
        priority: 'medium',
        reasoning: 'Fiber aids digestion and helps with satiety'
      });
    }

    // Sodium analysis
    if (currentNutrients.sodium > this.targetNutrients.sodium) {
      recommendations.push({
        type: 'reduce',
        category: 'Sodium',
        message: 'Reduce sodium intake by choosing less processed foods',
        priority: 'medium',
        reasoning: 'High sodium intake is linked to hypertension'
      });
    }

    // Food quality analysis
    const averageHealthScore = selectedFoods.reduce((sum, food) => sum + food.healthScore, 0) / selectedFoods.length;
    if (averageHealthScore < 6) {
      recommendations.push({
        type: 'add',
        category: 'Food Quality',
        message: 'Focus on more whole, unprocessed foods',
        priority: 'high',
        reasoning: 'Higher quality foods provide better nutrition density'
      });
    }

    // Allergy and restriction checks
    selectedFoods.forEach(food => {
      const allergenConflicts = food.allergens.filter(allergen => 
        this.profile.allergies.includes(allergen)
      );
      if (allergenConflicts.length > 0) {
        recommendations.push({
          type: 'avoid',
          category: 'Allergy Alert',
          message: `Avoid ${food.name} - contains ${allergenConflicts.join(', ')}`,
          priority: 'high',
          reasoning: 'Food contains allergens from your profile'
        });
      }
    });

    return recommendations;
  }

  private calculateCurrentNutrients(foods: FoodItem[]): NutrientProfile {
    return foods.reduce(
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
    );
  }

  getTargetNutrients(): NutrientProfile {
    return this.targetNutrients;
  }
}