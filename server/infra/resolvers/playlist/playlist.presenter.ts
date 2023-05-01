import { Field, ObjectType } from '@nestjs/graphql';
import { FilePresenter } from '../file/file.presenter';
import { MusicPresenter } from '../music/music.presenter';
import { UserPresenter } from '../user/user.presenter';

@ObjectType()
export class PlaylistPresenter {
	@Field()
	public id: string;

	@Field()
	public title: string;

	@Field()
	public isPublic: boolean;

	@Field({ nullable: true })
	public numberOfSongs?: number;

	@Field({ nullable: true })
	public duration?: number;

	@Field()
	public createdAt?: Date;

	@Field()
	public updatedAt?: Date;

	@Field(() => UserPresenter, { nullable: true })
	public user: UserPresenter;

	@Field(() => [MusicPresenter], { nullable: true })
	public musics?: MusicPresenter[];

	@Field({ nullable: true })
	public file?: FilePresenter;

	constructor(props: PlaylistPresenter) {
		this.id = props.id;
		this.title = props.title;
		this.isPublic = props.isPublic;
		this.numberOfSongs = props.musics ? props.musics?.length : 0;
		this.duration = props.musics.reduce((acc, curr) => acc + curr.duration, 0);
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.user = new UserPresenter(props.user);
		this.musics = props.musics.map((music) => new MusicPresenter(music));
		this.file = props.file ? new FilePresenter(props.file) : undefined;
	}
}
