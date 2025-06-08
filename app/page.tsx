'use client'
import { User, Activity, Target, TrendingUp, AlertCircle, CheckCircle, X, LogOut } from 'lucide-react';
import { useDietary } from './useDietary';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import { FOODS } from '@/lib/constants';
import { useEffect } from 'react';

export default function DietaryRecommendationSystem() {
  const { user, logout, loading: authLoading, updateProfile } = useAuth();
  const {
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
  } = useDietary();

  // Load user profile data when user logs in
  useEffect(() => {
    if (user?.profile) {
      setUserProfile(prev => ({
        ...prev,
        ...user.profile,
      }));
    }
  }, [user, setUserProfile]);

  // Enhanced profile submit handler that saves to database
  const handleEnhancedProfileSubmit = async () => {
    if (user) {
      try {
        await updateProfile(userProfile);
        handleProfileSubmit();
      } catch (error) {
        console.error('Failed to save profile:', error);
        // Still proceed to next step even if save fails
        handleProfileSubmit();
      }
    } else {
      handleProfileSubmit();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const UserHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Welcome, {user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  if (currentStep === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <UserHeader />
            
            <div className="flex items-center gap-3 mb-8">
              <User className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">Dietary Profile Setup</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Age</label>
                    <input
                      type="number"
                      value={userProfile.age}
                      onChange={(e) => setUserProfile(prev => ({...prev, age: parseInt(e.target.value)}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
                    <select
                      value={userProfile.gender}
                      onChange={(e) => setUserProfile(prev => ({...prev, gender: e.target.value as any}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={userProfile.weight}
                      onChange={(e) => setUserProfile(prev => ({...prev, weight: parseFloat(e.target.value)}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={userProfile.height}
                      onChange={(e) => setUserProfile(prev => ({...prev, height: parseFloat(e.target.value)}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Activity Level</label>
                  <select
                    value={userProfile.activityLevel}
                    onChange={(e) => setUserProfile(prev => ({...prev, activityLevel: e.target.value as any}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (light exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                    <option value="active">Active (hard exercise 6-7 days/week)</option>
                    <option value="very_active">Very Active (very hard exercise, physical job)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Health Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {goals.map(goal => (
                      <button
                        key={goal}
                        onClick={() => toggleArrayItem(userProfile.goals, goal, (goals) => 
                          setUserProfile(prev => ({...prev, goals})))}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                          userProfile.goals.includes(goal)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {goal.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map(allergy => (
                      <button
                        key={allergy}
                        onClick={() => toggleArrayItem(userProfile.allergies, allergy, (allergies) => 
                          setUserProfile(prev => ({...prev, allergies})))}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                          userProfile.allergies.includes(allergy)
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Dietary Restrictions</h3>
                  <div className="flex flex-wrap gap-2">
                    {restrictions.map(restriction => (
                      <button
                        key={restriction}
                        onClick={() => toggleArrayItem(userProfile.restrictions, restriction, (restrictions) => 
                          setUserProfile(prev => ({...prev, restrictions})))}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                          userProfile.restrictions.includes(restriction)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {restriction.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleEnhancedProfileSubmit}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Continue to Food Selection
                <Activity className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'foods') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <UserHeader />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-800">Select Your Foods</h1>
              </div>
              <button
                onClick={() => setCurrentStep('profile')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Profile
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Foods</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {FOODS.map(food => {
                    const isSelected = selectedFoods.some(f => f.id === food.id);
                    const hasAllergen = food.allergens.some(allergen => 
                      userProfile.allergies.includes(allergen)
                    );
                    
                    return (
                      <div
                        key={food.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          hasAllergen
                            ? 'border-red-300 bg-red-50'
                            : isSelected
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => !hasAllergen && toggleFood(food)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">{food.name}</h3>
                          <div className="flex items-center gap-2">
                            {hasAllergen && <AlertCircle className="w-4 h-4 text-red-500" />}
                            {isSelected && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                            {food.category}
                          </span>
                          <span className="ml-2 text-green-600 font-medium">
                            Health Score: {food.healthScore}/10
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>Calories: {food.nutrients.calories}</div>
                          <div>Protein: {food.nutrients.protein}g</div>
                          <div>Carbs: {food.nutrients.carbs}g</div>
                          <div>Fat: {food.nutrients.fat}g</div>
                        </div>
                        
                        {food.allergens.length > 0 && (
                          <div className="mt-2 text-xs text-red-600">
                            Contains: {food.allergens.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Selected Foods ({selectedFoods.length})
                  </h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    {selectedFoods.length === 0 ? (
                      <p className="text-gray-500 text-center">No foods selected</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedFoods.map(food => (
                          <div key={food.id} className="flex items-center justify-between text-sm">
                            <span>{food.name}</span>
                            <button
                              onClick={() => toggleFood(food)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {currentNutrients && targetNutrients && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-gray-700 mb-3">Nutrition Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span className={currentNutrients.calories > targetNutrients.calories ? 'text-red-600' : 'text-green-600'}>
                            {currentNutrients.calories} / {targetNutrients.calories}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className={currentNutrients.protein < targetNutrients.protein ? 'text-red-600' : 'text-green-600'}>
                            {currentNutrients.protein}g / {targetNutrients.protein}g
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span>{currentNutrients.carbs}g / {targetNutrients.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat:</span>
                          <span>{currentNutrients.fat}g / {targetNutrients.fat}g</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={generateRecommendations}
                    disabled={selectedFoods.length === 0}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Get Recommendations
                    <TrendingUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <UserHeader />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">Your Dietary Recommendations</h1>
            </div>
            <button
              onClick={() => setCurrentStep('foods')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Foods
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Recommendations</h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high'
                        ? 'border-red-500 bg-red-50'
                        : rec.priority === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{rec.category}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{rec.message}</p>
                    <p className="text-sm text-gray-600">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Nutrition Analysis</h2>
              
              {currentNutrients && targetNutrients && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Macro Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Calories', current: currentNutrients.calories, target: targetNutrients.calories, unit: '' },
                        { name: 'Protein', current: currentNutrients.protein, target: targetNutrients.protein, unit: 'g' },
                        { name: 'Carbohydrates', current: currentNutrients.carbs, target: targetNutrients.carbs, unit: 'g' },
                        { name: 'Fat', current: currentNutrients.fat, target: targetNutrients.fat, unit: 'g' },
                        { name: 'Fiber', current: currentNutrients.fiber, target: targetNutrients.fiber, unit: 'g' },
                        { name: 'Sodium', current: currentNutrients.sodium, target: targetNutrients.sodium, unit: 'mg' }
                      ].map((nutrient) => {
                        const percentage = (nutrient.current / nutrient.target) * 100;
                        const isOver = percentage > 110;
                        const isUnder = percentage < 90;
                        
                        return (
                          <div key={nutrient.name}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{nutrient.name}</span>
                              <span className={`text-sm ${
                                isOver ? 'text-red-600' : isUnder ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {nutrient.current}{nutrient.unit} / {nutrient.target}{nutrient.unit}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isOver ? 'bg-red-500' : isUnder ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {percentage.toFixed(0)}% of target
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Selected Foods Analysis</h3>
                    <div className="space-y-2">
                      {selectedFoods.map(food => (
                        <div key={food.id} className="flex justify-between items-center text-sm">
                          <span>{food.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{food.nutrients.calories} cal</span>
                            <div className={`w-2 h-2 rounded-full ${
                              food.healthScore >= 8 ? 'bg-green-500' :
                              food.healthScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-blue-200">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Average Health Score:</span>
                        <span className={
                          selectedFoods.reduce((sum, food) => sum + food.healthScore, 0) / selectedFoods.length >= 7
                            ? 'text-green-600' : 'text-yellow-600'
                        }>
                          {(selectedFoods.reduce((sum, food) => sum + food.healthScore, 0) / selectedFoods.length).toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Your Goals Progress</h3>
                    <div className="space-y-2">
                      {userProfile.goals.map(goal => {
                        let status = 'On Track';
                        let statusColor = 'text-green-600';
                        
                        if (goal === 'weight_loss' && currentNutrients.calories > targetNutrients.calories) {
                          status = 'Exceeding calorie target';
                          statusColor = 'text-red-600';
                        } else if (goal === 'muscle_gain' && currentNutrients.protein < targetNutrients.protein * 0.8) {
                          status = 'Need more protein';
                          statusColor = 'text-yellow-600';
                        } else if (goal === 'heart_health' && currentNutrients.sodium > targetNutrients.sodium) {
                          status = 'Reduce sodium intake';
                          statusColor = 'text-red-600';
                        }
                        
                        return (
                          <div key={goal} className="flex justify-between items-center text-sm">
                            <span className="capitalize">{goal.replace('_', ' ')}</span>
                            <span className={statusColor}>{status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <button
              onClick={() => {
                setCurrentStep('profile');
                setSelectedFoods([]);
                setRecommendations([]);
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={() => setCurrentStep('foods')}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Modify Food Selection
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">How This System Works</h3>
            <p className="text-sm text-gray-600 mb-2">
              Our rule-based system analyzes your personal profile, calculates your nutritional needs using the Mifflin-St Jeor equation, 
              and applies evidence-based dietary guidelines to generate personalized recommendations.
            </p>
            <div className="text-xs text-gray-500">
              <strong>Rules Applied:</strong> Caloric balance, macronutrient ratios, micronutrient adequacy, 
              allergen avoidance, goal-specific adjustments, and food quality scoring.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}