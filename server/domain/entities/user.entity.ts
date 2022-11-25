
import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { IsOptionalStringColumn } from '../../main/decorators/columns/isOptionalStringColumn.decorator';
import { IsRequiredStringColumn } from '../../main/decorators/columns/isRequiredStringColumn.decorator';
import { File } from './file.entity';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field()
  @IsRequiredStringColumn()
  public username: string;

  @Field()
  @IsOptionalStringColumn()
  public email: string;

  @Field()
  @IsRequiredStringColumn()
  public password: string;

  @Field()
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => File, { nullable: true })
  @OneToOne(() => File, (file) => file.ownerId, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  public file?: File;
}
