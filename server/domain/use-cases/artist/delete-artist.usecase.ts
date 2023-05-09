import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ILogger } from '../../abstracts/logger.interface';
import { IArtistRepository } from '../../abstracts/repositories/artist.repository';
import { Artist } from '../../entities/artist.entity';

export class DeleteArtistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IArtistRepository,
	) {}

	public async execute(id: string): Promise<Artist> {
		const artistDeleted = await this.repository.delete(id);

		if (artistDeleted) {
			this.logger.log(
				'DeleteArtistUseCases execute()',
				`Artist ${id} have been deleted`,
			);

			return artistDeleted;
		} else {
			throw new NotFoundException({
				message: 'Artist not found!',
				statusCode: HttpStatus.NOT_FOUND,
			});
		}
	}
}
