import { IUserRepository } from '../../repositories/user.repository';
import { ILogger } from './../../logger/logger.interface';

export class DeleteUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    this.logger.log(
      'DeleteUserUseCases execute()',
      `User ${id} have been deleted`,
    );

    return this.repository.delete(id);
  }
}
