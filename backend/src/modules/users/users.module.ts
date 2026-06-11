import { Module } from '@nestjs/common';

import { RolesGuard } from 'src/common/guards/roles.guard';

import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, RolesGuard],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
