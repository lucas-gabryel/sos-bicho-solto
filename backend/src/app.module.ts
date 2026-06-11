import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env.config';
import { PrismaModule } from './database/prisma.module';
import { HealthController } from './health/health.controller';
import { AdoptionsModule } from './modules/adoptions/adoptions.module';
import { AnimalsModule } from './modules/animals/animals.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TutorsModule } from './modules/tutors/tutors.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AnimalsModule,
    TutorsModule,
    AdoptionsModule,
    DashboardModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
