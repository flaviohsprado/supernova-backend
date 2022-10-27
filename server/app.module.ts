
import { Module } from '@nestjs/common';
import {ResolversModule} from "./infra/resolvers/resolvers.module";
import {TypeOrmConfigModule} from "./infra/config/typeorm/typeorm.module";
import {GraphqlConfigModule} from "./infra/config/graphql/graphql.module";

@Module({
  imports: [
    GraphqlConfigModule,
    TypeOrmConfigModule,
    ResolversModule,
  ],
})
export class AppModule {}
