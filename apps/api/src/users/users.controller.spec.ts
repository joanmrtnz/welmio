import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

type UsersControllerMethod =
  | 'getMe'
  | 'updateMe'
  | 'changePassword'
  | 'deleteMe';

const getHandler = (methodName: UsersControllerMethod) =>
  UsersController.prototype[methodName];

describe('UsersController', () => {
  let controller: UsersController;

  const usersService = {
    getUserProfile: jest.fn(),
    updateUserProfile: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('uses the authenticated user for profile details', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const response = {
      id: 'user-1',
      email: 'u@test.com',
      fullName: 'User One',
    };

    usersService.getUserProfile.mockResolvedValue(response);

    await expect(controller.getMe(user)).resolves.toBe(response);

    expect(usersService.getUserProfile).toHaveBeenCalledWith('user-1');
  });

  it('passes profile update commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const updateDto = { fullName: 'Updated' };
    const response = {
      id: 'user-1',
      fullName: 'Updated',
    };

    usersService.updateUserProfile.mockResolvedValue(response);

    await expect(controller.updateMe(user, updateDto)).resolves.toBe(response);

    expect(usersService.updateUserProfile).toHaveBeenCalledWith(
      'user-1',
      updateDto,
    );
  });

  it('passes change password commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const passwordDto = {
      currentPassword: 'old-password',
      newPassword: 'new-password',
    };
    const response = {
      message: 'Password changed successfully',
    };

    usersService.changePassword.mockResolvedValue(response);

    await expect(
      controller.changePassword(user, passwordDto),
    ).resolves.toBe(response);

    expect(usersService.changePassword).toHaveBeenCalledWith(
      'user-1',
      passwordDto,
    );
  });

  it('passes delete account commands to the service', async () => {
    const user = { sub: 'user-1', email: 'u@test.com' };
    const deleteDto = { confirmationText: 'delete' };
    const response = {
      message: 'Account deleted successfully',
    };

    usersService.deleteAccount.mockResolvedValue(response);

    await expect(controller.deleteMe(user, deleteDto)).resolves.toBe(response);

    expect(usersService.deleteAccount).toHaveBeenCalledWith(
      'user-1',
      deleteDto,
    );
  });

  it('is protected by JwtAuthGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, UsersController);

    expect(guards).toContain(JwtAuthGuard);
  });

  it('exposes the expected users routes', () => {
    expect(Reflect.getMetadata(PATH_METADATA, UsersController)).toBe('users');

    const routes: Array<{
      methodName: UsersControllerMethod;
      path: string;
      requestMethod: RequestMethod;
    }> = [
      {
        methodName: 'getMe',
        path: 'me',
        requestMethod: RequestMethod.GET,
      },
      {
        methodName: 'updateMe',
        path: 'me',
        requestMethod: RequestMethod.PATCH,
      },
      {
        methodName: 'changePassword',
        path: 'me/password',
        requestMethod: RequestMethod.PATCH,
      },
      {
        methodName: 'deleteMe',
        path: 'me',
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