import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "server/domain/entities/file.entity";
import { IFileRepository } from "server/domain/repositories/file.repository";
import { OwnerType } from "server/main/enums/ownerType.enum";
import { Repository } from "typeorm";
import { CreateFileDTO } from "../resolvers/file/file.dto";

@Injectable()
export class DatabaseFileRepository implements IFileRepository {
    constructor(
        @InjectRepository(File)
        private repository: Repository<File>,
    ) { }

    public async findOne(id: string): Promise<File> {
        return await this.repository.findOne({ where: { id } });
    }

    public async findByKey(key: string, value: string): Promise<File> {
        return await this.repository.findOne({ where: { [key]: value } });
    }

    public async create(files: CreateFileDTO, ownerId: string, ownerType: OwnerType): Promise<File> {
        files.ownerId = ownerId;
        files.ownerType = ownerType;
        return await this.repository.save(files);
    }

    public async update(files: CreateFileDTO, ownerId: string, ownerType: OwnerType): Promise<File> {
        const file: File = await this.findByKey('ownerId', ownerId);

        if (file) await this.delete(ownerId);

        return await this.create(files, ownerId, ownerType);
    }

    public async delete(ownerId: string): Promise<File> {
        const file = await this.findOne(ownerId);

        this.repository.delete({ ownerId });

        return file;
    }
}