import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RelationDto {
  @ApiProperty({
    example: 'vvbarbier',
    description: "login",
  })
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: 'ssloquet',
    description: "linkedlogin",
  })
  @IsNotEmpty()
  linkedlogin: string;
}
