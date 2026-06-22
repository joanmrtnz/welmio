import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

type CategoriesControllerMethod =
  | 'getCategoriesOverview'
  | 'createCategory'
  | 'updateCategory'
  | 'deleteCategory';

const getHandler = (methodName: CategoriesControllerMethod) =>
  CategoriesController.prototype[methodName];

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const categoriesService = {
    getCategoriesOverview: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: categoriesService }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('uses the authenticated user for category overview', async () => {
    const response = { summary: {}, categories: [] };
    categoriesService.getCategoriesOverview.mockResolvedValue(response);

    await expect(
      controller.getCategoriesOverview({ sub: 'user-1', email: 'u@test.com' }),
    ).resolves.toBe(response);

    expect(categoriesService.getCategoriesOverview).toHaveBeenCalledWith(
      'user-1',
    );
  });

  it('passes create category commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const createDto = {
      name: 'Food',
      type: 'expense' as any,
      icon: 'food',
      color: '#fff',
    };
    const response = { id: 'cat-1', ...createDto };

    categoriesService.createCategory.mockResolvedValue(response);

    await expect(controller.createCategory(user, createDto)).resolves.toBe(
      response,
    );

    expect(categoriesService.createCategory).toHaveBeenCalledWith(
      'user-1',
      createDto,
    );
  });

  it('passes update category commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const updateDto = { name: 'Groceries' };
    const response = { id: 'cat-1', name: 'Groceries' };

    categoriesService.updateCategory.mockResolvedValue(response);

    await expect(
      controller.updateCategory(user, 'cat-1', updateDto),
    ).resolves.toBe(response);

    expect(categoriesService.updateCategory).toHaveBeenCalledWith(
      'user-1',
      'cat-1',
      updateDto,
    );
  });

  it('passes delete category commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = { message: 'Category deleted successfully' };

    categoriesService.deleteCategory.mockResolvedValue(response);

    await expect(controller.deleteCategory(user, 'cat-1')).resolves.toBe(
      response,
    );

    expect(categoriesService.deleteCategory).toHaveBeenCalledWith(
      'user-1',
      'cat-1',
    );
  });

  it('is protected by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, CategoriesController);

    expect(guards).toContain(JwtAuthGuard);
  });

  it('exposes the expected categories routes', () => {
    expect(Reflect.getMetadata(PATH_METADATA, CategoriesController)).toBe(
      'categories',
    );

    const routes: Array<{
      methodName: CategoriesControllerMethod;
      path: string;
      requestMethod: RequestMethod;
    }> = [
      {
        methodName: 'getCategoriesOverview',
        path: 'overview',
        requestMethod: RequestMethod.GET,
      },
      {
        methodName: 'createCategory',
        path: '/',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'updateCategory',
        path: ':id',
        requestMethod: RequestMethod.PUT,
      },
      {
        methodName: 'deleteCategory',
        path: ':id',
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