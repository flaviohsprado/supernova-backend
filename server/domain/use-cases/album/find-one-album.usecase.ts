import { HttpStatus, NotFoundException } from '@nestjs/common';
import { IAlbumRepository } from 'server/domain/abstracts/repositories/album.repository';
import { Album } from 'server/domain/entities/album.entity';
import { ICacheManager } from '../../../main/interfaces/cache.interface';

export class FindOneAlbumUseCase {
	constructor(
		private readonly repository: IAlbumRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<Album> {
		const cachedAlbum = await this.cacheManager.getCachedObject<Album>('album');

		if (cachedAlbum) return cachedAlbum;

		const album: Album = await this.repository.findOne(id);

		if (!album)
			throw new NotFoundException({
				message: 'Album not found',
				status: HttpStatus.NOT_FOUND,
			});

		await this.cacheManager.setObjectInCache('album', album);

		return album;
	}
}
