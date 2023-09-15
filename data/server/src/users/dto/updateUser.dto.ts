import { ApiProperty } from '@nestjs/swagger'; // Importez ceci si vous utilisez Swagger pour la documentation
import { IsNotEmpty, Length, IsEmail, IsOptional, isPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'JohnetteDoe@gmail.com',
    required: false,
  })
  email: string;

  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty({
    example: 'Johnette Doe',
    required: false,
  })
  pseudo: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/JohnetteDoe.jpg',
    required: false,
  })
  image_link: string;

  @IsOptional()
  @ApiProperty({
    example: '0611111111',
    required: false,
  })
  phone?: string;

  constructor(
    email?: string,
    pseudo?: string,
    image_link?: string,
    phone?: string,
  ) {
    this.email = email;
    this.pseudo = pseudo;
    this.image_link = image_link;
    this.phone = phone;
  }
}
