import { ApiProperty } from '@nestjs/swagger'; // Importez ceci si vous utilisez Swagger pour la documentation
import { User } from 'db/models/user';

export class UserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  constructor(id: number, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  static fromEntity(entity: User): UserDTO {
    return new UserDTO(entity.id, entity.username, entity.email);
  }
}
