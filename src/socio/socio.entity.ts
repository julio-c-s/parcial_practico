/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ClubEntity } from '../club/club.entity';

@Entity()
export class SocioEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    birthDate: Date;
    @Column({ length: 100 })
    description: string;

    @ManyToMany(() => ClubEntity, (club) => club.socios)
    @JoinTable()
    clubs: ClubEntity[];
}
