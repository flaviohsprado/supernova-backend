import { HttpCode, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Artist } from '../../../domain/entities/artist.entity';
import {
	CreateArtistUseCase,
	DeleteArtistUseCase,
	FindAllArtistUseCase,
	FindOneArtistUseCase,
	UpdateArtistUseCase,
} from '../../../domain/use-cases/artist';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { ArtistUsecasesProxyModule } from '../../usecases-proxy/artist/artist-usecases-proxy.module';
import { CreateArtistDTO, UpdateArtistDTO } from './artist.dto';
import { ArtistPresenter } from './artist.presenter';

@Resolver((of) => Artist)
export class ArtistResolver {
	constructor(
		@Inject(ArtistUsecasesProxyModule.GET_ARTISTS_USECASES_PROXY)
		private readonly findAllArtistUseCase: UseCaseProxy<FindAllArtistUseCase>,
		@Inject(ArtistUsecasesProxyModule.GET_ARTIST_USECASES_PROXY)
		private readonly findOneArtistUseCase: UseCaseProxy<FindOneArtistUseCase>,
		@Inject(ArtistUsecasesProxyModule.POST_ARTIST_USECASES_PROXY)
		private readonly createArtistUseCase: UseCaseProxy<CreateArtistUseCase>,
		@Inject(ArtistUsecasesProxyModule.PUT_ARTIST_USECASES_PROXY)
		private readonly updateArtistUseCase: UseCaseProxy<UpdateArtistUseCase>,
		@Inject(ArtistUsecasesProxyModule.DELETE_ARTIST_USECASES_PROXY)
		private readonly deleteArtistUseCase: UseCaseProxy<DeleteArtistUseCase>,
	) {}

	@Query((returns) => [Artist])
	public async findAllArtist(): Promise<ArtistPresenter[]> {
		const artists = await this.findAllArtistUseCase.getInstance().execute();
		return artists.map((artist) => new ArtistPresenter(artist));
	}

	@Query((returns) => Artist)
	public async findOneArtist(@Args('id') id: string): Promise<ArtistPresenter> {
		return await this.findOneArtistUseCase.getInstance().execute(id);
	}

	@Mutation((returns) => ArtistPresenter)
	public async createArtist(
		@Args('artist') artist: CreateArtistDTO,
	): Promise<ArtistPresenter> {
		return await this.createArtistUseCase.getInstance().execute(artist);
	}

	@Mutation((returns) => Artist)
	public async updateArtist(
		@Args('id') id: string,
		@Args('artist') artist: UpdateArtistDTO,
	): Promise<ArtistPresenter> {
		return await this.updateArtistUseCase.getInstance().execute(id, artist);
	}

	@HttpCode(204)
	@Mutation((returns) => Artist)
	public async deleteArtist(@Args('id') id: string): Promise<Artist> {
		return await this.deleteArtistUseCase.getInstance().execute(id);
	}
}
