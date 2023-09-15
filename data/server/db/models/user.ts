import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @ApiProperty()
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'confidential_id', 
  })
  public confidential_id: number;

  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
    field: 'public_id', 
  })
  public public_id: string;

  @ApiProperty()
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'fortyTwo_id',
  })
  public fortyTwo_id: number;
  
  @ApiProperty()
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'email', 
    validate: { isEmail: true },
  })
  public email: string;
  
  @ApiProperty()
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    field: 'login',
  })
  public login: string;

  @ApiProperty()
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'pseudo', 
  })
  public pseudo: string;

  @ApiProperty()
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    field: 'image_link', 
  })
  public image_link: string;

  @ApiProperty()
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'phone', 
  })
  public phone: number;

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
