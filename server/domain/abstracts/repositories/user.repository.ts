import {
	CreateUserDTO,
	UpdateUserDTO,
} from '../../../presentation/dtos/user.dto';
import { User } from '../../entities/user.entity';

export interface IUserRepository {
	findAll(): Promise<User[]>;
	findOne(id: string): Promise<User>;
	findByKey(key: string, value: string): Promise<User>;
	create(user: CreateUserDTO): Promise<User>;
	update(id: string, user: UpdateUserDTO): Promise<User>;
	delete(id: string): Promise<User>;
	alreadyExists(key: string, value: string, id?: string): Promise<boolean>;
}
