import { Field, ObjectType } from '@nestjs/graphql';
import { AlbumPresenter } from '../album/album.presenter';
import { FilePresenter } from '../file/file.presenter';

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

	@Field(() => AlbumPresenter)
	public album: AlbumPresenter;

	@Field({ nullable: true })
	public file?: FilePresenter;

	constructor(props: MusicPresenter) {
		this.id = props.id;
		this.title = props.title;
		this.duration = props.duration;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.album = new AlbumPresenter(props.album);
		this.file = new FilePresenter(props.file);
	}
}
