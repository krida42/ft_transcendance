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
  public chanId!: string;
 
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'chanName',
  })
  public chanName!: string;

  @ApiProperty()
  @Column({
    unique: false,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    field: 'ownerId',
  })
  public ownerId!: string;

  @ApiProperty()
  @Column({
    type: DataTypes.ENUM('Direct', 'Public', 'Protected', 'Private'),
    allowNull: false,
    defaultValue: 'Public',
    field: 'chanType',
  })
  public chanType!: string;

  @Column({
    unique: false,
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'nannan',
    field: 'chanPassword',
  })
  public chanPassword!: string;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'nbUser',
  })
  public nbUser!: number;

  @Column({
    unique: false,
    allowNull: true,
    type: DataTypes.STRING,
    field: 'imgName',
  })
  public imgName!: string;

  @Column({
    unique: false,
    allowNull: true,
    type: DataTypes.STRING,
    field: 'imgType',
  })
  public imgType!: string;

  @Column({
    unique: false,
    allowNull: true,
    type: DataTypes.BLOB('long'),
    field: 'imgData',
  })
  public imgData!: Blob;

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
