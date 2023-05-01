import { HttpCode, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { IAuth } from 'server/domain/interfaces/auth.interface';
import { GraphqlAuthGuard } from 'server/infra/commons/guards/graphql-jwt-auth.guard';
import { FileUtils } from 'server/infra/commons/utils/file.utils';
import { CurrentUser } from 'server/main/decorators/currentUser.decorator';
import { Playlist } from '../../../domain/entities/playlist.entity';
import {
	CreatePlaylistUseCase,
	DeleteMusicPlaylistUseCase,
	DeletePlaylistUseCase,
	FindAllPlaylistUseCase,
	FindOnePlaylistUseCase,
	InsertMusicPlaylistUseCase,
	UpdatePlaylistFileUseCase,
	UpdatePlaylistUseCase,
} from '../../../domain/use-cases/playlist';
import { PlaylistUsecasesProxyModule } from '../../usecases-proxy/playlist/playlist-usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { CreateFileDTO } from '../file/file.dto';
import { CreatePlaylistDTO, UpdatePlaylistDTO } from './playlist.dto';
import { PlaylistPresenter } from './playlist.presenter';

@Resolver((of) => Playlist)
export class PlaylistResolver {
	constructor(
		@Inject(PlaylistUsecasesProxyModule.GET_PLAYLISTS_USECASES_PROXY)
		private readonly findAllPlaylistUseCase: UseCaseProxy<FindAllPlaylistUseCase>,
		@Inject(PlaylistUsecasesProxyModule.GET_PLAYLIST_USECASES_PROXY)
		private readonly findOnePlaylistUseCase: UseCaseProxy<FindOnePlaylistUseCase>,
		@Inject(PlaylistUsecasesProxyModule.POST_PLAYLIST_USECASES_PROXY)
		private readonly createPlaylistUseCase: UseCaseProxy<CreatePlaylistUseCase>,
		@Inject(PlaylistUsecasesProxyModule.INSERT_MUSIC_PLAYLIST_USECASES_PROXY)
		private readonly insertMusicPlaylistUseCase: UseCaseProxy<InsertMusicPlaylistUseCase>,
		@Inject(PlaylistUsecasesProxyModule.DELETE_MUSIC_PLAYLIST_USECASES_PROXY)
		private readonly deleteMusicPlaylistUseCase: UseCaseProxy<DeleteMusicPlaylistUseCase>,
		@Inject(PlaylistUsecasesProxyModule.PUT_PLAYLIST_USECASES_PROXY)
		private readonly updatePlaylistUseCase: UseCaseProxy<UpdatePlaylistUseCase>,
		@Inject(PlaylistUsecasesProxyModule.DELETE_PLAYLIST_USECASES_PROXY)
		private readonly deletePlaylistUseCase: UseCaseProxy<DeletePlaylistUseCase>,
		@Inject(PlaylistUsecasesProxyModule.PUT_PLAYLIST_FILE_USECASES_PROXY)
		private readonly updatePlaylistFileUseCase: UseCaseProxy<UpdatePlaylistFileUseCase>,
	) {}

	@Query((returns) => [PlaylistPresenter])
	@UseGuards(GraphqlAuthGuard)
	public async findAllPlaylist(
		@Args('userId', { nullable: true }) userId: string,
		@CurrentUser() user: IAuth,
	): Promise<PlaylistPresenter[]> {
		return await this.findAllPlaylistUseCase
			.getInstance()
			.execute(userId || user.id);
	}

	@Query((returns) => PlaylistPresenter)
	public async findOnePlaylist(
		@Args('id') id: string,
	): Promise<PlaylistPresenter> {
		return await this.findOnePlaylistUseCase.getInstance().execute(id);
	}

	@Mutation((returns) => PlaylistPresenter)
	public async createPlaylist(
		@Args('playlist') playlist: CreatePlaylistDTO,
	): Promise<PlaylistPresenter> {
		const newPlaylist = new CreatePlaylistDTO(playlist);
		return await this.createPlaylistUseCase.getInstance().execute(newPlaylist);
	}

	@Mutation((returns) => PlaylistPresenter)
	public async InsertMusicIntoPlaylist(
		@Args('playlistId') playlistId: string,
		@Args('musicId') musicId: string,
	): Promise<PlaylistPresenter> {
		const createdPlaylist = await this.insertMusicPlaylistUseCase
			.getInstance()
			.execute(playlistId, musicId);

		return new PlaylistPresenter(createdPlaylist);
	}

	@Mutation((returns) => PlaylistPresenter)
	public async DeleteMusicFromPlaylist(
		@Args('playlistId') playlistId: string,
		@Args('musicId') musicId: string,
	): Promise<PlaylistPresenter> {
		const createdPlaylist = await this.deleteMusicPlaylistUseCase
			.getInstance()
			.execute(playlistId, musicId);

		return new PlaylistPresenter(createdPlaylist);
	}

	@Mutation((returns) => PlaylistPresenter)
	public async updatePlaylist(
		@Args('id') id: string,
		@Args('playlist') playlist: UpdatePlaylistDTO,
	): Promise<PlaylistPresenter> {
		const newPlaylist = await this.updatePlaylistUseCase
			.getInstance()
			.execute(id, playlist);

		return new PlaylistPresenter(newPlaylist);
	}

	@Mutation((returns) => PlaylistPresenter)
	public async updatePlaylistFile(
		@Args('id') id: string,
		@Args('file', { type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
	): Promise<PlaylistPresenter> {
		const newFile: CreateFileDTO = await FileUtils.createFile(file);
		return await this.updatePlaylistFileUseCase
			.getInstance()
			.execute(id, newFile);
	}

	@HttpCode(204)
	@Mutation((returns) => PlaylistPresenter)
	public async deletePlaylist(@Args('id') id: string): Promise<Playlist> {
		return await this.deletePlaylistUseCase.getInstance().execute(id);
	}
}
