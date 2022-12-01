import { Module } from '@nestjs/common';
import { AlbumUsecasesProxyModule } from '../usecases-proxy/album/album-usecases-proxy.module';
import { ArtistUsecasesProxyModule } from '../usecases-proxy/artist/artist-usecases-proxy.module';
import { AuthUsecasesProxyModule } from '../usecases-proxy/auth/auth-usecases-proxy.module';
import { MusicUsecasesProxyModule } from '../usecases-proxy/music/music-usecases-proxy.module';
import { UserUsecasesProxyModule } from '../usecases-proxy/user/user-usecases-proxy.module';
import { AlbumResolver } from './album/album.resolver';
import { ArtistResolver } from './artist/artist.resolver';
import { AuthResolver } from './auth/auth.resolver';
import { MusicResolver } from './music/music.resolver';
import { UserResolver } from './user/user.resolver';

@Module({
	imports: [
		UserUsecasesProxyModule.register(),
		AuthUsecasesProxyModule.register(),
		ArtistUsecasesProxyModule.register(),
		AlbumUsecasesProxyModule.register(),
		MusicUsecasesProxyModule.register(),
	],
	providers: [
		UserResolver,
		AuthResolver,
		ArtistResolver,
		AlbumResolver,
		MusicResolver,
	],
	exports: [
		UserUsecasesProxyModule.register(),
		AuthUsecasesProxyModule.register(),
		ArtistUsecasesProxyModule.register(),
		AlbumUsecasesProxyModule.register(),
		MusicUsecasesProxyModule.register(),
	],
})
export class ResolversModule {}
