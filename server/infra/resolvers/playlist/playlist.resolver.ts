import { HttpCode, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IAuth } from 'server/domain/interfaces/auth.interface';
import { GraphqlAuthGuard } from 'server/infra/commons/guards/graphql-jwt-auth.guard';
import { CurrentUser } from 'server/main/decorators/currentUser.decorator';
import { Playlist } from '../../../domain/entities/playlist.entity';
import {
	CreatePlaylistUseCase,
	DeletePlaylistUseCase,
	FindAllPlaylistUseCase,
	FindOnePlaylistUseCase,
	UpdatePlaylistUseCase
} from '../../../domain/use-cases/playlist';
import { PlaylistUsecasesProxyModule } from '../../usecases-proxy/playlist/playlist-usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
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
		@Inject(PlaylistUsecasesProxyModule.PUT_PLAYLIST_USECASES_PROXY)
		private readonly updatePlaylistUseCase: UseCaseProxy<UpdatePlaylistUseCase>,
		@Inject(PlaylistUsecasesProxyModule.DELETE_PLAYLIST_USECASES_PROXY)
		private readonly deletePlaylistUseCase: UseCaseProxy<DeletePlaylistUseCase>,
	) {}

	@Query((returns) => [PlaylistPresenter])
	@UseGuards(GraphqlAuthGuard)
	public async findAllPlaylist(
		@Args('userId', { nullable: true }) userId: string,
		@CurrentUser() user: IAuth,
	): Promise<PlaylistPresenter[]> {
		const playlists = await this.findAllPlaylistUseCase
			.getInstance()
			.execute(userId || user.id);

		return playlists.map((playlist) => new PlaylistPresenter(playlist));
	}

	@Query((returns) => PlaylistPresenter)
	public async findOnePlaylist(
		@Args('id') id: string,
	): Promise<PlaylistPresenter> {
		const playlist = await this.findOnePlaylistUseCase
			.getInstance()
			.execute(id);
		return new PlaylistPresenter(playlist);
	}

	@Mutation((returns) => PlaylistPresenter)
	public async createPlaylist(
		@Args('playlist') playlist: CreatePlaylistDTO,
	): Promise<PlaylistPresenter> {
		const newPlaylist = new CreatePlaylistDTO(playlist);
		const createdPlaylist = await this.createPlaylistUseCase
			.getInstance()
			.execute(newPlaylist);

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

	@HttpCode(204)
	@Mutation((returns) => PlaylistPresenter)
	public async deletePlaylist(@Args('id') id: string): Promise<Playlist> {
		return await this.deletePlaylistUseCase.getInstance().execute(id);
	}
}
