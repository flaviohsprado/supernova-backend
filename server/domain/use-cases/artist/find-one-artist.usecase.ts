import { HttpStatus, NotFoundException } from '@nestjs/common';
import { IArtistRepository } from 'server/domain/abstracts/repositories/artist.repository';
import { Artist } from 'server/domain/entities/artist.entity';
import { ICacheManager } from '../../../main/interfaces/cache.interface';

export class FindOneArtistUseCase {
	constructor(
		private readonly repository: IArtistRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<Artist> {
		const cachedArtist = await this.cacheManager.getCachedObject<Artist>(
			'artist',
		);

		if (cachedArtist) return cachedArtist;

		const artist: Artist = await this.repository.findOne(id);

		if (!artist)
			throw new NotFoundException({
				message: 'Artist not found',
				status: HttpStatus.NOT_FOUND,
			});

		await this.cacheManager.setObjectInCache('artist', artist);

		return artist;
	}
}
