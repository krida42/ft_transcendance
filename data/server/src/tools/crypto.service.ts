import { createCipheriv, randomBytes, scrypt } from 'crypto';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { promisify } from 'util';

const algorithm = process.env.ALGORITHM;
const password = process.env.PASSWORD;
const iv = process.env.IV_LENGTH;
@Injectable()
export class CryptoService {
  // Chiffrement avec le module crypto de Node.js
  static async encrypt(text: string): Promise<Buffer | null> {
    if (!password || !algorithm || !iv) return null;

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv(algorithm, key, iv);

    const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);
    console.log('encryptedText vincent: ', encryptedText.toString());
    console.log(
      'decryptedText vincent: ',
      this.decrypt(encryptedText).toString(),
    );
    return encryptedText;
  }

  // Déchiffrement avec le module crypto de Node.js
  static async decrypt(encryptedData: Buffer) {
    if (!password || !algorithm || !iv) return null;

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const decryptedText = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);
    return decryptedText.toString();
  }
}
