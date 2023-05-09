import { OwnerType } from '../../../main/enums/ownerType.enum';
import { CreateFileDTO } from '../../../presentation/dtos/file.dto';
import { File } from '../../entities/file.entity';

export interface IFileRepository {
	findOne(ownerId: string, ownerType: OwnerType): Promise<File>;
	findByKey(key: string, value: string): Promise<File>;
	create(
		files: CreateFileDTO,
		ownerId: string,
		ownerType: OwnerType,
	): Promise<File>;
	update(
		files: CreateFileDTO,
		ownerId: string,
		ownerType: OwnerType,
	): Promise<File>;
	delete(ownerId: string, ownerType: OwnerType): Promise<File>;
}
