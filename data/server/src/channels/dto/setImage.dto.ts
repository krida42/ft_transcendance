import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { MaxLength, MinLength, IsAlphanumeric } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadDto {
  @Type(() => File)
  @IsNotEmpty()
  file!: Express.Multer.File;
}
