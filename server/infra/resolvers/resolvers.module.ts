import { Module } from '@nestjs/common';
import { UserUsecasesProxyModule } from '../usecases-proxy/user/user-usecases-proxy.module';
import { UserResolver } from './user/user.resolver';
import {AuthUsecasesProxyModule} from "../usecases-proxy/auth/auth-usecases-proxy.module";
import {AuthResolver} from "./auth/auth.resolver";

@Module({
  imports: [
      UserUsecasesProxyModule.register(),
      AuthUsecasesProxyModule.register(),    
  ],
  providers: [UserResolver, AuthResolver]
})
export class ResolversModule {}
