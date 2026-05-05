export class GoalContributionResponseDto {
  id: string;
  goalId: string;
  transactionId?: string | null;

  amount: number;
  currency: string;
  date: string;

  notes?: string | null;
  description?: string | null;
}