import { UserPresenter } from '../../../presentation/presenters/user.presenter';

export interface IUserGateway {
	emitUserOnlineEvent(user: UserPresenter): void;
}
