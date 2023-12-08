import { DataTypes } from 'sequelize';
import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user';

@Table
export class Games extends Model {

  @PrimaryKey
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
  })
  public id!: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.UUID,
    field: 'player1_id',
  })
  public player1_id!: string;
  
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.UUID,
    field: 'player2_id',
  })
  public player2_id!: string;
  
  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'score1',
  })
  public score1!: number;

  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'score2',
  })
  public score2!: number;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'time',
  })
  public time!: number;

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
