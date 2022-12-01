import { AuthPresenter } from '../../infra/resolvers/auth/auth.presenter';
import { AuthDTO } from '../../infra/resolvers/auth/auth.dto';
import { User } from '../entities/user.entity';

export interface IAuthRepository {
	login(credentials: AuthDTO): Promise<AuthPresenter>;

	validateUser(
		username: string,
		password: string,
	): Promise<Omit<User, 'password'>>;
}
