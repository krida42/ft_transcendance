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
  @ApiProperty()
  @Column({
    unique: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    field: 'chanId',
  })
  public chanId: string;

  @ApiProperty()
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
    type: DataTypes.UUID,
    allowNull: false,
    unique: false,
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

  @ApiProperty()
  @MinLength(6, { message: 'Channel password is too short (min 6 characters)' })
  @MaxLength(128, {
    message: 'Channel password is too long (max 128 characters)',
  })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    defaultValue: 'nan',
    field: 'chanPassword',
  })
  public chanPassword: string;

  @ApiProperty()
  @Default(null)
  @Column({
    allowNull: true,
    type: DataTypes.BLOB,
    field: 'chanImage',
    validate: {
      isImage(value: Buffer) {
        if (!value) {
          return;
        }
        const validFormats = ['image/jpeg', 'image/png'];
        if (!validFormats.includes(value.slice(0, 4).toString('hex'))) {
          throw new Error('Invalid image format');
        }
      },
      isNotTooLarge(value: Buffer) {
        if (!value) {
          return;
        }
        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (value.length > maxSize) {
          throw new Error('Image size exceeds the limit');
        }
      },
    },
  })
  public chanImage: Buffer;

  @ApiProperty()
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt',
  })
  public readonly createdAt: Date;

  @ApiProperty()
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
  })
  public readonly updatedAt: Date;
}
