import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user';
import { Achievements } from './achievements';

@Table
export class UserAchievements extends Model {

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
    type: DataTypes.UUID,
    allowNull: false,
    field: 'public_id',
  })
  public public_id!: string;

  @ForeignKey(() => Achievements)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'achievement_id',
  })
  public achievement_id!: number;

  @BelongsTo(() => User, 'public_id')
  public user?: User;

  @BelongsTo(() => Achievements, 'achievement_id')
  public achievement?: Achievements;
}
