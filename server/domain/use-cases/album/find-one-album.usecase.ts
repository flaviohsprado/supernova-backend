import { Album } from 'server/domain/entities/album.entity';
import { IAlbumRepository } from 'server/domain/repositories/album.repository';
import { ICacheManager } from '../../interfaces/cache.interface';
import { IExceptionService } from '../../interfaces/exceptions.interface';

export class FindOneAlbumUseCase {
	constructor(
		private readonly repository: IAlbumRepository,
		private readonly exceptionService: IExceptionService,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<Album> {
		const cachedAlbum = await this.cacheManager.getCachedObject<Album>('album');

		if (cachedAlbum) return cachedAlbum;

		const album: Album = await this.repository.findOne(id);

		if (!album)
			this.exceptionService.throwNotFoundException({
				message: 'Album not found',
			});

		await this.cacheManager.setObjectInCache('album', album);

		return album;
	}
}
