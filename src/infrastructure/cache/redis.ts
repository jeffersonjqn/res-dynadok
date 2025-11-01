import { createClient, RedisClientType } from 'redis';
import { CacheService } from '../../application/services/cache.service';

// implementacao do cache redis

export class RedisCacheService implements CacheService {
  private client: RedisClientType;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = createClient({ url: redisUrl });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect();
  }

  async obter<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async salvar(key: string, value: any, ttl: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async remover(key: string): Promise<void> {
    await this.client.del(key);
  }
}
