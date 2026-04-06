import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { RecognitionService } from './recognition.service';

type Job = { id: string; filePath: string; metaPath: string };

@Injectable()
export class QueueService implements OnModuleInit {
  private queue: Job[] = [];
  private processing = false;

  constructor(private readonly recognition: RecognitionService) {}

  enqueue(job: Job) {
    this.queue.push(job);
  }

  async onModuleInit() {
    setInterval(() => this.processNext(), 2000);
  }

  private async processNext() {
    if (this.processing) return;
    const job = this.queue.shift();
    if (!job) return;
    this.processing = true;
    try {
      const updating = await this.readMeta(job.metaPath);
      updating.status = 'processing';
      await fs.writeFile(job.metaPath, JSON.stringify(updating, null, 2), 'utf8');
      const result = await this.recognition.recognize(job.filePath);
      updating.status = 'processed';
      updating.result = result;
      updating.processedAt = new Date().toISOString();
      await fs.writeFile(job.metaPath, JSON.stringify(updating, null, 2), 'utf8');
    } catch (e) {
    } finally {
      this.processing = false;
    }
  }

  private async readMeta(path: string) {
    try {
      const raw = await fs.readFile(path, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }
}
