export class WorkoutPlanTrainerDto {
  basicInformation: {
    name: string;
    age: number;
    gender: string;
  };
  fitnessGoals: {
    primaryGoal: string;
  };
  availability: {
    daysPerWeek: number;
    sessionDuration: number;
  };
}
