import { HttpCode, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileUtils } from 'server/infra/commons/utils/file.utils';
import { Music } from '../../../domain/entities/music.entity';
import {
	CreateMusicUseCase,
	DeleteMusicUseCase,
	FindAllMusicUseCase,
	FindOneMusicUseCase,
	UpdateMusicFileUseCase,
	UpdateMusicUseCase,
} from '../../../domain/use-cases/music';
import { MusicUsecasesProxyModule } from '../../usecases-proxy/music/music-usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { CreateFileDTO } from '../file/file.dto';
import { CreateMusicDTO, UpdateMusicDTO } from './music.dto';
import { MusicPresenter } from './music.presenter';

@Resolver((of) => Music)
export class MusicResolver {
	constructor(
		@Inject(MusicUsecasesProxyModule.GET_MUSICS_USECASES_PROXY)
		private readonly findAllMusicUseCase: UseCaseProxy<FindAllMusicUseCase>,
		@Inject(MusicUsecasesProxyModule.GET_MUSIC_USECASES_PROXY)
		private readonly findOneMusicUseCase: UseCaseProxy<FindOneMusicUseCase>,
		@Inject(MusicUsecasesProxyModule.POST_MUSIC_USECASES_PROXY)
		private readonly createMusicUseCase: UseCaseProxy<CreateMusicUseCase>,
		@Inject(MusicUsecasesProxyModule.PUT_MUSIC_USECASES_PROXY)
		private readonly updateMusicUseCase: UseCaseProxy<UpdateMusicUseCase>,
		@Inject(MusicUsecasesProxyModule.PUT_MUSIC_FILE_USECASES_PROXY)
		private readonly updateMusicFileUseCase: UseCaseProxy<UpdateMusicFileUseCase>,
		@Inject(MusicUsecasesProxyModule.DELETE_MUSIC_USECASES_PROXY)
		private readonly deleteMusicUseCase: UseCaseProxy<DeleteMusicUseCase>,
	) {}

	@Query((returns) => [MusicPresenter])
	public async findAllMusic(): Promise<MusicPresenter[]> {
		const musics = await this.findAllMusicUseCase.getInstance().execute();
		return musics.map((music) => new MusicPresenter(music));
	}

	@Query((returns) => MusicPresenter)
	public async findOneMusic(@Args('id') id: string): Promise<MusicPresenter> {
		return await this.findOneMusicUseCase.getInstance().execute(id);
	}

	@Mutation((returns) => MusicPresenter)
	public async createMusic(
		@Args('music') music: CreateMusicDTO,
		@Args('file', { type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
	): Promise<MusicPresenter> {
		const newFile: CreateFileDTO = await FileUtils.createFile(file);
		const newUSer: CreateMusicDTO = new CreateMusicDTO(music);
		return await this.createMusicUseCase
			.getInstance()
			.execute(newUSer, newFile);
	}

	@Mutation((returns) => MusicPresenter)
	public async updateMusic(
		@Args('id') id: string,
		@Args('music', { nullable: true }) music: UpdateMusicDTO,
	): Promise<MusicPresenter> {
		return await this.updateMusicUseCase.getInstance().execute(id, music);
	}

	@Mutation((returns) => MusicPresenter)
	public async updateMusicFile(
		@Args('id') id: string,
		@Args('file', { type: () => GraphQLUpload, nullable: true })
		file: FileUpload,
	): Promise<MusicPresenter> {
		const newFile: CreateFileDTO = await FileUtils.createFile(file);
		return await this.updateMusicFileUseCase.getInstance().execute(id, newFile);
	}

	@HttpCode(204)
	@Mutation((returns) => MusicPresenter)
	public async deleteMusic(@Args('id') id: string): Promise<Music> {
		return await this.deleteMusicUseCase.getInstance().execute(id);
	}
}
