import { AuthDTO } from '../../../presentation/dtos/auth.dto';
import { AuthPresenter } from '../../../presentation/presenters/auth.presenter';
import { User } from '../../entities/user.entity';

export interface IAuthRepository {
	login(credentials: AuthDTO): Promise<AuthPresenter>;

	validateUser(
		email: string,
		password: string,
	): Promise<Omit<User, 'password'>>;
}
