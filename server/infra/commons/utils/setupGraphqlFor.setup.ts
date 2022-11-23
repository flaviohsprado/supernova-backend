import { DynamicModule, INestApplication, Type } from "@nestjs/common";
// @ts-ignore
import { graphqlUploadExpress } from "graphql-upload";

export class SetupGraphqlFor {
    static for(app: INestApplication) {
        app.use(graphqlUploadExpress());
    }
  }
  