import { Injectable } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  //constructor() {}

  async saveImageToSystem(file: Express.Multer.File, path: string) {
    const id = uuidv4();
    await writeFile(`${path}/${id}`, file.buffer, 'binary');
    return `${path}/${id}`;
  }
  getImage(path: string): ReadStream {
    const fullPath = join(process.cwd(), path);
    //const imageUrl = Buffer.from(fullPath, 'base64').toString()
    const file = createReadStream(fullPath);
    return file;
  }
  async deleteFileFromSystem(path: string) {
    const fullPath = join(process.cwd(), path);
    await unlink(fullPath);
  }
}
