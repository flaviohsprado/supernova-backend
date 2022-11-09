import { HttpCode, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Album } from '../../../domain/entities/album.entity';
import {
    CreateAlbumUseCase,
    DeleteAlbumUseCase,
    FindAllAlbumUseCase,
    FindOneAlbumUseCase,
    UpdateAlbumUseCase
} from '../../../domain/use-cases/album';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { AlbumUsecasesProxyModule } from '../../usecases-proxy/album/album-usecases-proxy.module';
import { CreateAlbumDTO, UpdateAlbumDTO } from './album.dto';
import { AlbumPresenter } from './album.presenter';

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
        @Inject(AlbumUsecasesProxyModule.DELETE_ALBUM_USECASES_PROXY)
        private readonly deleteAlbumUseCase: UseCaseProxy<DeleteAlbumUseCase>,
    ) { }

    @Query((returns) => [Album])
    public async findAllAlbum(): Promise<AlbumPresenter[]> {
        const albums = await this.findAllAlbumUseCase.getInstance().execute();
        return albums.map((album) => new AlbumPresenter(album));
    }

    @Query((returns) => Album)
    public async findOneAlbum(@Args('id') id: string): Promise<AlbumPresenter> {
        const album = await this.findOneAlbumUseCase.getInstance().execute(id);
        const converted = new AlbumPresenter(album);
        console.log(converted);
        return converted;
    }

    @Mutation((returns) => AlbumPresenter)
    public async createAlbum(
        @Args('album') album: CreateAlbumDTO,
    ): Promise<AlbumPresenter> {
        return await this.createAlbumUseCase.getInstance().execute(album);
    }

    @Mutation((returns) => Album)
    public async updateAlbum(
        @Args('id') id: string,
        @Args('album') album: UpdateAlbumDTO,
    ): Promise<AlbumPresenter> {
        return await this.updateAlbumUseCase.getInstance().execute(id, album);
    }

    @HttpCode(204)
    @Mutation((returns) => Album)
    public async deleteAlbum(@Args('id') id: string): Promise<Album> {
        return await this.deleteAlbumUseCase.getInstance().execute(id);
    }
}
