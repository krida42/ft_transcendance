import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Johnette Doe',
    required: false,
  })
  @IsOptional()
  @Length(3, 20)
  pseudo?: string;

  @ApiProperty({
    example: 'passWORD',
    required: false,
  })
  @IsOptional()
  @Length(3, 20)
  password?: string;

  @ApiProperty({
    example: 'JohnetteJohnetteDoe@gmail.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'THE Johnette Doe',
    required: false
  })
  @IsOptional()
  @Length(3, 20)
  display_name?: string;

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
