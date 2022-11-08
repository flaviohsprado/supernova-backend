import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IArtistRepository } from 'server/domain/repositories/artist.repository';
import { Repository } from 'typeorm';
import { Artist } from '../../domain/entities/artist.entity';

@Injectable()
export class DatabaseArtistRepository implements IArtistRepository {
    constructor(
        @InjectRepository(Artist)
        private readonly artistEntityRepository: Repository<Artist>,
    ) { }

    public async findAll(): Promise<Artist[]> {
        return this.artistEntityRepository.find({
            relations: ['albums'],
        });
    }

    public async findOne(id: string): Promise<Artist> {
        return await this.artistEntityRepository.findOne({
            where: { id },
            relations: ['albums'],
        });
    }

    public async create(artist: Artist): Promise<Artist> {
        const newArtist = this.artistEntityRepository.create(artist);
        return this.artistEntityRepository.save(newArtist);
    }

    public async update(id: string, artist: Artist): Promise<Artist> {
        const updateArtist = this.artistEntityRepository.create({ ...artist, id });
        return this.artistEntityRepository.save(updateArtist)
    }

    public async delete(id: string): Promise<any> {
        const artist = await this.artistEntityRepository.find({ where: { id } });

        if (artist) {
            this.artistEntityRepository.delete(id);
            return artist;
        }
    }
}
