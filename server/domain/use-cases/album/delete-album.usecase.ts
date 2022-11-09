import { IAlbumRepository } from '../../repositories/album.repository';
import { ILogger } from '../../logger/logger.interface';
import { Album } from "../../entities/album.entity";
import { IExceptionService } from "../../interfaces/exceptions.interface";
import { HttpStatus } from "@nestjs/common";

export class DeleteAlbumUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IAlbumRepository,
    private readonly exceptionService: IExceptionService,
  ) { }

  public async execute(id: string): Promise<Album> {
    const albumDeleted = await this.repository.delete(id);

    if (albumDeleted) {
      this.logger.log(
        'DeleteAlbumUseCases execute()',
        `Album ${id} have been deleted`,
      );

      return albumDeleted
    } else {
      this.exceptionService.throwNotFoundException({
        message: 'Album not found!',
        statusCode: HttpStatus.NOT_FOUND
      })
    }
  }
}
