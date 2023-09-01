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
    }
  )
  public confidential_id: number;

  @ApiProperty()
  @Column({
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: 'uuid_generate_v4()',
    }
  )
  public public_id: string;

  @ApiProperty()
  @Column({
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  )
  public pseudo: string;
  
  @ApiProperty()
  @Column({
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  )
  public password: string;
  
  @ApiProperty()
  @Column({
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  )
  public email: string;

  @ApiProperty()
  @Column({
      type: DataTypes.STRING,
      allowNull: false,
    }
  )
  public display_name: string;

  @ApiProperty()
  @Column({
      type: DataTypes.DATE,
      allowNull: false,
    }
  )
  public readonly createdAt: Date;
  @ApiProperty()
  @Column({
      type: DataTypes.DATE,
      allowNull: false,
    }
  )
  public readonly updatedAt: Date;
  
}
