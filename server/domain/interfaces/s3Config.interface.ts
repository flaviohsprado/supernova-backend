import { IClientUploadConfig } from './clientUploadConfig.interface';

export interface IS3Config extends IClientUploadConfig {
	region: string;
}
