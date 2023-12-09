import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user';
import { Channels } from './channels';

@Table
export class Message extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({
    unique: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    field: 'confidentialId',
  })
  public confidentialId!: number;

  @Column({
    unique: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    field: 'msgId',
  })
  public msgId!: string;

  @ApiProperty()
  @ForeignKey(() => Channels)
  @Column({
    unique: false,
    allowNull: false,
    type: DataTypes.UUID,
    field: 'chanId',
  })
  public chanId!: string;

  @ApiProperty()
  @ForeignKey(() => User)
  @Column({
    unique: false,
    allowNull: false,
    type: DataTypes.UUID,
    field: 'userId',
  })
  public userId!: string;

  @ApiProperty()
  @Column({
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
    field: 'content',
  })
  public content!: string;

  @ApiProperty()
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt',
  })
  public readonly createdAt!: Date;

  @ApiProperty()
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
  })
  public readonly updatedAt!: Date;
}
