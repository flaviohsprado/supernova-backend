import { Module } from '@nestjs/common';
import { AlbumUsecasesProxyModule } from '../../infra/usecases-proxy/album/album-usecases-proxy.module';
import { ArtistUsecasesProxyModule } from '../../infra/usecases-proxy/artist/artist-usecases-proxy.module';
import { AuthUsecasesProxyModule } from '../../infra/usecases-proxy/auth/auth-usecases-proxy.module';
import { MusicUsecasesProxyModule } from '../../infra/usecases-proxy/music/music-usecases-proxy.module';
import { PlaylistUsecasesProxyModule } from '../../infra/usecases-proxy/playlist/playlist-usecases-proxy.module';
import { UserUsecasesProxyModule } from '../../infra/usecases-proxy/user/user-usecases-proxy.module';
import { AlbumResolver } from './album.resolver';
import { ArtistResolver } from './artist.resolver';
import { AuthResolver } from './auth.resolver';
import { MusicResolver } from './music.resolver';
import { PlaylistResolver } from './playlist.resolver';
import { UserResolver } from './user.resolver';

@Module({
	imports: [
		UserUsecasesProxyModule.register(),
		AuthUsecasesProxyModule.register(),
		ArtistUsecasesProxyModule.register(),
		AlbumUsecasesProxyModule.register(),
		MusicUsecasesProxyModule.register(),
		PlaylistUsecasesProxyModule.register(),
	],
	providers: [
		UserResolver,
		AuthResolver,
		ArtistResolver,
		AlbumResolver,
		MusicResolver,
		PlaylistResolver,
	],
	exports: [
		UserUsecasesProxyModule.register(),
		AuthUsecasesProxyModule.register(),
		ArtistUsecasesProxyModule.register(),
		AlbumUsecasesProxyModule.register(),
		MusicUsecasesProxyModule.register(),
		PlaylistUsecasesProxyModule.register(),
	],
})
export class ResolversModule {}
