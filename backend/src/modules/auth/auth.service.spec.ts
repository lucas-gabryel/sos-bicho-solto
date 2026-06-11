import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  const user: User = {
    id: 'user-id',
    name: 'Administrador',
    email: 'admin@sosbichosolto.com',
    password: hashSync('Admin@123', 10),
    role: UserRole.ADMIN,
    createdAt: new Date('2026-06-11T00:00:00.000Z'),
    updatedAt: new Date('2026-06-11T00:00:00.000Z'),
  };

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const usersServiceMock = {
    findByEmail: jest.fn<
      ReturnType<UsersService['findByEmail']>,
      Parameters<UsersService['findByEmail']>
    >(),
    findById: jest.fn<
      ReturnType<UsersService['findById']>,
      Parameters<UsersService['findById']>
    >(),
    toResponseDto: jest.fn<
      ReturnType<UsersService['toResponseDto']>,
      Parameters<UsersService['toResponseDto']>
    >(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn<
      ReturnType<JwtService['signAsync']>,
      Parameters<JwtService['signAsync']>
    >(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(
      usersServiceMock as unknown as UsersService,
      jwtServiceMock as unknown as JwtService,
    );
  });

  it('should login successfully with valid credentials', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(user);
    usersServiceMock.toResponseDto.mockReturnValue(userResponse);
    jwtServiceMock.signAsync.mockResolvedValue('jwt-token');

    const result = await authService.login({
      email: user.email,
      password: 'Admin@123',
    });

    expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: userResponse,
    });
  });

  it('should throw when user does not exist', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'missing@sosbichosolto.com',
        password: 'Admin@123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw when password is invalid', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(user);

    await expect(
      authService.login({
        email: user.email,
        password: 'senha-errada',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return current user data', async () => {
    usersServiceMock.findById.mockResolvedValue(user);
    usersServiceMock.toResponseDto.mockReturnValue(userResponse);

    const result = await authService.me(user.id);

    expect(usersServiceMock.findById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(userResponse);
  });
});
