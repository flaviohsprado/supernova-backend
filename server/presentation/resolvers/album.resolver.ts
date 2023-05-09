import { HttpCode, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Album } from '../../domain/entities/album.entity';
import {
	CreateAlbumUseCase,
	DeleteAlbumUseCase,
	FindAllAlbumUseCase,
	FindOneAlbumUseCase,
	UpdateAlbumFileUseCase,
	UpdateAlbumUseCase,
} from '../../domain/use-cases/album';
import { AlbumUsecasesProxyModule } from '../../infra/usecases-proxy/album/album-usecases-proxy.module';
import { UseCaseProxy } from '../../infra/usecases-proxy/usecase-proxy';
import { FileUtils } from '../../main/utils/file.utils';
import { CreateAlbumDTO, UpdateAlbumDTO } from '../dtos/album.dto';
import { CreateFileDTO } from '../dtos/file.dto';
import { AlbumPresenter } from '../presenters/album.presenter';

@Resolver((of) => Album)
export class AlbumResolver {
	constructor(
		@Inject(AlbumUsecasesProxyModule.GET_ALBUMS_USECASES_PROXY)
		private readonly findAllAlbumUseCase: UseCaseProxy<FindAllAlbumUseCase>,
		@Inject(AlbumUsecasesProxyModule.GET_ALBUM_USECASES_PROXY)
		private readonly findOneAlbumUseCase: UseCaseProxy<FindOneAlbumUseCase>,
		@Inject(AlbumUsecasesProxyModule.POST_ALBUM_USECASES_PROXY)
		private readonly createAlbumUseCase: UseCaseProxy<CreateAlbumUseCase>,
		@Inject(AlbumUsecasesProxyModule.PUT_ALBUM_USECASES_PROXY)
		private readonly updateAlbumUseCase: UseCaseProxy<UpdateAlbumUseCase>,
		@Inject(AlbumUsecasesProxyModule.PUT_ALBUM_FILE_USECASES_PROXY)
		private readonly updateAlbumFileUseCase: UseCaseProxy<UpdateAlbumFileUseCase>,
		@Inject(AlbumUsecasesProxyModule.DELETE_ALBUM_USECASES_PROXY)
		private readonly deleteAlbumUseCase: UseCaseProxy<DeleteAlbumUseCase>,
	) {}

	@Query((returns) => [AlbumPresenter])
	public async findAllAlbum(): Promise<AlbumPresenter[]> {
		const albums = await this.findAllAlbumUseCase.getInstance().execute();
		return albums.map((album) => new AlbumPresenter(album));
	}

	@Query((returns) => AlbumPresenter)
	public async findOneAlbum(@Args('id') id: string): Promise<AlbumPresenter> {
		const album = await this.findOneAlbumUseCase.getInstance().execute(id);
		return new AlbumPresenter(album);
	}

	@Mutation((returns) => AlbumPresenter)
	public async createAlbum(
		@Args('album') album: CreateAlbumDTO,
		@Args('file', { type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
	): Promise<AlbumPresenter> {
		const newAlbum = new CreateAlbumDTO(album);
		const newFile: CreateFileDTO = await FileUtils.createFile(file);
		return await this.createAlbumUseCase
			.getInstance()
			.execute(newAlbum, newFile);
	}

	@Mutation((returns) => AlbumPresenter)
	public async updateAlbum(
		@Args('id') id: string,
		@Args('album') album: UpdateAlbumDTO,
	): Promise<AlbumPresenter> {
		return await this.updateAlbumUseCase.getInstance().execute(id, album);
	}

	@Mutation((returns) => AlbumPresenter)
	public async updateAlbumFile(
		@Args('id') id: string,
		@Args('file', { type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
	): Promise<AlbumPresenter> {
		const newFile: CreateFileDTO = await FileUtils.createFile(file);
		return await this.updateAlbumFileUseCase.getInstance().execute(id, newFile);
	}

	@HttpCode(204)
	@Mutation((returns) => AlbumPresenter)
	public async deleteAlbum(@Args('id') id: string): Promise<Album> {
		return await this.deleteAlbumUseCase.getInstance().execute(id);
	}
}
