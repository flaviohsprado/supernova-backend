import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			cors: {
				origin: '*',
				methods: 'GET,PUT,POST,DELETE',
				optionsSuccessStatus: 200,
			},
			driver: ApolloDriver,
			autoSchemaFile: true,
			context: ({ req }) => ({ req }),
		}),
	],
})
export class GraphqlConfigModule {}
