import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class DatabaseUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) { }

  public async findByKey(key: string, value: string): Promise<User> {
    return await this.userEntityRepository.findOne({
      where: { [key]: value },
      relations: ['file'],
    });
  }

  public async findAll(): Promise<User[]> {
    return this.userEntityRepository.find({
      relations: ['file'],
    });
  }

  public async findOne(id: string): Promise<User> {
    return await this.userEntityRepository.findOne({
      where: { id },
      relations: ['file'],
    });
  }

  public async create(user: User): Promise<User> {
    const newUser = this.userEntityRepository.create(user);
    return this.userEntityRepository.save(newUser);
  }

  public async update(id: string, user: User): Promise<User> {
    return this.userEntityRepository.save({ ...user, id });
  }

  public async delete(id: string): Promise<any> {
    const user = await this.userEntityRepository.findOneById(id);

    if (user) {
      this.userEntityRepository.delete(id);
      return user;
    }
  }

  public async alreadyExists(
    key: string,
    value: string,
    id?: string,
  ): Promise<boolean> {
    const alreadyExists: User = await this.userEntityRepository.findOne({
      where: { [key]: value },
    });

    if (alreadyExists && alreadyExists.id !== id) return true;

    return false;
  }
}
