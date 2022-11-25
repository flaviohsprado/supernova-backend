import { Injectable } from "@nestjs/common";
import { InjectS3, S3 } from 'nestjs-s3';
import { IUploadService } from "server/domain/interfaces/upload.interface";
import { CreateFileDTO } from "server/infra/resolvers/file/file.dto";

@Injectable()
export class S3Service implements IUploadService {
    constructor(
        @InjectS3() 
        private readonly service: S3,
    ) {}

    public uploadFile(file: CreateFileDTO): Promise<CreateFileDTO> {
        const fileUploaded = this.service.upload({
            Bucket: this.service.config.params.Bucket,
            ACL: this.service.config.params.ACL,
            Key: file.key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ServerSideEncryption: 'AES256',
        }).promise();

        return fileUploaded.then((data) => {
            file.url = data.Location;
            file.key = data.Key;

            return file;
        });
    }

    public deleteFile(keys: string[]): Promise<void> {
        return this.service.deleteObjects({
                Bucket: this.service.config.params.Bucket,
                Delete: {
                    Objects: keys.map((key) => ({ Key: key })),
                }})
                .promise()
                .then(() => {});
    }
    
}