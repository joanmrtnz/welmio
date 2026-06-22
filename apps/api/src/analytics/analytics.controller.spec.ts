import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  const analyticsService = {
    getSummary: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: analyticsService }],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('loads summary for the authenticated request user and requested period', async () => {
    const response = { period: 'monthly' };
    analyticsService.getSummary.mockResolvedValue(response);

    await expect(
      controller.getSummary(
        { user: { sub: 'user-1' } },
        { period: 'monthly' as any },
      ),
    ).resolves.toBe(response);

    expect(analyticsService.getSummary).toHaveBeenCalledWith(
      'user-1',
      'monthly',
    );
  });

  it('is protected by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, AnalyticsController);

    expect(guards).toContain(JwtAuthGuard);
  });

  it('exposes GET /analytics/summary', () => {
    const controllerPath = Reflect.getMetadata(
      PATH_METADATA,
      AnalyticsController,
    );

    const handler = AnalyticsController.prototype.getSummary;
    const methodPath = Reflect.getMetadata(PATH_METADATA, handler);
    const requestMethod = Reflect.getMetadata(METHOD_METADATA, handler);

    expect(controllerPath).toBe('analytics');
    expect(methodPath).toBe('summary');
    expect(requestMethod).toBe(RequestMethod.GET);
  });
});