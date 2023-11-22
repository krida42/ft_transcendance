import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  isPhoneNumber,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'JohnetteDoe@gmail.com',
    required: false,
  })
  email?: string;

  @IsOptional()
  @Length(3, 20)
  @ApiProperty({
    example: 'Johnette Doe',
    required: false,
  })
  pseudo?: string;

  @IsOptional()
  @ApiProperty({
    example:
      'https://cdn.intra.42.fr/users/90ead009dcc97ea8918354daebea3576/JohnetteDoe.jpg',
    required: false,
  })
  avatar?: string;

  @IsOptional()
  @ApiProperty({
    example: '0611111111',
    required: false,
  })
  phone?: string;

  @IsOptional()
  @ApiProperty({
    example: 'odjqwpdpfjef@E2oerkp',
    required: false,
  })
  refreshToken?: string;

  @IsOptional()
  twoFactorEnable?: boolean;

  @IsOptional()
  twoFactorSecret?: string;

  constructor(
    email?: string,
    pseudo?: string,
    avatar?: string,
    phone?: string,
    refreshToken?: string,
    twoFactorEnable?: boolean,
    twoFactorSecret?: string,
  ) {
    this.email = email;
    this.pseudo = pseudo;
    this.avatar = avatar;
    this.phone = phone;
    this.refreshToken = refreshToken;
    this.twoFactorEnable = twoFactorEnable;
    this.twoFactorSecret = twoFactorSecret;
  }
}
