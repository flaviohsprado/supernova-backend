import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { IFileRepository } from '../../../domain/abstracts/repositories/file.repository';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';
import { OwnerType } from '../../../main/enums/ownerType.enum';
import { IBcryptService } from '../../../main/interfaces/bcrypt.interface';
import { IJwtService } from '../../../main/interfaces/jwt.interface';
import { IUploadService } from '../../../main/interfaces/upload.interface';
import { CreateFileDTO } from '../../../presentation/dtos/file.dto';
import { CreateUserDTO } from '../../../presentation/dtos/user.dto';
import { UserPresenter } from '../../../presentation/presenters/user.presenter';
import { ILogger } from '../../abstracts/logger.interface';
import { IUserRepository } from '../../abstracts/repositories/user.repository';

export class CreateUserUseCase {
	constructor(
		private readonly logger: ILogger,
		private readonly repository: IUserRepository,
		private readonly fileRepository: IFileRepository,
		private readonly bcryptService: IBcryptService,
		private readonly jwtService: IJwtService,
		private readonly uploadService: IUploadService,
		private readonly environmentConfig: EnvironmentConfigService,
	) {}

	public async execute(
		user: CreateUserDTO,
		file?: CreateFileDTO,
	): Promise<UserPresenter> {
		if (await this.repository.alreadyExists('email', user.email)) {
			throw new ForbiddenException({
				message: 'Email already exists in app!',
				statusCode: HttpStatus.FORBIDDEN,
			});
		}

		if (file) user.file = await this.createFile(user.id, file);

		user.password = await this.bcryptService.createHash(user.password);

		const createdUser: UserPresenter = new UserPresenter(
			await this.repository.create(user),
		);

		createdUser.accessToken = this.jwtService.createToken({
			id: createdUser.id,
			username: createdUser.username,
			avatar: file ? createdUser.file.url : null,
		});

		this.logger.log(
			'CreateUserUseCases execute()',
			'New user have been inserted',
		);

		return createdUser;
	}

	private async createFile(
		id: string,
		file: CreateFileDTO,
	): Promise<CreateFileDTO> {
		let fileUploaded: CreateFileDTO = file;

		if (this.environmentConfig.getCloudUpload()) {
			fileUploaded = await this.uploadService.uploadFile(file);
		}

		return await this.fileRepository.create(fileUploaded, id, OwnerType.USER);
	}
}
