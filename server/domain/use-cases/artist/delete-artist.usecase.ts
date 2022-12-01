import { IArtistRepository } from '../../repositories/artist.repository';
import { ILogger } from '../../logger/logger.interface';
import { Artist } from '../../entities/artist.entity';
import { IExceptionService } from '../../interfaces/exceptions.interface';
import { HttpStatus } from '@nestjs/common';

export class DeleteArtistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IArtistRepository,
		private readonly exceptionService: IExceptionService,
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
			this.exceptionService.throwNotFoundException({
				message: 'Artist not found!',
				statusCode: HttpStatus.NOT_FOUND,
			});
		}
	}
}
