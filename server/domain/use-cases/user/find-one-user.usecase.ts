import {IUserRepository} from "../../repositories/user.repository";
import {User} from "../../entities/user.entity";

export class FindOneUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  public async execute(id: string): Promise<User> {
    return this.repository.findOne(id);
  }
}
