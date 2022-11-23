import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { GraphqlAuthGuard } from './infra/commons/guards/graphql-jwt-auth.guard';
import { TransformResponseInterceptor } from "./infra/commons/interceptors/transformResponse.interceptor";
import { LoggerMiddleware } from "./infra/commons/middlewares/checkGraphQLPlayground.middleware";
import { JwtStrategy } from "./infra/commons/strategies/jwt.strategy";
import { LocalStrategy } from "./infra/commons/strategies/local.strategy";
import { EnvironmentConfigModule } from "./infra/config/environment-config/environment-config.module";
import { GraphqlConfigModule } from "./infra/config/graphql/graphql.module";
import { ExceptionsModule } from "./infra/exceptions/exceptions.module";
import { LoggerModule } from "./infra/logger/logger.module";
import { ResolversModule } from "./infra/resolvers/resolvers.module";
import { BcryptModule } from "./infra/services/bcrypt/bcrypt.module";
import { JwtModule } from "./infra/services/jwt/jwt.module";
import { S3ConfigModule } from './infra/services/s3/s3.module';

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
        S3ConfigModule
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
        {
            provide: APP_GUARD,
            useClass: GraphqlAuthGuard,
        },
        LocalStrategy,
        JwtStrategy
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
    }
}
