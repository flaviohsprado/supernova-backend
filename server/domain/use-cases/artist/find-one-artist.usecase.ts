import { Artist } from 'server/domain/entities/artist.entity';
import { IArtistRepository } from 'server/domain/repositories/artist.repository';
import { ICacheManager } from '../../interfaces/cache.interface';
import { IExceptionService } from '../../interfaces/exceptions.interface';

export class FindOneArtistUseCase {
	constructor(
		private readonly repository: IArtistRepository,
		private readonly exceptionService: IExceptionService,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(id: string): Promise<Artist> {
		const cachedArtist = await this.cacheManager.getCachedObject<Artist>(
			'artist',
		);

		if (cachedArtist) return cachedArtist;

		const artist: Artist = await this.repository.findOne(id);

		if (!artist)
			this.exceptionService.throwNotFoundException({
				message: 'Artist not found',
			});

		await this.cacheManager.setObjectInCache('artist', artist);

		return artist;
	}
}
