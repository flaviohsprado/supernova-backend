import {ILogger} from "../../logger/logger.interface";
import {IUserRepository} from "../../repositories/user.repository";
import {User} from "../../entities/user.entity";
import {CreateUserDTO} from "../../../infra/resolvers/user/user.dto";

export class CreateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
  ) {}

  public async execute(user: CreateUserDTO): Promise<User> {
    const createdUser = await this.repository.create(user);

    this.logger.log(
      'CreateUserUseCases execute()',
      'New user have been inserted',
    );

    return createdUser;
  }
}
