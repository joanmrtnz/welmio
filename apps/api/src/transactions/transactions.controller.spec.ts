import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ImportTransactionsDto } from './dto/import-transactions.dto';

type TransactionsControllerMethod =
  | 'createTransaction'
  | 'importTransactions'
  | 'updateTransaction'
  | 'deleteTransaction'
  | 'getTransactionsByCategories'
  | 'getUserTransactions'
  | 'getUserTransactionsOverview';

const getHandler = (methodName: TransactionsControllerMethod) =>
  TransactionsController.prototype[methodName];

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const transactionsService = {
    createTransaction: jest.fn(),
    importTransactions: jest.fn(),
    updateTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    getTransactionsByCategories: jest.fn(),
    getUserTransactions: jest.fn(),
    getUserTransactionsOverview: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: transactionsService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('passes create transaction commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const createDto = {
      accountId: 'account-1',
      categoryId: 'cat-1',
      amount: 12.50,
      currency: 'EUR',
      type: 'expense' as any,
      description: 'Lunch',
      date: '2026-06-22T12:00:00.000Z',
    };
    const response = { id: 'tx-1', ...createDto };

    transactionsService.createTransaction.mockResolvedValue(response);

    await expect(
      controller.createTransaction(user, createDto),
    ).resolves.toBe(response);

    expect(transactionsService.createTransaction).toHaveBeenCalledWith(
      'user-1',
      createDto,
    );
  });

  it('passes update transaction commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const updateDto = { amount: 13.00 };
    const response = { id: 'tx-1', amount: 13.00 };

    transactionsService.updateTransaction.mockResolvedValue(response);

    await expect(
      controller.updateTransaction(user, 'tx-1', updateDto),
    ).resolves.toBe(response);

    expect(transactionsService.updateTransaction).toHaveBeenCalledWith(
      'user-1',
      'tx-1',
      updateDto,
    );
  });

  it('passes imported transactions to the service for the authenticated user', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const importDto = {
      transactions: [{ description: 'Lunch' }],
    } as ImportTransactionsDto;
    const response = { importedCount: 1 };

    transactionsService.importTransactions.mockResolvedValue(response);

    await expect(
      controller.importTransactions(user, importDto),
    ).resolves.toBe(response);

    expect(transactionsService.importTransactions).toHaveBeenCalledWith(
      'user-1',
      importDto.transactions,
    );
  });

  it('passes delete transaction commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = { message: 'Transaction deleted successfully' };

    transactionsService.deleteTransaction.mockResolvedValue(response);

    await expect(controller.deleteTransaction(user, 'tx-1')).resolves.toBe(
      response,
    );

    expect(transactionsService.deleteTransaction).toHaveBeenCalledWith(
      'user-1',
      'tx-1',
    );
  });

  it('passes category analytics query to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const query = { type: 'expense' as any };
    const response = { categories: [] };

    transactionsService.getTransactionsByCategories.mockResolvedValue(response);

    await expect(
      controller.getTransactionsByCategories(user, query),
    ).resolves.toBe(response);

    expect(transactionsService.getTransactionsByCategories).toHaveBeenCalledWith(
      'user-1',
      query,
    );
  });

  it('uses the authenticated user for transaction list', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = { transactions: [] };

    transactionsService.getUserTransactions.mockResolvedValue(response);

    await expect(controller.getUserTransactions(user)).resolves.toBe(response);

    expect(transactionsService.getUserTransactions).toHaveBeenCalledWith(
      'user-1',
    );
  });

  it('uses the authenticated user for transaction overview', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = { summary: {}, transactions: [] };

    transactionsService.getUserTransactionsOverview.mockResolvedValue(response);

    await expect(
      controller.getUserTransactionsOverview(user),
    ).resolves.toBe(response);

    expect(transactionsService.getUserTransactionsOverview).toHaveBeenCalledWith(
      'user-1',
    );
  });

  it('is protected by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, TransactionsController);

    expect(guards).toContain(JwtAuthGuard);
  });

  it('exposes the expected transactions routes', () => {
    expect(Reflect.getMetadata(PATH_METADATA, TransactionsController)).toBe(
      'transactions',
    );

    const routes: Array<{
      methodName: TransactionsControllerMethod;
      path: string;
      requestMethod: RequestMethod;
    }> = [
      {
        methodName: 'createTransaction',
        path: '/',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'updateTransaction',
        path: ':id',
        requestMethod: RequestMethod.PUT,
      },
      {
        methodName: 'importTransactions',
        path: 'import',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'deleteTransaction',
        path: ':id',
        requestMethod: RequestMethod.DELETE,
      },
      {
        methodName: 'getTransactionsByCategories',
        path: 'analytics/categories',
        requestMethod: RequestMethod.GET,
      },
      {
        methodName: 'getUserTransactions',
        path: '/',
        requestMethod: RequestMethod.GET,
      },
      {
        methodName: 'getUserTransactionsOverview',
        path: 'overview',
        requestMethod: RequestMethod.GET,
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
