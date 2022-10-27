export interface ICacheManager {
  getCachedObject<T>(key: string): Promise<any>;

  setObjectInCache(key: string, value: any): Promise<any>;
}
