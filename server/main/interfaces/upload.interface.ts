import { CreateFileDTO } from '../../presentation/dtos/file.dto';

export interface IUploadService {
	uploadFile(file: CreateFileDTO): Promise<CreateFileDTO>;
	deleteFile(keys: string[]): Promise<void>;
}
