import { Module } from '@nestjs/common';
import { UserUsecasesProxyModule } from '../usecases-proxy/user/user-usecases-proxy.module';
import { UserResolver } from './user/user.resolver';
import {AuthUsecasesProxyModule} from "../usecases-proxy/auth/auth-usecases-proxy.module";

@Module({
  imports: [
      UserUsecasesProxyModule.register(),
      AuthUsecasesProxyModule.register(),    
  ],
  providers: [UserResolver]
})
export class ResolversModule {}
