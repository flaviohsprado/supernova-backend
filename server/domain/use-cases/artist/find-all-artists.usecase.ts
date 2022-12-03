import { Artist } from '../../entities/artist.entity';
import { IArtistRepository } from '../../repositories/artist.repository';
import { ICacheManager } from '../../interfaces/cache.interface';

export class FindAllArtistUseCase {
	constructor(
		private readonly repository: IArtistRepository,
		private readonly cacheManager: ICacheManager,
	) {}

	public async execute(): Promise<Artist[]> {
		const cachedArtists = await this.cacheManager.getCachedObject<Artist[]>(
			'artists',
		);

		if (cachedArtists) return cachedArtists;

		const artists = await this.repository.findAll();

		await this.cacheManager.setObjectInCache('artists', artists);

		return artists;
	}
}
