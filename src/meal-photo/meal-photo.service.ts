import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { join, parse } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class MealPhotoService {
  constructor(private readonly queueService: QueueService) {}

  async handleUploadedFile(file: Express.Multer.File) {
    const id = parse(file.filename).name;
    const uploadPath = join(process.cwd(), 'uploads', 'meal-photos', file.filename);
    const meta = {
      id,
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/meal-photos/${file.filename}`,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };
    const metaPath = uploadPath + '.json';
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8');
    this.queueService.enqueue({ id, filePath: uploadPath, metaPath });
    return { id, url: meta.path };
  }

  async getMetadata(id: string) {
    const metaPath = join(process.cwd(), 'uploads', 'meal-photos', `${id}.json`);
    try {
      const raw = await fs.readFile(metaPath, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      return { error: 'metadata_not_found' };
    }
  }

  async listAllMetadata() {
    const dir = join(process.cwd(), 'uploads', 'meal-photos');
    try {
      const names = await fs.readdir(dir);
      const metas = [];
      for (const n of names) {
        if (n.endsWith('.json')) {
          const raw = await fs.readFile(join(dir, n), 'utf8');
          metas.push(JSON.parse(raw));
        }
      }
      return metas;
    } catch (e) {
      return [];
    }
  }
}
