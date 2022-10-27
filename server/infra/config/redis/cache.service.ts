import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ICacheManager } from '../../../domain/interfaces/cache.interface';

@Injectable()
export class CacheService implements ICacheManager {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async getCachedObject(key: string): Promise<any> {
    const result = await this.cacheManager.get<string>(key);
    return JSON.parse(result);
  }

  public async setObjectInCache(key: string, value: any): Promise<any> {
    console.log('CacheService.setObjectInCache()', key, value);
    const valueInString = JSON.stringify(value);
    await this.cacheManager.set(key, valueInString);
  }
}
