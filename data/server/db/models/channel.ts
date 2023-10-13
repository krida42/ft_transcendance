import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Channel extends Model {
  @ApiProperty()
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id', 
  })
  public id: number;

  @ApiProperty()
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
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    defaultValue: '',
    field: 'pwd', 
  })
  public pwd: string;

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