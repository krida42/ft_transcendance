import { ApiProperty } from '@nestjs/swagger'; // Importez ceci si vous utilisez Swagger pour la documentation
import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  isPhoneNumber,
} from 'class-validator';
import { Is } from 'sequelize-typescript';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 95263,
    required: true,
  })
  fortyTwo_id: number;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'JohnnyJohnnyDoe@gmail.com',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'JDoe',
    required: true,
  })
  login: string;

  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty({
    example: 'John Doe',
    required: true,
  })
  pseudo: string;

  @IsNotEmpty()
  @ApiProperty({
    example:
      'https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/JohnDoe.jpg',
    required: true,
  })
  avatar: string;

  @IsOptional()
  @ApiProperty({
    example: '0634441413',
    required: false,
  })
  phone?: string;

  @IsOptional()
  @ApiProperty({
    example: 'user',
    required: false,
  })
  roles?: string[];

  twoFactorSecret?: boolean;

  constructor(
    fortyTwo_id: number,
    email: string,
    login: string,
    pseudo: string,
    avatar: string,
    phone?: string,
    roles?: string[],
  ) {
    this.fortyTwo_id = fortyTwo_id;
    this.email = email;
    this.login = login;
    this.pseudo = pseudo;
    this.avatar = avatar;
    this.phone = phone;
    this.roles = roles;
  }

  static clone(source: CreateUserDto): CreateUserDto {
    const copy = new CreateUserDto(
      source.fortyTwo_id,
      source.email,
      source.login,
      source.pseudo,
      source.avatar,
      source.phone,
      source.roles,
    );
    return copy;
  }
}
