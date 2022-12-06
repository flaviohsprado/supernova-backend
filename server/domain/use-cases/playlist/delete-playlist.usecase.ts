import { HttpStatus } from '@nestjs/common';
import { Playlist } from '../../entities/playlist.entity';
import { IExceptionService } from '../../interfaces/exceptions.interface';
import { ILogger } from '../../logger/logger.interface';
import { IPlaylistRepository } from '../../repositories/playlist.repository';

export class DeletePlaylistUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IPlaylistRepository,
		private readonly exceptionService: IExceptionService,
	) {}

	public async execute(id: string): Promise<Playlist> {
		const playlistDeleted = await this.repository.delete(id);

		if (playlistDeleted) {
			this.logger.log(
				'DeletePlaylistUseCases execute()',
				`Playlist ${id} have been deleted`,
			);

			return playlistDeleted;
		} else {
			this.exceptionService.throwNotFoundException({
				message: 'Playlist not found!',
				statusCode: HttpStatus.NOT_FOUND,
			});
		}
	}
}
