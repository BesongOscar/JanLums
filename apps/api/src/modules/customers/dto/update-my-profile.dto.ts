import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMyProfileDto {
  @ApiPropertyOptional({ description: 'First name', maxLength: 50, example: 'Oscar' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', maxLength: 50, example: 'Besong' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+237600000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Address', example: '123 Main Street, Douala' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Douala' })
  @IsOptional()
  @IsString()
  city?: string;
}
