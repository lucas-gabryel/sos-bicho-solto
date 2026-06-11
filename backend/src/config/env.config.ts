import { plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DATABASE_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRES_IN!: string;

  @IsOptional()
  @IsNumber()
  PORT?: number;

  @IsUrl({
    require_tld: false,
  })
  FRONTEND_URL!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return {
    databaseUrl: validatedConfig.DATABASE_URL,
    jwtSecret: validatedConfig.JWT_SECRET,
    jwtExpiresIn: validatedConfig.JWT_EXPIRES_IN,
    port: validatedConfig.PORT ?? 3333,
    frontendUrl: validatedConfig.FRONTEND_URL,
  };
}
