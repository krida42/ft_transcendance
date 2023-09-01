import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true,
  })
  @ApiProperty()
  @IsOptional()
  @Length(3, 20)
  pseudo: string;

  @ApiProperty()
  @IsOptional()
  @Length(3, 20)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @Length(3, 20)
  display_name: string;

  constructor(
    pseudo: string,
    password: string,
    email: string,
    display_name: string,
  ) {
    this.pseudo = pseudo;
    this.password = password;
    this.email = email;
    this.display_name = display_name;
  }
}
