import { User } from '../../../domain/entities/user.entity';

export class UserPresenter {
  public id: string;
  public username: string;
  public email: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
