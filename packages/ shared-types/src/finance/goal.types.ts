export type GoalOverviewItem = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  type: string;
  status: string;
  saved: number;
  target: number;
  currency: string;
  progress: number;
  targetDate?: string | null;
  monthlyNeeded: number;
  statusLabel: string;
};

export type GoalsOverviewResponse = {
  summary: {
    totalSaved: number;
    totalTarget: number;
    globalProgress: number;
    activeGoals: number;
    monthlyNeeded: number;
    progressMessage: string;
  };
  mainGoal: GoalOverviewItem | null;
  goals: GoalOverviewItem[];
};