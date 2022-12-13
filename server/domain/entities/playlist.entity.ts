import { Field, ObjectType } from '@nestjs/graphql';
import { IsRequiredBooleanColumn } from 'server/main/decorators/columns/isRequiredBooleanColumn.decorator';
import { IsRequiredStringColumn } from 'server/main/decorators/columns/isRequiredStringColumn.decorator';
import {
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
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

	@Field(() => [Music], { nullable: true })
	@ManyToMany(() => Music, { cascade: ['update'], nullable: true })
	@JoinTable()
	public musics?: Music[];

	@ManyToOne(() => User, (User) => User.id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	public user: User;
}
