import { GoalType } from '@prisma/client';

export type SampleSavingsGoal = {
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  type: GoalType;
  icon: string;
  color: string;
};

export const SAMPLE_SAVINGS_GOALS: SampleSavingsGoal[] = [
  {
    name: 'Emergency Cushion',
    description: 'Three months of core expenses.',
    targetAmount: 3000,
    currentAmount: 350,
    currency: 'EUR',
    type: GoalType.emergency_fund,
    icon: 'shield',
    color: '#12C79B',
  },
];
