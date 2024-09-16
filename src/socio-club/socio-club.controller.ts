/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { plainToInstance } from 'class-transformer';
import { ClubEntity } from 'src/club/club.entity';
import { ClubDto } from 'src/club/club.dto';

@Controller('members')
export class SocioClubController {
    constructor(private readonly socioClubService: SocioClubService) { }

    @Post(':socioId/clubs/:clubId')
    async addClubMember(@Param('socioId') socioId: string, @Param('clubId') clubId: string) {
        return await this.socioClubService.addClubSocio(socioId, clubId);
    }

    @Get(':socioId/clubs/:clubId')
    async findClubByMemberIdClubId(@Param('socioId') socioId: string, @Param('clubId') clubId: string) {
        return await this.socioClubService.findClubBySocioIdClubId(socioId, clubId);
    }

    @Get(':socioId/clubs')
    async findClubsByMemberId(@Param('socioId') socioId: string) {
        return await this.socioClubService.findClubsBySocioId(socioId);
    }

    @Put(':socioId/clubs')
    async associateClubsMember(@Body() clubsDto: ClubDto[], @Param('socioId') socioId: string) {
        const clubs = plainToInstance(ClubEntity, clubsDto)
        return await this.socioClubService.associateClubsSocio(socioId, clubs);
    }

    @Delete(':socioId/clubs/:clubId')
    @HttpCode(204)
    async deleteClubMember(@Param('socioId') socioId: string, @Param('clubId') clubId: string) {
        return await this.socioClubService.deleteClubSocio(socioId, clubId);
    }
}
