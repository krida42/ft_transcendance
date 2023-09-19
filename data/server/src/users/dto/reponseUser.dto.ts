import { Transform, Expose } from 'class-transformer';
// A completer avec ApiProperty
export class ResponseUserDto {
  @Expose({ name: 'public_id' })
  publicId: string;

  @Expose()
  email: string;

  @Expose()
  login: string;

  @Expose()
  pseudo: string;

  @Expose({ name: 'image_link' })
  imageLink: string;

  @Expose()
  phone: string | null;
}
