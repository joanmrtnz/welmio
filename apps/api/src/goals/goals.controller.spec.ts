import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

type GoalsControllerMethod =
  | 'deleteGoal'
  | 'createGoal'
  | 'updateGoal'
  | 'getUserGoalsOverview'
  | 'getGoalContributionsAnalytics'
  | 'getGoalContributions'
  | 'createGoalContribution'
  | 'deleteGoalContribution';

const getHandler = (methodName: GoalsControllerMethod) =>
  GoalsController.prototype[methodName];

describe('GoalsController', () => {
  let controller: GoalsController;

  const goalsService = {
    deleteGoal: jest.fn(),
    createGoal: jest.fn(),
    updateGoal: jest.fn(),
    getUserGoalsOverview: jest.fn(),
    getGoalContributionsAnalytics: jest.fn(),
    getGoalContributions: jest.fn(),
    createGoalContribution: jest.fn(),
    deleteGoalContribution: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsController],
      providers: [{ provide: GoalsService, useValue: goalsService }],
    }).compile();

    controller = module.get<GoalsController>(GoalsController);
  });

  it('passes delete goal commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = { id: 'goal-1', deleted: true };

    goalsService.deleteGoal.mockResolvedValue(response);

    await expect(controller.deleteGoal(user, 'goal-1')).resolves.toBe(
      response,
    );

    expect(goalsService.deleteGoal).toHaveBeenCalledWith('user-1', 'goal-1');
  });

  it('passes create goal commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const createGoalDto = {
      name: 'Trip',
      targetAmount: 500,
      currency: 'EUR',
      type: 'savings' as any,
    };
    const response = { id: 'goal-1', ...createGoalDto };

    goalsService.createGoal.mockResolvedValue(response);

    await expect(controller.createGoal(user, createGoalDto)).resolves.toBe(
      response,
    );

    expect(goalsService.createGoal).toHaveBeenCalledWith(
      'user-1',
      createGoalDto,
    );
  });

  it('passes update goal commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const updateGoalDto = { currentAmount: 100 };
    const response = { id: 'goal-1', currentAmount: '100' };

    goalsService.updateGoal.mockResolvedValue(response);

    await expect(
      controller.updateGoal(user, 'goal-1', updateGoalDto),
    ).resolves.toBe(response);

    expect(goalsService.updateGoal).toHaveBeenCalledWith(
      'user-1',
      'goal-1',
      updateGoalDto,
    );
  });

  it('uses the authenticated user for goals overview', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = { summary: {}, goals: [] };

    goalsService.getUserGoalsOverview.mockResolvedValue(response);

    await expect(controller.getUserGoalsOverview(user)).resolves.toBe(response);

    expect(goalsService.getUserGoalsOverview).toHaveBeenCalledWith('user-1');
  });

  it('passes contribution analytics query to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const analyticsQuery = { period: 'monthly' as any };
    const response = { period: 'monthly', chart: {} };

    goalsService.getGoalContributionsAnalytics.mockResolvedValue(response);

    await expect(
      controller.getGoalContributionsAnalytics(user, analyticsQuery),
    ).resolves.toBe(response);

    expect(goalsService.getGoalContributionsAnalytics).toHaveBeenCalledWith(
      'user-1',
      analyticsQuery,
    );
  });

  it('passes get goal contributions commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = { contributions: [] };

    goalsService.getGoalContributions.mockResolvedValue(response);

    await expect(
      controller.getGoalContributions(user, 'goal-1'),
    ).resolves.toBe(response);

    expect(goalsService.getGoalContributions).toHaveBeenCalledWith(
      'user-1',
      'goal-1',
    );
  });

  it('passes create goal contribution commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const contributionDto = {
      amount: 25,
      currency: 'EUR',
      date: '2026-06-22T00:00:00.000Z',
    };
    const response = { id: 'contribution-1', ...contributionDto };

    goalsService.createGoalContribution.mockResolvedValue(response);

    await expect(
      controller.createGoalContribution(user, 'goal-1', contributionDto),
    ).resolves.toBe(response);

    expect(goalsService.createGoalContribution).toHaveBeenCalledWith(
      'user-1',
      'goal-1',
      contributionDto,
    );
  });

  it('passes delete goal contribution commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = { id: 'contribution-1', deleted: true };

    goalsService.deleteGoalContribution.mockResolvedValue(response);

    await expect(
      controller.deleteGoalContribution(user, 'goal-1', 'contribution-1'),
    ).resolves.toBe(response);

    expect(goalsService.deleteGoalContribution).toHaveBeenCalledWith(
      'user-1',
      'goal-1',
      'contribution-1',
    );
  });

  it('is protected by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, GoalsController);

    expect(guards).toContain(JwtAuthGuard);
  });

  it('exposes the expected goals routes', () => {
    expect(Reflect.getMetadata(PATH_METADATA, GoalsController)).toBe('goals');

    const routes: Array<{
      methodName: GoalsControllerMethod;
      path: string;
      requestMethod: RequestMethod;
    }> = [
      {
        methodName: 'deleteGoal',
        path: ':id',
        requestMethod: RequestMethod.DELETE,
      },
      {
        methodName: 'createGoal',
        path: '/',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'updateGoal',
        path: ':id',
        requestMethod: RequestMethod.PATCH,
      },
      {
        methodName: 'getUserGoalsOverview',
        path: 'overview',
        requestMethod: RequestMethod.GET,
      },
      {
        methodName: 'getGoalContributionsAnalytics',
        path: 'analytics/contributions',
        requestMethod: RequestMethod.GET,
      },
      {
        methodName: 'getGoalContributions',
        path: ':id/contributions',
        requestMethod: RequestMethod.GET,
      },
      {
        methodName: 'createGoalContribution',
        path: ':id/contributions',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'deleteGoalContribution',
        path: ':id/contributions/:contributionId',
        requestMethod: RequestMethod.DELETE,
      },
    ];

    routes.forEach(({ methodName, path, requestMethod }) => {
      const handler = getHandler(methodName);

      expect(Reflect.getMetadata(PATH_METADATA, handler)).toBe(path);
      expect(Reflect.getMetadata(METHOD_METADATA, handler)).toBe(
        requestMethod,
      );
    });
  });
});