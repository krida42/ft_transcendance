import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import {
  Column,
  Model,
  PrimaryKey,
  Table,
  AllowNull,
  Default,
  Length,
} from 'sequelize-typescript';
import { MaxLength, MinLength, IsAlphanumeric } from 'class-validator';

@Table
export class Channels extends Model {
  @PrimaryKey
  @Column({
    unique: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    field: 'chanId',
  })
  public chanId: string;

 
  @MinLength(3, { message: 'Channel name is too short (min 3 characters)' })
  @MaxLength(20, { message: 'Channel name is too long (max 20 characters)' })
  @IsAlphanumeric('en-US', { message: 'Invalid characters in channel name' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'chanName',
  })
  public chanName: string;

  @ApiProperty()
  @Column({
    unique: false,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    field: 'ownerId',
  })
  public ownerId: string;

  @ApiProperty()
  @Column({
    type: DataTypes.ENUM('Direct', 'Public', 'Protected', 'Private'),
    allowNull: false,
    defaultValue: 'Public',
    field: 'chanType',
  })
  public chanType: string;

  @MinLength(6, { message: 'Channel password is too short (min 6 characters)' })
  @MaxLength(128, {
    message: 'Channel password is too long (max 128 characters)',
   })
  @Column({
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'nannan',
    field: 'chanPassword',
  })
  public chanPassword: string;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'nbUser',
  })
  public nbUser: number;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt',
  })
  public readonly createdAt: Date;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
  })
  public readonly updatedAt: Date;
}
