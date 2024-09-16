/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';


@Injectable()
export class SocioClubService {
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>,

        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ) { }

    async addClubSocio(socioId: string, clubId: string): Promise<SocioEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId } });
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);

        const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socioId }, relations: ["clubs"] })
        if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);

        socio.clubs = [...socio.clubs, club];
        return await this.socioRepository.save(socio);
    }

    async findClubBySocioIdClubId(socioId: string, clubId: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId } });
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socioId }, relations: ["clubs"] });
        if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        const socioClub: ClubEntity = socio.clubs.find(e => e.id === club.id);

        if (!socioClub)
            throw new BusinessLogicException("The club with the given id is not associated to the socio", BusinessError.PRECONDITION_FAILED)

        return socioClub;
    }

    async findClubsBySocioId(socioId: string): Promise<ClubEntity[]> {
        const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socioId }, relations: ["clubs"] });
        if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        return socio.clubs;
    }

    async associateClubsSocio(socioId: string, clubId: ClubEntity[]): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socioId }, relations: ["clubs"] });

        if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        for (let i = 0; i < clubId.length; i++) {
            const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId[i].id } });
            if (!club)
                throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
        }

        socio.clubs = clubId;
        return await this.socioRepository.save(socio);
    }

    async deleteClubSocio(socioId: string, clubId: string) {
        const club: ClubEntity = await this.clubRepository.findOne({ where: { id: clubId } });
        if (!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        const socio: SocioEntity = await this.socioRepository.findOne({ where: { id: socioId }, relations: ["clubs"] });
        if (!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        const socioClubs: ClubEntity = socio.clubs.find(e => e.id === club.id);

        if (!socioClubs)
            throw new BusinessLogicException("The club with the given id is not associated to the socio", BusinessError.PRECONDITION_FAILED)

        socio.clubs = socio.clubs.filter(e => e.id !== clubId);
        await this.socioRepository.save(socio);
    }
}
