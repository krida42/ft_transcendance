import { DataTypes } from 'sequelize';
import {
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class Achievements extends Model {

  @PrimaryKey
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
  })
  public id!: number;

  @Column({
	type: DataTypes.STRING,
	allowNull: false,
    field: 'name',
  })
  public name!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    field: 'description',
  })
  public description!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    field: 'icon',
  })
  public icon!: string;
  
}
