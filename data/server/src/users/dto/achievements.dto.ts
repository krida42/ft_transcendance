import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
} from 'class-validator';

export class AchievementsDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsNotEmpty()
  icon: string;

  constructor(name: string, description: string, icon: string) {
    this.name = name;
    this.description = description;
    this.icon = icon;
  }
}
