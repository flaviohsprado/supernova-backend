import { Field, ObjectType } from '@nestjs/graphql';
import { IsRequiredBooleanColumn } from 'server/main/decorators/columns/isRequiredBooleanColumn.decorator';
import { IsRequiredStringColumn } from 'server/main/decorators/columns/isRequiredStringColumn.decorator';
import {
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';
import { Music } from './music.entity';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Playlist {
	@Field()
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@IsRequiredStringColumn()
	public userId?: string;

	@IsRequiredStringColumn()
	public title: string;

	@IsRequiredBooleanColumn()
	public isPublic: boolean;

	@ManyToOne(() => User, (User) => User.id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	public user: User;

	//TODO: Add addedAt column to PlaylistMusic table
	@Field(() => [Music], { nullable: true })
	@ManyToMany(() => Music, { cascade: ['update'], nullable: true })
	@JoinTable()
	public musics?: Music[];

	@Field(() => File, { nullable: true })
	@OneToOne(() => File, (file) => file.ownerId, {
		cascade: true,
		onDelete: 'CASCADE',
		nullable: true,
	})
	@JoinColumn()
	public file?: File;
}
