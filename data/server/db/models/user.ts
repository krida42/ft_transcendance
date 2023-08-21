import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @ApiProperty()
  @Column
  firstName: string;

  @ApiProperty()
  @Column
  lastName: string;

  @ApiProperty()
  @Column
  username: string;

  @Column
  email: string;

  @Column({ defaultValue: false })
  isActive: boolean;

}
