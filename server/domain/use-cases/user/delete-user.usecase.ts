import {IUserRepository} from '../../repositories/user.repository';
import {ILogger} from '../../logger/logger.interface';
import {User} from "../../entities/user.entity";
import {IExceptionService} from "../../interfaces/exceptions.interface";
import {HttpStatus} from "@nestjs/common";

export class DeleteUserUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly exceptionService: IExceptionService,
  ) {}

  public async execute(id: string): Promise<User> {
    const userDeleted = await this.repository.delete(id);

    if (userDeleted) {
        this.logger.log(
            'DeleteUserUseCases execute()',
            `User ${id} have been deleted`,
        );

        return userDeleted
    } else {
       this.exceptionService.throwNotFoundException({
            message: 'User not found!',
            statusCode: HttpStatus.NOT_FOUND
        })
    }
  }
}
