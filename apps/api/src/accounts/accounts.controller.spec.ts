import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

describe('AccountsController', () => {
  let controller: AccountsController;
  const accountsService = {
    getAccountsByUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: accountsService }],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('loads accounts for the authenticated user', async () => {
    const response = { accounts: [{ id: 'account-1' }] };
    accountsService.getAccountsByUser.mockResolvedValue(response);

    await expect(
      controller.getAccountsByUser({ sub: 'user-1', email: 'u@test.com' }),
    ).resolves.toBe(response);

    expect(accountsService.getAccountsByUser).toHaveBeenCalledWith('user-1');
  });

  it('is protected by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, AccountsController);

    expect(guards).toContain(JwtAuthGuard);
  });

  it('exposes GET /accounts', () => {
    const controllerPath = Reflect.getMetadata(
      PATH_METADATA,
      AccountsController,
    );

    const handler = AccountsController.prototype.getAccountsByUser;
    const methodPath = Reflect.getMetadata(PATH_METADATA, handler);
    const requestMethod = Reflect.getMetadata(METHOD_METADATA, handler);

    expect(controllerPath).toBe('accounts');
    expect(methodPath).toBe('/');
    expect(requestMethod).toBe(RequestMethod.GET);
  });
});