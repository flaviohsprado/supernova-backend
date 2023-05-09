import { INestApplication } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';

export class SetupGraphqlFor {
	static for(app: INestApplication) {
		app.use(graphqlUploadExpress());
	}
}
