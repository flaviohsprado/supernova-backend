import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAlbumRepository } from 'server/domain/repositories/album.repository';
import { Repository } from 'typeorm';
import { Album } from '../../domain/entities/album.entity';

@Injectable()
export class DatabaseAlbumRepository implements IAlbumRepository {
    constructor(
        @InjectRepository(Album)
        private readonly albumEntityRepository: Repository<Album>,
    ) { }

    public async findAll(): Promise<Album[]> {
        return this.albumEntityRepository.find();
    }

    public async findOne(id: string): Promise<Album> {
        return await this.albumEntityRepository.findOne({
            where: { id },
        });
    }

    public async create(album: Album): Promise<Album> {
        const newAlbum = this.albumEntityRepository.create(album);
        return this.albumEntityRepository.save(newAlbum);
    }

    public async update(id: string, album: Album): Promise<Album> {
        const updateAlbum = this.albumEntityRepository.create({ ...album, id });
        return this.albumEntityRepository.save(updateAlbum)
    }

    public async delete(id: string): Promise<any> {
        const user = await this.albumEntityRepository.findOne({ where: { id } });

        if (user) {
            this.albumEntityRepository.delete(id);
            return user;
        }
    }
}
