import { Album } from '../../entities/album.entity';
import { IAlbumRepository } from '../../repositories/album.repository';
import { ICacheManager } from '../../interfaces/cache.interface';

export class FindAllAlbumUseCase {
	constructor(
		private readonly repository: IAlbumRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(): Promise<Album[]> {
		const cachedAlbums = await this.cacheManager.getCachedObject<Album[]>(
			'albums',
		);

		if (cachedAlbums) return cachedAlbums;

		const albums = await this.repository.findAll();

		await this.cacheManager.setObjectInCache('albums', albums);

		return albums;
	}
}
