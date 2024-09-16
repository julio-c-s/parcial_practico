/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity'

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @Column()
    foundationDate: Date;
    @Column()
    image: string;
    @Column()
    description: string;

    @ManyToMany(() => SocioEntity, (socio) => socio.clubs)
    socios: SocioEntity[];
}
