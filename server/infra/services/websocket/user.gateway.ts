import { Injectable } from '@nestjs/common';
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IUserGateway } from '../../domain/abstracts/gateways/user.gateway';
import { UserPresenter } from '../presenters/user.presenter';

@Injectable()
@WebSocketGateway(1721, { namespace: 'user', cors: '*' })
export class UserGateway implements IUserGateway {
	@WebSocketServer() private server: Server;

	@SubscribeMessage('user-online')
	public emitUserOnlineEvent(user: UserPresenter): void {
		this.server.emit('user-online', user);
	}
}
