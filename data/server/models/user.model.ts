// models/user.model.ts
import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  username: string;

  @Column
  email: string;

  // ... autres colonnes et relations
}
