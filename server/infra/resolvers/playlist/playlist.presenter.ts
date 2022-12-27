import { Field, ObjectType } from '@nestjs/graphql';
import { File } from 'server/domain/entities/file.entity';
import { Music } from 'server/domain/entities/music.entity';
import { Playlist } from 'server/domain/entities/playlist.entity';
import { User } from 'server/domain/entities/user.entity';

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

	@Field(() => User, { nullable: true })
	public user: User;

	@Field(() => [Music], { nullable: true })
	public musics?: Music[];

	@Field({ nullable: true })
	public file?: File;

	constructor(props: Playlist) {
		Object.assign(this, props);
	}
}
