import { Expose } from 'class-transformer';
// A completer avec ApiProperty
export class ResponseUserDto {
  @Expose({ name: 'public_id' })
  public_id!: string;

  @Expose()
  email!: string;

  @Expose()
  login!: string;

  @Expose()
  pseudo!: string;

  @Expose({ name: 'avatar' })
  avatar!: string;

  @Expose()
  phone!: string | null;

  @Expose()
  roles!: string[];

  @Expose()
  twoFactorAuthenticated!: boolean;
}
