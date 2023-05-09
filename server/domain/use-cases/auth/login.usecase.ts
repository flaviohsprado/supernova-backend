import { HttpStatus, NotFoundException } from '@nestjs/common';
import { IBcryptService } from '../../../main/interfaces/bcrypt.interface';
import { IJwtService } from '../../../main/interfaces/jwt.interface';
import { AuthDTO } from '../../../presentation/dtos/auth.dto';
import { AuthPresenter } from '../../../presentation/presenters/auth.presenter';
import { ILogger } from '../../abstracts/logger.interface';
import { IUserRepository } from '../../abstracts/repositories/user.repository';
import { User } from '../../entities/user.entity';

export class LoginUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly jwtService: IJwtService,
		private readonly bcryptService: IBcryptService,
		private readonly userRepository: IUserRepository,
	) {}

	public async execute(credentials: AuthDTO): Promise<AuthPresenter> {
		const userValidated: Omit<User, 'password'> = await this.validateUser(
			credentials.email,
			credentials.password,
		);
		const accessToken = this.jwtService.createToken({
			id: userValidated.id,
			username: userValidated.username,
			avatar: userValidated.file ? userValidated.file.url : null,
		});

		this.logger.log(`LoginUseCases execute()`, `User have been logged in!`);

		return new AuthPresenter({ accessToken });
	}

	private async validateUser(email: string, password: string) {
		const user = await this.userRepository.findByKey('email', email);

		if (!user)
			throw new NotFoundException({
				message: 'User not found!',
				status: HttpStatus.NOT_FOUND,
			});

		if (await this.bcryptService.checkHash(password, user.password)) {
			delete user.password;

			return user;
		}
	}
}
