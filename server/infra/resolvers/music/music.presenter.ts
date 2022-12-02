import { Field, ObjectType } from '@nestjs/graphql';
import { Album } from 'server/domain/entities/album.entity';
import { File } from 'server/domain/entities/file.entity';

@ObjectType()
export class MusicPresenter {
	@Field()
	public id: string;

	@Field()
	public title: string;

	@Field()
	public duration: number;

	@Field()
	public createdAt: Date;

	@Field()
	public updatedAt: Date;

	@Field()
	public album: Album;

	@Field()
	public file?: File;

	constructor(props: MusicPresenter) {
		Object.assign(this, props);
	}
}
