import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Column, Model, Table, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Friends extends Model {

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.UUID,
    field: 'sender_id',
  })
  public sender_id!: string | null;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.UUID,
    field: 'receiver_id',
  })
  public receiver_id!: string | null;

  @Column({
    type: DataTypes.ENUM('Pending', 'Active', 'Blocked'),
    allowNull: false,
    defaultValue: 'Pending',
    field: 'status',
  })
  public status!: string;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt',
  })
  public readonly createdAt!: Date;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
  })
  public readonly updatedAt!: Date;
}
