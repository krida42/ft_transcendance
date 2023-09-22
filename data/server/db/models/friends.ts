import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Friends extends Model {

  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
    unique: false,
    defaultValue: DataTypes.UUIDV4,
    field: 'public_id_user', 
  })
  public public_id_user: string;

  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
    unique: false,
    defaultValue: DataTypes.UUIDV4,
    field: 'public_id_friend', 
  })
  public public_id_friend: string;

  @ApiProperty()
  @Column({
    type: DataTypes.ENUM('Pending', 'Active', 'Blocked'),
    allowNull: false,
    defaultValue: 'Pending',
    field: 'status',
  })
  public status: string;

}