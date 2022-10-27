import { Module } from '@nestjs/common';
import { UserUsecasesProxyModule } from '../usecases-proxy/user/usecases-proxy.module';

import { UserResolver } from './user/user.resolver';

@Module({
  imports: [UserUsecasesProxyModule.register()],
  controllers: [UserResolver],
})
export class ResolversModule {}
