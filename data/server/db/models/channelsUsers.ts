import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import { Table, Column, Model, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { User } from './user';
import { Channels } from './channels';

@Table
export class ChannelsUsers extends Model {

  @ApiProperty()
  @PrimaryKey
  @ForeignKey(() => Channels)
  @Column({
    allowNull: false,
    type: DataTypes.UUID,
    field: 'chanId',
  })
  public chanId: string;

  @ApiProperty()
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataTypes.UUID,
    field: 'userId',
  })
  public userId: string;

  @ApiProperty()
  @Column({
    type: DataTypes.ENUM('Direct', 'Owner', 'Admin', 'User', 'Muted', 'Banned', 'Invited'),
    allowNull: false,
    defaultValue: 'User',
    field: 'userStatus',
  })
  public userStatus: string;

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
