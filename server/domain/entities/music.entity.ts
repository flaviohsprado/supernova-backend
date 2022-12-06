import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptionalNumberColumn } from 'server/main/decorators/columns/isOptionalnumberColumn.decorator';
import { IsOptionalStringColumn } from 'server/main/decorators/columns/isOptionalStringColumn.decorator';
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IsRequiredStringColumn } from '../../main/decorators/columns/isRequiredStringColumn.decorator';
import { Album } from './album.entity';
import { File } from './file.entity';
import { Playlist } from './playlist.entity';

@ObjectType()
@Entity()
export class Music {
	@Field()
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@IsRequiredStringColumn()
	public albumId: string;

	@IsOptionalStringColumn()
	public playlistId?: string;

	@IsRequiredStringColumn()
	public title: string;

	@IsOptionalNumberColumn({ default: 0 })
	public duration: number;

	@Field()
	@CreateDateColumn()
	public createdAt: Date;

	@Field()
	@UpdateDateColumn()
	public updatedAt: Date;

	//TODO: dont delete, but set to null
	@ManyToOne(() => Album, (Album) => Album.id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'albumId' })
	public album: Album;

	@ManyToOne(() => Playlist, (Playlist) => Playlist.id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'playlistId' })
	public playlist: Playlist;

	@Field(() => File, { nullable: true })
	@OneToOne(() => File, (file) => file.ownerId, {
		cascade: true,
		onDelete: 'CASCADE',
		nullable: true,
	})
	@JoinColumn()
	public file?: File;
}
