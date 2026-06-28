import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FinanceSummaryService } from '../finance/finance-summary.service';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const prisma = {
    user: { findUnique: jest.fn() },
    category: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transaction: { count: jest.fn() },
  };

  const financeSummaryService = {
    getUserFinanceSummary: jest.fn(),
  };

  const expectedUserFindUniqueArgs = {
    where: { id: 'user-1' },
    select: { id: true },
  };

  const expectedCategoryFindManyArgs = {
    where: { userId: 'user-1' },
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
      type: true,
    },
    orderBy: { createdAt: 'asc' },
  };

  const duplicateCategoryError = () =>
    new Prisma.PrismaClientKnownRequestError('duplicate', {
      code: 'P2002',
      clientVersion: 'test',
    });

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
        { provide: FinanceSummaryService, useValue: financeSummaryService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('getCategoriesOverview', () => {
    it('returns summary plus categories for an existing user', async () => {
      const summary = { totalBalance: '100.00' };
      const categories = [{ id: 'cat_food_ui', name: 'Food' }];

      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      financeSummaryService.getUserFinanceSummary.mockResolvedValue(summary);
      prisma.category.findMany.mockResolvedValue(categories);

      await expect(service.getCategoriesOverview('user-1')).resolves.toEqual({
        summary,
        categories,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs,
      );
      expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
        'user-1',
      );
      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expectedCategoryFindManyArgs,
      );
    });

    it('returns an empty categories array when the user has no categories', async () => {
      const summary = { totalBalance: '0.00' };

      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      financeSummaryService.getUserFinanceSummary.mockResolvedValue(summary);
      prisma.category.findMany.mockResolvedValue([]);

      await expect(service.getCategoriesOverview('user-1')).resolves.toEqual({
        summary,
        categories: [],
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs,
      );
      expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
        'user-1',
      );
      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expectedCategoryFindManyArgs,
      );
    });

    it('rejects overview requests for missing users and does not load summary or categories', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getCategoriesOverview('missing'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'missing' },
        select: { id: true },
      });
      expect(financeSummaryService.getUserFinanceSummary).not.toHaveBeenCalled();
      expect(prisma.category.findMany).not.toHaveBeenCalled();
    });
  });

  describe('createCategory', () => {
    it('normalizes category names into ids and trims persisted values', async () => {
      const category = {
        id: 'cat_cafe_and_snacks_ui',
        name: 'Café & Snacks',
      };

      prisma.category.create.mockResolvedValue(category);

      await expect(
        service.createCategory('user-1', {
          name: '  Café & Snacks  ',
          type: 'expense' as any,
          icon: 'food',
          color: '#F97316',
        }),
      ).resolves.toBe(category);

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          id: 'cat_cafe_and_snacks_ui',
          userId: 'user-1',
          name: 'Café & Snacks',
          type: 'expense',
          icon: 'food',
          color: '#F97316',
        },
      });
    });

    it('rejects category names longer than 120 characters when creating', async () => {
      const longName = 'a'.repeat(121);

      await expect(
        service.createCategory('user-1', {
          name: longName,
          type: 'expense' as any,
          icon: 'food',
          color: '#F97316',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.category.create).not.toHaveBeenCalled();
    });

    it('maps duplicate category constraints to a conflict when creating', async () => {
      prisma.category.create.mockRejectedValue(duplicateCategoryError());

      await expect(
        service.createCategory('user-1', {
          name: 'Food',
          type: 'expense' as any,
          icon: 'food',
          color: '#F97316',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          id: 'cat_food_ui',
          userId: 'user-1',
          name: 'Food',
          type: 'expense',
          icon: 'food',
          color: '#F97316',
        },
      });
    });

    it('does not hide unexpected create errors', async () => {
      const error = new Error('Database unavailable');
      prisma.category.create.mockRejectedValue(error);

      await expect(
        service.createCategory('user-1', {
          name: 'Food',
          type: 'expense' as any,
          icon: 'food',
          color: '#F97316',
        }),
      ).rejects.toBe(error);
    });
  });

  describe('updateCategory', () => {
    it('updates an owned category and trims the provided name', async () => {
      const updateDto = {
        name: '  Groceries  ',
        type: 'expense' as any,
        icon: 'cart',
        color: '#22C55E',
      };
      const updatedCategory = {
        id: 'cat-1',
        name: 'Groceries',
        type: 'expense',
        icon: 'cart',
        color: '#22C55E',
      };

      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      prisma.category.update.mockResolvedValue(updatedCategory);

      await expect(
        service.updateCategory('user-1', 'cat-1', updateDto),
      ).resolves.toBe(updatedCategory);

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
          userId: 'user-1',
        },
      });

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
        },
        data: {
          name: 'Groceries',
          type: 'expense',
          icon: 'cart',
          color: '#22C55E',
        },
      });
    });

    it('only sends provided update fields', async () => {
      const updatedCategory = {
        id: 'cat-1',
        icon: 'new-icon',
      };

      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      prisma.category.update.mockResolvedValue(updatedCategory);

      await expect(
        service.updateCategory('user-1', 'cat-1', {
          icon: 'new-icon',
        }),
      ).resolves.toBe(updatedCategory);

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
        },
        data: {
          icon: 'new-icon',
        },
      });
    });

    it('does not update a category owned by another user', async () => {
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCategory('user-1', 'cat-1', { name: 'Bills' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
          userId: 'user-1',
        },
      });
      expect(prisma.category.update).not.toHaveBeenCalled();
    });

    it('maps duplicate category constraints to a conflict when updating', async () => {
      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      prisma.category.update.mockRejectedValue(duplicateCategoryError());

      await expect(
        service.updateCategory('user-1', 'cat-1', {
          name: 'Food',
          type: 'expense' as any,
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
        },
        data: {
          name: 'Food',
          type: 'expense',
        },
      });
    });

    it('does not hide unexpected update errors', async () => {
      const error = new Error('Database unavailable');

      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      prisma.category.update.mockRejectedValue(error);

      await expect(
        service.updateCategory('user-1', 'cat-1', { name: 'Bills' }),
      ).rejects.toBe(error);
    });
  });

  describe('deleteCategory', () => {
    it('rejects deleting a category owned by another user', async () => {
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteCategory('user-1', 'cat-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
          userId: 'user-1',
        },
      });
      expect(prisma.transaction.count).not.toHaveBeenCalled();
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });

    it('blocks deleting categories that still have transactions', async () => {
      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      prisma.transaction.count.mockResolvedValue(2);

      await expect(
        service.deleteCategory('user-1', 'cat-1'),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
          userId: 'user-1',
        },
      });
      expect(prisma.transaction.count).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          categoryId: 'cat-1',
        },
      });
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });

    it('deletes an owned empty category', async () => {
      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      prisma.transaction.count.mockResolvedValue(0);
      prisma.category.delete.mockResolvedValue({ id: 'cat-1' });

      await expect(service.deleteCategory('user-1', 'cat-1')).resolves.toEqual({
        id: 'cat-1',
        deleted: true,
      });

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
          userId: 'user-1',
        },
      });
      expect(prisma.transaction.count).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          categoryId: 'cat-1',
        },
      });
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
        },
      });
    });
  });
});