import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const ALLOWED_PLATFORMS = ['customer-mobile', 'admin-web', 'pressing-web', 'customer-web'] as const;

export class LoginDto {
  @ApiProperty({ example: 'admin@pressing237.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'pressing-237-bastos', required: false })
  @IsOptional()
  @IsString()
  tenantSlug?: string;

  @ApiProperty({ example: 'customer-mobile', enum: ALLOWED_PLATFORMS, required: false })
  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_PLATFORMS)
  platform?: string;
}
