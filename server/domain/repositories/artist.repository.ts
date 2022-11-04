import { CreateArtistDTO, UpdateArtistDTO } from "server/infra/resolvers/artist/artist.dto";
import { Artist } from "../entities/artist.entity";

export interface IArtistRepository {
    findAll(): Promise<Artist[]>;
    findOne(id: string): Promise<Artist>;
    create(user: CreateArtistDTO): Promise<Artist>;
    update(id: string, user: UpdateArtistDTO): Promise<Artist>;
    delete(id: string): Promise<Artist>;
}