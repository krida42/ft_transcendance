import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Le nombre de "rounds" de hachage. Plus le nombre est élevé, plus le hachage est sécurisé mais prend plus de temps.
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await compare(plainPassword, hashedPassword);
    return isMatch;
  }
}
