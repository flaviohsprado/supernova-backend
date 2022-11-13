import { CreateFileDTO } from "server/infra/resolvers/file/file.dto";
import { OwnerType } from "server/main/enums/ownerType.enum";
import { File } from "../entities/file.entity";

export interface IFileRepository {
    findOne(id: string): Promise<File>;
    findByKey(key: string, value: string): Promise<File>;
    create(files: CreateFileDTO, ownerId: string, ownerType: OwnerType): Promise<File>;
    update(files: CreateFileDTO, ownerId: string, ownerType: OwnerType): Promise<File>;
    delete(ownerId: string): Promise<File>;
}