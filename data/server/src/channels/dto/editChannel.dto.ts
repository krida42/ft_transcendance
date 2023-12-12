import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { MaxLength, MinLength, IsAlphanumeric } from 'class-validator';

export class EditChannelDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Channel name is too short (min 3 characters)' })
  @MaxLength(20, { message: 'Channel name is too long (max 20 characters)' })
  @IsAlphanumeric('en-US', { message: 'Invalid characters in channel name' })
  @ApiProperty({
    example: 'chan',
    description: 'channel name',
  })
  chanName!: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Public',
    description: 'type de channel',
    enum: ['Direct', 'Public', 'Protected', 'Private'],
  })
  chanType!: string;

  @IsNotEmpty()
  // @MinLength(6, { message: 'Channel password is too short (min 6 characters)' })
  // @MaxLength(128, { message: 'Channel password is too long (max 128 characters)'})
  @ApiProperty({
    example: 'pass',
    description: 'channel password',
  })
  chanPassword!: string;
}
