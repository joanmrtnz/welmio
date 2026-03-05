import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwt = {
  signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // REGISTER
  it('should register a new user', async () => {

    mockPrisma.user.create.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
    });

    const result = await service.register({
      email: 'test@test.com',
      password: '123456',
    });

    expect(result).toEqual({
      access_token: 'fake-jwt-token',
    });

    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

  it('should throw conflict if email exists', async () => {

    mockPrisma.user.create.mockRejectedValue(
      new Error('Unique constraint failed')
    );

    await expect(
      service.register({
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toThrow();
  });

  it('should reject short password', async () => {

    await expect(
      service.register({
        email: 'test@test.com',
        password: '123',
      }),
    ).rejects.toThrow();
  });

  // LOGIN
  it('should login user', async () => {

    const hashed = await bcrypt.hash('123456', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: hashed,
    });

    const result = await service.login({
      email: 'test@test.com',
      password: '123456',
    });

    expect(result).toEqual({
      access_token: 'fake-jwt-token',
    });
  });

  it('should reject if user not found', async () => {

    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toThrow();
  });

  // sendResetPasswordCode
  it('should generate reset code', async () => {

    mockPrisma.user.findUnique.mockResolvedValue({
      email: 'test@test.com',
    });

    mockPrisma.user.update.mockResolvedValue({});

    const result = await service.sendResetPasswordCode('test@test.com');

    expect(result.message).toBeDefined();
    expect(mockPrisma.user.update).toHaveBeenCalled();
  });

  // validateResetPasswordCode
  it('should validate reset code', async () => {

    const code = '123456';
    const hash = await bcrypt.hash(code, 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      resetPasswordCode: hash,
      resetPasswordCodeExpiry: new Date(Date.now() + 10000),
    });

    const result = await service.validateResetPasswordCode(
      'test@test.com',
      code,
    );

    expect(result.valid).toBe(true);
  });

  // resetPassword
  it('should reset password', async () => {

    const code = '123456';
    const hashedCode = await bcrypt.hash(code, 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      email: 'test@test.com',
      password: 'oldPasswordHash',
      resetPasswordCode: hashedCode,
      resetPasswordCodeExpiry: new Date(Date.now() + 10000),
    });

    mockPrisma.user.update.mockResolvedValue({});

    const result = await service.resetPassword(
      'test@test.com',
      code,
      'newpassword',
    );

    expect(result).toEqual({
      message: 'Password updated successfully',
    });

    expect(mockPrisma.user.update).toHaveBeenCalled();
  });

  it('should throw if reset code is invalid', async () => {

    const hashedCode = await bcrypt.hash('123456', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      resetPasswordCode: hashedCode,
      resetPasswordCodeExpiry: new Date(Date.now() + 10000),
    });

    await expect(
      service.resetPassword(
        'test@test.com',
        'wrong-code',
        'newpassword',
      ),
    ).rejects.toThrow();
  });
});
