import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../domain/entities/user.entity';

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

  @Field()
  public createdAt?: Date;

  @Field()
  public updatedAt?: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
