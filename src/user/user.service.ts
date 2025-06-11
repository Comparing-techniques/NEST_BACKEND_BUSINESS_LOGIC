import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Position, User } from 'src/entities';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  alreadyExists,
  notFoundById,
} from 'src/utils/DtoValidators';

import {
  userEntityToResponseDto,
  userEntityToResponseDtoList,
} from '../mappers/User.mapper';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Position)
            private readonly positionRepository: Repository<Position>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const {
                name,
                lastName,
                email,
                identificationNumber,
                password,
                positionId,
            } = createUserDto;

            const existingUserByEmail = await this.userRepository.findOne({
                where: { email },
            });

            if (existingUserByEmail)
            throw new BadRequestException(alreadyExists(email, 'email', 'User'));

            const existingUserByIdentificationNumber =
            await this.userRepository.findOne({
                where: { identificationNumber },
            });

            if (existingUserByIdentificationNumber)
            throw new BadRequestException(
                alreadyExists(identificationNumber, 'identificationNumber', 'User'),
            );

            const validPosition = await this.positionRepository.findOne({
                where: { id: positionId },
            });
            if (!validPosition)
            throw new BadRequestException(notFoundById(positionId, 'Position'));

            const newUser = this.userRepository.create({
                name,
                lastName,
                email,
                identificationNumber,
                password: await bcrypt.hash(password, 10),
                position: { id: positionId },
            });

            const savedUser = await this.userRepository.save(newUser);
            return userEntityToResponseDto(savedUser);
        } catch (error) {
            if (error.code && error.code === '23505') {
                throw new BadRequestException(
                    alreadyExists(
                        createUserDto.email || createUserDto.identificationNumber,
                        'email o identificación',
                        'User',
                    ),
                );
            }
            throw new InternalServerErrorException(error);
        }
    }


    async findAll() {
        try {
            const users = await this.userRepository.find({
                where: { status: true },
                relations: ['position'],
            });

            if (!users || users.length === 0) return [];

            return userEntityToResponseDtoList(users);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findOne(id: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id, status: true },
                relations: ['position'],
            });

            if (!user) throw new BadRequestException(notFoundById(id, 'User'));

            return userEntityToResponseDto(user);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        try {
            const originalUser = await this.userRepository.findOneBy({ id });

            if (!originalUser)
                throw new BadRequestException(notFoundById(id, 'User'));

            const updatePayload = {
                ...updateUserDto,
                ...(updateUserDto.positionId && {
                    position: { id: updateUserDto.positionId },
                }),
            };

            await this.userRepository.update(id, updatePayload);

            const updated = await this.userRepository.findOne({
                where: { id },
                relations: ['position'],
            });

            if (updated) return userEntityToResponseDto(updated);

            return [];
        } catch (error) {
            if (error.code && error.code === '23505') {
                throw new BadRequestException(
                    alreadyExists(
                        updateUserDto.email || updateUserDto.identificationNumber || '',
                        'email o identificación',
                        'User',
                    ),
                );
            }
            throw new BadRequestException(error);
        }
    }

    async remove(id: number) {
        try {
            const result = await this.userRepository.delete({ id });

            if (result.affected === 0)
                throw new BadRequestException(notFoundById(id, 'User'));

            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}