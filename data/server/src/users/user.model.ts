import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  username: string;

  @Column
  email: string;

  @Column({ defaultValue: false })
  isActive: boolean;

  @Column
  boubliboulga1: string;
}
