import { ICacheManager } from '../../../main/interfaces/cache.interface';
import { IArtistRepository } from '../../abstracts/repositories/artist.repository';
import { Artist } from '../../entities/artist.entity';

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
