import { RequestMethod } from '@nestjs/common';
import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
  logoutAll: jest.fn(),
  verifyEmail: jest.fn(),
  verifyEmailChange: jest.fn(),
  checkAccessToken: jest.fn(),
  sendResetPasswordCode: jest.fn(),
  validateResetPasswordCode: jest.fn(),
  resetPassword: jest.fn(),
};

type AuthControllerMethod =
  | 'register'
  | 'verifyEmail'
  | 'verifyEmailChange'
  | 'login'
  | 'refresh'
  | 'logout'
  | 'logoutAll'
  | 'getMe'
  | 'sendResetPasswordCode'
  | 'validateResetPasswordCode'
  | 'resetPassword';

const getHandler = (methodName: AuthControllerMethod) =>
  AuthController.prototype[methodName];

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('routes public auth commands to the service with request values', async () => {
    const registerDto = {
      fullName: 'User',
      email: 'user@test.com',
      password: 'secret1',
    };
    const loginDto = { email: 'user@test.com', password: 'secret1' };

    await controller.register(registerDto);
    await controller.login(loginDto);
    await controller.verifyEmail('verify-token');
    await controller.verifyEmailChange('change-token');
    await controller.refresh({ refreshToken: 'refresh-token' });
    await controller.logout({ refreshToken: 'refresh-token' });

    expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    expect(mockAuthService.verifyEmail).toHaveBeenCalledWith('verify-token');
    expect(mockAuthService.verifyEmailChange).toHaveBeenCalledWith(
      'change-token',
    );
    expect(mockAuthService.refresh).toHaveBeenCalledWith('refresh-token');
    expect(mockAuthService.logout).toHaveBeenCalledWith('refresh-token');
  });

  it('routes guarded auth commands using the request user', async () => {
    await controller.logoutAll({ user: { sub: 'user-1' } });
    await controller.getMe({ user: { sub: 'user-1', email: 'u@test.com' } });

    expect(mockAuthService.logoutAll).toHaveBeenCalledWith('user-1');
    expect(mockAuthService.checkAccessToken).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'u@test.com',
    });
  });

  it('routes password reset fields without changing names', async () => {
    await controller.sendResetPasswordCode('user@test.com');
    await controller.validateResetPasswordCode('user@test.com', '123456');
    await controller.resetPassword('user@test.com', '123456', 'new-secret');

    expect(mockAuthService.sendResetPasswordCode).toHaveBeenCalledWith(
      'user@test.com',
    );
    expect(mockAuthService.validateResetPasswordCode).toHaveBeenCalledWith(
      'user@test.com',
      '123456',
    );
    expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
      'user@test.com',
      '123456',
      'new-secret',
    );
  });

  it('exposes the expected auth routes', () => {
    expect(Reflect.getMetadata(PATH_METADATA, AuthController)).toBe('auth');

    const routes: Array<{
      methodName: AuthControllerMethod;
      path: string;
      requestMethod: RequestMethod;
    }> = [
      {
        methodName: 'register',
        path: 'register',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'verifyEmail',
        path: 'verify-email',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'verifyEmailChange',
        path: 'verify-email-change',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'login',
        path: 'login',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'refresh',
        path: 'refresh',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'logout',
        path: 'logout',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'logoutAll',
        path: 'logout-all',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'getMe',
        path: 'me',
        requestMethod: RequestMethod.GET,
      },
      {
        methodName: 'sendResetPasswordCode',
        path: 'send-reset-password-code',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'validateResetPasswordCode',
        path: 'validate-reset-password-code',
        requestMethod: RequestMethod.POST,
      },
      {
        methodName: 'resetPassword',
        path: 'reset-password',
        requestMethod: RequestMethod.POST,
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

  it('protects authenticated-only routes with JwtAuthGuard', () => {
    const guardedRoutes: AuthControllerMethod[] = ['logoutAll', 'getMe'];

    guardedRoutes.forEach((methodName) => {
      const guards =
        Reflect.getMetadata(GUARDS_METADATA, getHandler(methodName)) ?? [];

      expect(guards).toContain(JwtAuthGuard);
    });
  });

  it('keeps public auth routes without JwtAuthGuard', () => {
    const publicRoutes: AuthControllerMethod[] = [
      'register',
      'verifyEmail',
      'verifyEmailChange',
      'login',
      'refresh',
      'logout',
      'sendResetPasswordCode',
      'validateResetPasswordCode',
      'resetPassword',
    ];

    publicRoutes.forEach((methodName) => {
      const guards =
        Reflect.getMetadata(GUARDS_METADATA, getHandler(methodName)) ?? [];

      expect(guards).not.toContain(JwtAuthGuard);
    });
  });
});