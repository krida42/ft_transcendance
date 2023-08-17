import { ApiProperty } from '@nestjs/swagger'; // Importez ceci si vous utilisez Swagger pour la documentation
import { Users } from '../users.model';

export class UsersDTO {
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

  static fromEntity(entity: Users): UsersDTO {
    return new UsersDTO(entity.id, entity.username, entity.email);
  }
}
