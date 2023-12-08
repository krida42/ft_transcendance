import { ApiProperty } from '@nestjs/swagger';
import { DataTypes } from 'sequelize';
import {
  AfterCreate,
  AfterFind,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeFind,
  BeforeUpdate,
  Column,
  Model,
  PrimaryKey,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { DEVS } from 'src/users/const';
import { CryptoService } from 'src/tools/crypto.service';

@Table
export class User extends Model {
  @PrimaryKey
  @ApiProperty()
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'confidential_id',
  })
  public confidential_id!: number;

  @ApiProperty()
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
    field: 'public_id',
  })
  public public_id!: string;

  @ApiProperty()
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'fortyTwo_id',
  })
  public fortyTwo_id!: number;

  @ApiProperty()
  @Column({
    type: DataTypes.BLOB('tiny'),
    allowNull: false,
    unique: true,
    field: 'email',
    validate: { isEmail: true },
  })
  public email!: string;

  @ApiProperty()
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    field: 'login',
  })
  public login!: string;

  @ApiProperty()
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'pseudo',
  })
  public pseudo!: string;

  @ApiProperty()
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    field: 'avatar',
  })
  public avatar!: string;

  @ApiProperty()
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'phone',
  })
  public phone!: number;

  @ApiProperty()
  @Column({
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    field: 'roles',
    defaultValue: ['user'],
  })
  public roles!: string[];

  @ApiProperty()
  @Column({
    type: DataTypes.BLOB('tiny'),
    allowNull: true,
    field: 'refreshToken',
  })
  public refreshToken!: string | null;

  @ApiProperty()
  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null,
    field: 'twoFactorEnable',
  })
  public twoFactorEnable!: boolean;

  @ApiProperty()
  @Column({
    type: DataTypes.BLOB('tiny'),
    allowNull: true,
    field: 'twoFactorSecret',
  })
  public twoFactorSecret!: string | null;

  @ApiProperty()
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt',
  })
  public readonly createdAt!: Date;

  @ApiProperty()
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
  })
  public readonly updatedAt!: Date;

  @BeforeCreate
  @BeforeUpdate
  static encryptText = async (user: any) => {
    if (!user) return;
    if (user.email && typeof user.email === 'string')
      user.email = await CryptoService.encrypt(user.email);
    if (user.refreshToken && typeof user.refreshToken === 'string')
      user.refreshToken = await CryptoService.encrypt(user.refreshToken);
    if (user.twoFactorSecret && typeof user.twoFactorSecret === 'string')
      user.twoFactorSecret = await CryptoService.encrypt(user.twoFactorSecret);

    console.log('encryptText mec user.email: ', user.email.toString());
  };

  @AfterFind
  static async decryptText(user: User) {
    if (!user) return;
    if (user.email) {
      // console.log(
      //   'after find decryptText mec user.email: ',
      //   user.email.toString(),
      //   'and his login: ',
      //   user.login,
      // );
      if (user.login === 'kisikaya')
        console.log(
          `after find decryptText mec user.email: ${
            user.email
          }, and his login: ${
            user.login
          }, and his decrypted email: ${await CryptoService.decrypt(
            Buffer.from(user.email),
          )}`,
        );

      user.email = (await CryptoService.decrypt(
        Buffer.from(user.email),
      )) as string;
      // user.email = await CryptoService.decrypt(user.email);
    }
    if (user.refreshToken)
      user.refreshToken = await CryptoService.decrypt(
        Buffer.from(user.refreshToken),
      );
    if (user.twoFactorSecret)
      user.twoFactorSecret = await CryptoService.decrypt(
        Buffer.from(user.twoFactorSecret),
      );
  }

  @BeforeCreate
  static setDefaultRole = async (user: User) => {
    user.roles = ['user'];
  };

  @BeforeCreate
  static setDevRole = async (user: User) => {
    if (DEVS.includes(user.login)) user.roles = ['user', 'admin', 'dev'];
  };
}
