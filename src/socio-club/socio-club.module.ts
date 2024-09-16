/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SocioClubService } from './socio-club.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { SocioModule } from '../socio/socio.module';
import { ClubModule } from '../club/club.module';
import { SocioEntity } from 'src/socio/socio.entity';
import { SocioClubController } from './socio-club.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClubEntity, SocioEntity]),
    SocioModule,
    ClubModule
  ],
  providers: [SocioClubService],
  controllers: [SocioClubController]
})
export class SocioClubModule{}
