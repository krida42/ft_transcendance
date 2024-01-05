import { ApiProperty } from '@nestjs/swagger'; // Importez ceci si vous utilisez Swagger pour la documentation
import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  isPhoneNumber,
  IsAlphanumeric,
  MinLength,
  MaxLength
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
  @MinLength(3, { message: 'Login is too short (min 3 characters)' })
  @MaxLength(20, { message: 'Login name is too long (max 20 characters)' })
  @IsAlphanumeric('en-US', { message: 'Invalid characters in login' })
  @ApiProperty({
    example: 'JDoe',
    required: true,
  })
  login: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'pseudo is too short (min 3 characters)' })
  @MaxLength(20, { message: 'pseudo name is too long (max 20 characters)' })
  @IsAlphanumeric('en-US', { message: 'Invalid characters in pseudo' })
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
