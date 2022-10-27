import { User } from '../entities/user.entity';
import {
  CreateUserDTO,
  UpdateUserDTO,
} from '../../infra/resolvers/user/user.dto';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findByKey(key: string, value: string): Promise<User>;
  create(user: CreateUserDTO): Promise<User>;
  update(id: string, user: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}
