/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SocioClubService } from './socio-club.service';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SocioClubService', () => {
	let service: SocioClubService;
	let socioRepository: Repository<SocioEntity>;
	let clubRepository: Repository<ClubEntity>;
	let socio: SocioEntity;
	let clubList: ClubEntity[];

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [...TypeOrmTestingConfig()],
			providers: [SocioClubService],
		}).compile();

		service = module.get<SocioClubService>(SocioClubService);
		socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
		clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

		await seedDatabase();
	});

	const seedDatabase = async () => {
		clubRepository.clear();
		socioRepository.clear();

		clubList = [];
		for (let i = 0; i < 5; i++) {
			const club: ClubEntity = await clubRepository.save({
				name: faker.company.name(), 
				foundationDate: faker.date.birthdate(), 
				image: faker.lorem.sentence(),
				description: faker.lorem.sentence(),
			})
			clubList.push(club);
		}

		socio = await socioRepository.save({
			name: faker.company.name(), 
            email: faker.internet.email(), 
            birthDate: faker.date.birthdate(), 
            description: faker.lorem.sentence(),
			clubs: clubList
		})
	}

	test('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('addClubSocio should add an club to a socio', async () => {
		const newClub: ClubEntity = await clubRepository.save({
			name: faker.company.name(), 
			foundationDate: faker.date.birthdate(), 
			image: faker.lorem.sentence(),
			description: faker.lorem.sentence(),
		});

		const newSocio: SocioEntity = await socioRepository.save({
			name: faker.company.name(), 
            email: faker.internet.email(), 
            birthDate: faker.date.birthdate(), 
            description: faker.lorem.sentence(),
		})

		const result: SocioEntity = await service.addClubSocio(newSocio.id, newClub.id);

		expect(result.clubs.length).toBe(1);
		expect(result.clubs[0]).not.toBeNull();
		expect(result.clubs[0].name).toBe(newClub.name)
		expect(result.clubs[0].image).toBe(newClub.image)
	});

	it('addClubSocio should thrown exception for an invalid club', async () => {
		const newSocio: SocioEntity = await socioRepository.save({
			name: faker.company.name(), 
            email: faker.internet.email(), 
            birthDate: faker.date.birthdate(), 
            description: faker.lorem.sentence(),
		})

		await expect(() => service.addClubSocio(newSocio.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found");
	});

	it('addClubSocio should throw an exception for an invalid socio', async () => {
		const newClub: ClubEntity = await clubRepository.save({
			name: faker.company.name(), 
			foundationDate: faker.date.birthdate(), 
			image: faker.lorem.sentence(),
			description: faker.lorem.sentence(),
		});

		await expect(() => service.addClubSocio("0", newClub.id)).rejects.toHaveProperty("message", "The socio with the given id was not found");
	});

	it('findClubBySocioIdClubId should return club by socio', async () => {
		const club: ClubEntity = clubList[0];
		const storedClub: ClubEntity = await service.findClubBySocioIdClubId(socio.id, club.id,)
		expect(storedClub).not.toBeNull();
		expect(storedClub.name).toBe(club.name);
		expect(storedClub.image).toBe(club.image);
		expect(storedClub.description).toBe(club.description);
	});

	it('findClubBySocioIdClubId should throw an exception for an invalid club', async () => {
		await expect(() => service.findClubBySocioIdClubId(socio.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found");
	});

	it('findClubBySocioIdClubId should throw an exception for an invalid socio', async () => {
		const club: ClubEntity = clubList[0];
		await expect(() => service.findClubBySocioIdClubId("0", club.id)).rejects.toHaveProperty("message", "The socio with the given id was not found");
	});

	it('findClubBySocioIdClubId should throw an exception for an club not associated to the socio', async () => {
		const newClub: ClubEntity = await clubRepository.save({
			name: faker.company.name(), 
			foundationDate: faker.date.birthdate(), 
			image: faker.lorem.sentence(),
			description: faker.lorem.sentence(),
		});

		await expect(() => service.findClubBySocioIdClubId(socio.id, newClub.id)).rejects.toHaveProperty("message", "The club with the given id is not associated to the socio");
	});

	it('findClubsBySocioId should return clubs by socio', async () => {
		const clubs: ClubEntity[] = await service.findClubsBySocioId(socio.id);
		expect(clubs.length).toBe(5)
	});

	it('findClubsBySocioId should throw an exception for an invalid socio', async () => {
		await expect(() => service.findClubsBySocioId("0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
	});

	it('associateClubsSocio should update clubs list for a socio', async () => {
		const newClub: ClubEntity = await clubRepository.save({
			name: faker.company.name(), 
			foundationDate: faker.date.birthdate(), 
			image: faker.lorem.sentence(),
			description: faker.lorem.sentence(),
		});

		const updatedSocio: SocioEntity = await service.associateClubsSocio(socio.id, [newClub]);
		expect(updatedSocio.clubs.length).toBe(1);

		expect(updatedSocio.clubs[0].name).toBe(newClub.name);
		expect(updatedSocio.clubs[0].description).toBe(newClub.description);
	});

	it('deleteClubToSocio should remove an club from a socio', async () => {
		const club: ClubEntity = clubList[0];

		await service.deleteClubSocio(socio.id, club.id);

		const storedSocio: SocioEntity = await socioRepository.findOne({ where: { id: socio.id }, relations: ["clubs"] });
		const deletedClub: ClubEntity = storedSocio.clubs.find(a => a.id === club.id);

		expect(deletedClub).toBeUndefined();

	});
});
