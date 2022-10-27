import {IUserRepository} from "../../repositories/user.repository";
import {User} from "../../entities/user.entity";

export class FindAllUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  public async execute(): Promise<User[]> {
    return this.repository.findAll();
  }
}
