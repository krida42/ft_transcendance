import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';

import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';
import { Channels } from './channels';

@Table
export class ChannelsUsers extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Channels)
  @Column
  channelId: number;

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

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Channels)
  channel: Channels;
}
