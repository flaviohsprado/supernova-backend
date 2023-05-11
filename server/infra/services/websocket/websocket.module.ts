import { Module } from '@nestjs/common';
import { UserGateway } from '../../../presentation/gateways/user.gateway';

@Module({
	providers: [UserGateway],
	exports: [UserGateway],
})
export class WebSocketGatewayModule {}
