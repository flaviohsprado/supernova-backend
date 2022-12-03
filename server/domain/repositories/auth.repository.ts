import { AuthDTO } from '../../infra/resolvers/auth/auth.dto';
import { AuthPresenter } from '../../infra/resolvers/auth/auth.presenter';
import { User } from '../entities/user.entity';

export interface IAuthRepository {
	login(credentials: AuthDTO): Promise<AuthPresenter>;

	validateUser(
		email: string,
		password: string,
	): Promise<Omit<User, 'password'>>;
}
