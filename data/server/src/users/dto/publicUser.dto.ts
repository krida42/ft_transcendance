import { ApiProperty } from '@nestjs/swagger'; // Importez ceci si vous utilisez Swagger pour la documentation
import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  isPhoneNumber,
} from 'class-validator';
import { Is } from 'sequelize-typescript';

export class PublicUserDto {
  @IsNotEmpty()
  id: string;

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

  constructor(id: string, login: string, pseudo: string, avatar: string) {
    this.id = id;
    this.login = login;
    this.pseudo = pseudo;
    this.avatar = avatar;
  }
}
