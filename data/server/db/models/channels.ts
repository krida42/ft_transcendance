import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Column, Model, Table, AllowNull, Default, Length } from 'sequelize-typescript';
import { MaxLength, MinLength, IsAlphanumeric } from 'class-validator';

@Table
export class Channels extends Model {
  @ApiProperty()
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id', 
  })
  public id: number;

  @ApiProperty()
  @MinLength(3, { message: 'Channel name is too short (min 3 characters)' })
  @MaxLength(20, { message: 'Channel name is too long (max 20 characters)' })
  @IsAlphanumeric('en-US', { message: 'Invalid characters in channel name' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'name', 
  })
  public name: string;

  @ApiProperty()
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    field: 'owner', 
  })
  public owner: string;

  @ApiProperty()
  @Column({
    type: DataTypes.ENUM('Direct', 'Public', 'Protected', 'Private'),
    allowNull: false,
    defaultValue: 'Public',
    field: 'channelType',
  })
  public channelType: string;

  @ApiProperty()
  @MinLength(6, { message: 'Channel password is too short (min 6 characters)' })
  @MaxLength(128, { message: 'Channel password is too long (max 128 characters)' })
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    defaultValue: '',
    field: 'password', 
  })
  public password: string;

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

  @ApiProperty()
  @AllowNull(true)
  @Default(null)
  @Column({
    type: DataTypes.BLOB('long'),
    field: 'imageData',
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
  public imageData: Buffer;

}