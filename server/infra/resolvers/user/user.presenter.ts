import { Field, ObjectType } from '@nestjs/graphql';
import { File } from 'server/domain/entities/file.entity';
import { User } from '../../../domain/entities/user.entity';
import { FilePresenter } from '../file/file.presenter';

@ObjectType()
export class UserPresenter {
  @Field()
  public id: string;

  @Field()
  public username: string;

  @Field()
  public email: string;

  @Field()
  public accessToken?: string;

  @Field(() => File)
  public file?: File

  @Field()
  public createdAt?: Date;

  @Field()
  public updatedAt?: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
