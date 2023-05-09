import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFileRepository } from '../../domain/abstracts/repositories/file.repository';
import { File } from '../../domain/entities/file.entity';
import { OwnerType } from '../../main/enums/ownerType.enum';
import { CreateFileDTO } from '../../presentation/dtos/file.dto';

@Injectable()
export class DatabaseFileRepository implements IFileRepository {
	constructor(
		@InjectRepository(File)
		private repository: Repository<File>,
	) {}

	public async findOne(ownerId: string, ownerType): Promise<File> {
		return await this.repository.findOne({ where: { ownerId, ownerType } });
	}

	public async findByKey(key: string, value: string): Promise<File> {
		return await this.repository.findOne({ where: { [key]: value } });
	}

	public async create(
		files: CreateFileDTO,
		ownerId: string,
		ownerType: OwnerType,
	): Promise<File> {
		files.ownerId = ownerId;
		files.ownerType = ownerType;
		return await this.repository.save(files);
	}

	public async update(
		files: CreateFileDTO,
		ownerId: string,
		ownerType: OwnerType,
	): Promise<File> {
		const file: File = await this.findByKey('ownerId', ownerId);

		if (file) await this.delete(ownerId, ownerType);

		return await this.create(files, ownerId, ownerType);
	}

	public async delete(ownerId: string, ownerType: OwnerType): Promise<File> {
		const file = await this.findOne(ownerId, ownerType);

		this.repository.delete({ ownerId });

		return file;
	}
}
