import {ClassSerializerInterceptor, Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {ResolversModule} from "./infra/resolvers/resolvers.module";
import {AuthUsecasesProxyModule} from "./infra/usecases-proxy/auth/auth-usecases-proxy.module";
import {BcryptModule} from "./infra/services/bcrypt/bcrypt.module";
import {JwtModule} from "./infra/services/jwt/jwt.module";
import {ExceptionsModule} from "./infra/exceptions/exceptions.module";
import {LoggerModule} from "./infra/logger/logger.module";
import {EnvironmentConfigModule} from "./infra/config/environment-config/environment-config.module";
import {UserUsecasesProxyModule} from "./infra/usecases-proxy/user/user-usecases-proxy.module";
import {CustomHttpException} from "./infra/commons/filters/httpException.filter";
import {TransformResponseInterceptor} from "./infra/commons/interceptors/transformResponse.interceptor";
import {LocalStrategy} from "./infra/commons/strategies/local.strategy";
import {JwtStrategy} from "./infra/commons/strategies/jwt.strategy";
import {LoggerMiddleware} from "./infra/commons/middlewares/checkGraphQLPlayground.middleware";
import {GraphqlConfigModule} from "./infra/config/graphql/graphql.module";

@Module({
  imports: [
    PassportModule,
    LoggerModule,
    ExceptionsModule,
    JwtModule,
    BcryptModule,
    GraphqlConfigModule,
    EnvironmentConfigModule,
    ResolversModule,
    UserUsecasesProxyModule.register(),
    AuthUsecasesProxyModule.register(),
  ],
  providers: [
      {
          provide: 'APP_INTERCEPTOR',
          useClass: ClassSerializerInterceptor,
      },
      {
          provide: 'APP_INTERCEPTOR',
          useClass: TransformResponseInterceptor,
      },
      LocalStrategy,
      JwtStrategy,
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(LoggerMiddleware)
    }
}
