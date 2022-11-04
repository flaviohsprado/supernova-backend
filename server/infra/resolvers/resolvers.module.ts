import { Module } from '@nestjs/common';
import { UserUsecasesProxyModule } from '../usecases-proxy/user/user-usecases-proxy.module';
import { UserResolver } from './user/user.resolver';
import { AuthUsecasesProxyModule } from "../usecases-proxy/auth/auth-usecases-proxy.module";
import { AuthResolver } from "./auth/auth.resolver";
import { ArtistUsecasesProxyModule } from '../usecases-proxy/artist/artist-usecases-proxy.module';
import { ArtistResolver } from './artist/artist.resolver';

@Module({
  imports: [
    UserUsecasesProxyModule.register(),
    AuthUsecasesProxyModule.register(),
    ArtistUsecasesProxyModule.register()
  ],
  providers: [UserResolver, AuthResolver, ArtistResolver]
})
export class ResolversModule { }
