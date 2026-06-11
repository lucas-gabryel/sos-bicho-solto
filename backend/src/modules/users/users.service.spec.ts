import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { compare } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  const user: User = {
    id: '7f1b48f8-9fdb-4c84-93fb-8442b8aa7c7d',
    name: 'Administrador',
    email: 'admin@sosbichosolto.com',
    password: 'hashed-password',
    role: UserRole.ADMIN,
    createdAt: new Date('2026-06-11T00:00:00.000Z'),
    updatedAt: new Date('2026-06-11T00:00:00.000Z'),
  };

  const usersRepositoryMock = {
    findAll: jest.fn<
      ReturnType<UsersRepository['findAll']>,
      Parameters<UsersRepository['findAll']>
    >(),
    findByEmail: jest.fn<
      ReturnType<UsersRepository['findByEmail']>,
      Parameters<UsersRepository['findByEmail']>
    >(),
    findById: jest.fn<
      ReturnType<UsersRepository['findById']>,
      Parameters<UsersRepository['findById']>
    >(),
    create: jest.fn<
      ReturnType<UsersRepository['create']>,
      Parameters<UsersRepository['create']>
    >(),
    update: jest.fn<
      ReturnType<UsersRepository['update']>,
      Parameters<UsersRepository['update']>
    >(),
    delete: jest.fn<
      ReturnType<UsersRepository['delete']>,
      Parameters<UsersRepository['delete']>
    >(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    usersService = new UsersService(
      usersRepositoryMock as unknown as UsersRepository,
    );
  });

  it('should create a user successfully with hashed password', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Novo Admin',
      email: 'novo@sosbichosolto.com',
      password: 'Admin@123',
      role: UserRole.ADMIN,
    };

    usersRepositoryMock.findByEmail.mockResolvedValue(null);
    usersRepositoryMock.create.mockImplementation(async (data) => ({
      ...user,
      id: 'new-user-id',
      name: data.name as string,
      email: data.email as string,
      password: data.password as string,
      role: data.role as UserRole,
    }));

    const result = await usersService.create(createUserDto);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
    expect(usersRepositoryMock.create).toHaveBeenCalled();
    const createArg = usersRepositoryMock.create.mock.calls[0][0];
    expect(createArg.password).not.toBe(createUserDto.password);
    await expect(
      compare(createUserDto.password, createArg.password as string),
    ).resolves.toBe(true);
    expect(result.email).toBe(createUserDto.email);
    expect(result.role).toBe(createUserDto.role);
  });

  it('should throw conflict when creating with duplicated email', async () => {
    usersRepositoryMock.findByEmail.mockResolvedValue(user);

    await expect(
      usersService.create({
        name: 'Duplicado',
        email: user.email,
        password: 'Admin@123',
        role: UserRole.ADMIN,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return users list', async () => {
    usersRepositoryMock.findAll.mockResolvedValue([user]);

    const result = await usersService.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe(user.email);
  });

  it('should throw when user is not found by id', async () => {
    usersRepositoryMock.findById.mockResolvedValue(null);

    await expect(usersService.findById('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a user successfully', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Nome Atualizado',
      email: 'atualizado@sosbichosolto.com',
      password: 'NovaSenha@123',
      role: UserRole.PROTETOR,
    };

    usersRepositoryMock.findById.mockResolvedValue(user);
    usersRepositoryMock.findByEmail.mockResolvedValue(null);
    usersRepositoryMock.update.mockImplementation(async (_id, data) => ({
      ...user,
      name: data.name as string,
      email: data.email as string,
      password: data.password as string,
      role: data.role as UserRole,
    }));

    const result = await usersService.update(user.id, updateUserDto);

    expect(usersRepositoryMock.update).toHaveBeenCalledWith(
      user.id,
      expect.objectContaining({
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: updateUserDto.role,
      }),
    );
    const updateArg = usersRepositoryMock.update.mock.calls[0][1];
    expect(updateArg.password).not.toBe(updateUserDto.password);
    await expect(
      compare(updateUserDto.password!, updateArg.password as string),
    ).resolves.toBe(true);
    expect(result.email).toBe(updateUserDto.email);
    expect(result.role).toBe(updateUserDto.role);
  });

  it('should throw conflict when updating with duplicated email', async () => {
    const anotherUser: User = {
      ...user,
      id: 'another-user-id',
      email: 'another@sosbichosolto.com',
    };

    usersRepositoryMock.findById.mockResolvedValue(user);
    usersRepositoryMock.findByEmail.mockResolvedValue(anotherUser);

    await expect(
      usersService.update(user.id, {
        email: anotherUser.email,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should remove a user successfully', async () => {
    usersRepositoryMock.findById.mockResolvedValue(user);
    usersRepositoryMock.delete.mockResolvedValue(user);

    await usersService.remove(user.id);

    expect(usersRepositoryMock.delete).toHaveBeenCalledWith(user.id);
  });
});
