import {IUserRepository} from "../../repositories/user.repository";
import {ILogger} from "../../logger/logger.interface";
import {User} from "../../entities/user.entity";
import {UpdateUserDTO} from "../../../infra/resolvers/user/user.dto";

export class UpdateUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
  ) {}

  public async execute(id: string, user: UpdateUserDTO): Promise<User> {
    const updatedUser = await this.repository.update(id, user);

    this.logger.log(
      'UpdateUserUseCases execute()',
      `User ${id} have been updated`,
    );

    return updatedUser;
  }
}
