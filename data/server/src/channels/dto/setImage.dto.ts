import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { MaxLength, MinLength, IsAlphanumeric } from 'class-validator';

export class SetImageDto {
  @IsOptional()
  imgName!: string;

  @IsOptional()
  imgType!: string;

  @IsOptional()
  imgData!: Buffer;
}
