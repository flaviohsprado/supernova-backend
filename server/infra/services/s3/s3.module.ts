import { Module } from '@nestjs/common';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import { EnvironmentConfigModule } from 'server/infra/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'server/infra/config/environment-config/environment-config.service';
import { S3Service } from './s3.service';

export const getS3ModuleOptions = async (
	config: EnvironmentConfigService,
): Promise<S3ModuleOptions> => ({
	config: {
		accessKeyId: config.getBucketAccessKeyId(),
		secretAccessKey: config.getBucketSecretAccessKey(),
		region: config.getBucketRegion(),
		s3ForcePathStyle: true,
		signatureVersion: 'v4',
		params: {
			Bucket: config.getBucketName(),
			ACL: config.getBucketDefaultACL(),
		},
	},
});

@Module({
	imports: [
		S3Module.forRootAsync({
			imports: [EnvironmentConfigModule],
			inject: [EnvironmentConfigService],
			useFactory: getS3ModuleOptions,
		}),
	],
	providers: [S3Service, EnvironmentConfigService],
	exports: [S3Service],
})
export class S3ConfigModule {}
