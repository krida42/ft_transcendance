import { ApiProperty } from '@nestjs/swagger'; // Importez ceci si vous utilisez Swagger pour la documentation
import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true,
  })
  pseudo: string;
  
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string; 
  
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  display_name: string;

  constructor(pseudo: string, password: string , email: string, display_name: string) {
    this.pseudo = pseudo;
    this.password = password;
    this.email = email;
    this.display_name = display_name;
  }

}


