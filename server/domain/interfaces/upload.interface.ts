import { CreateFileDTO } from 'server/infra/resolvers/file/file.dto';

export interface IUploadService {
	uploadFile(file: CreateFileDTO): Promise<CreateFileDTO>;
	deleteFile(keys: string[]): Promise<void>;
}
