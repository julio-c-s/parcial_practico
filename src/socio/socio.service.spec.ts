/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
    let service: SocioService;
    let repository: Repository<SocioEntity>;
    let socioList: SocioEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [SocioService],
        }).compile();

        service = module.get<SocioService>(SocioService);
        repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
        await seedDatabase();
    });

    const seedDatabase = async () => {
        repository.clear();
        socioList = [];
        for(let i = 0; i < 5; i++){
            const socio: SocioEntity = await repository.save({
            name: faker.company.name(), 
            email: faker.internet.email(), 
            birthDate: faker.date.birthdate(), 
            description: faker.lorem.sentence(),
        })
        socioList.push(socio);
      }
    }

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll should return all socios', async () => {
        const socios: SocioEntity[] = await service.findAll();
        expect(socios).not.toBeNull();
        expect(socios).toHaveLength(socioList.length);
      });

      it('findOne should return a socio by id', async () => {
        const storeSocio: SocioEntity = socioList[0];
        const socio: SocioEntity = await service.findOne(storeSocio.id);
        expect(socio).not.toBeNull();
        expect(socio.name).toEqual(storeSocio.name)
        expect(socio.description).toEqual(storeSocio.description)
      });

      it('findOne should throw an exception for an invalid socio', async () => {
        await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
      });

      it('create should return a new socio', async () => {
        const socio: SocioEntity = {
            id: "", 
            name: faker.company.name(), 
            email: faker.internet.email(), 
            birthDate: faker.date.birthdate(), 
            description: faker.lorem.sentence(),
            clubs: []
        }
    
        const newSocio: SocioEntity = await service.create(socio);
        expect(newSocio).not.toBeNull();
    
        const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}})
        expect(storedSocio).not.toBeNull();
        expect(storedSocio.name).toEqual(newSocio.name)
        expect(storedSocio.description).toEqual(newSocio.description)
      });

      it('update should modify a socio', async () => {
        const socio: SocioEntity = socioList[0];
        socio.name = "New name";
        socio.email = "new@mail.com";
      
        const updatedSocio: SocioEntity = await service.update(socio.id, socio);
        expect(updatedSocio).not.toBeNull();
      
        const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
        expect(storedSocio).not.toBeNull();
        expect(storedSocio.name).toEqual(socio.name)
        expect(storedSocio.email).toEqual(socio.email)
      });

      it('update should throw an exception for an invalid socio', async () => {
        let socio: SocioEntity = socioList[0];
        socio = {
          ...socio, name: "New name", email: "New address"
        }
        await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "The socio with the given id was not found")
      });

      it('delete should remove a socio', async () => {
        const socio: SocioEntity = socioList[0];
        await service.delete(socio.id);
      
        const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
        expect(deletedSocio).toBeNull();
      });
    
      it('delete should throw an exception for an invalid socio', async () => {
        const socio: SocioEntity = socioList[0];
        await service.delete(socio.id);
        await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
      });
});

