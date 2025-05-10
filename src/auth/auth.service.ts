/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position, User } from 'src/entities';
import { Repository } from 'typeorm';
import { SignUpDto, SignInDto } from './dto';
import { alreadyExists, notFoundById } from 'src/utils/DtoValidators';
import * as bcrypt from 'bcrypt';
import { userEntitieToUserResponseDtoWithToken } from 'src/mappers/Auth.mapper';
import { positionEntitieToPositionResponseDto } from 'src/mappers/Position.mapper';
import { INVALID_PASSWORD, NOT_FOUND_BY_EMAIL } from 'src/utils/AuthValidators';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/utils/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
    private jwtService: JwtService,
  ) {}

  async register(signUpDto: SignUpDto) {
    try {
      const {
        name,
        lastName,
        email,
        identificationNumber,
        password,
        positionId,
      } = signUpDto;

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
          alreadyExists(identificationNumber, 'IdentificationNumber', 'User'),
        );

      const validPositionId = await this.positionRepository.findOne({
        where: { id: positionId },
      });
      if (!validPositionId)
        throw new BadRequestException(notFoundById(positionId, 'positionId'));

      const newUser = this.userRepository.create({
        name,
        lastName,
        email,
        identificationNumber,
        position: { id: positionId }, // opcionalmente como objeto
        password: await bcrypt.hash(password, 10),
      });

      const savedUser = await this.userRepository.save(newUser);

      if (!savedUser) throw new BadRequestException('Error creating user');

      const position = positionEntitieToPositionResponseDto(validPositionId);
      const token = await this.getJwtToken({ id: savedUser.id + '', iat: 0 });
      return userEntitieToUserResponseDtoWithToken(newUser, position, token);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async login(signInDto: SignInDto) {
    try {
      const { email, password } = signInDto;

      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) throw new BadRequestException(NOT_FOUND_BY_EMAIL);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException(INVALID_PASSWORD);

      const position = positionEntitieToPositionResponseDto(user.position);

      const token = await this.getJwtToken({ id: user.id + '', iat: 0 });
      return userEntitieToUserResponseDtoWithToken(user, position, token);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getJwtToken(payload: JwtPayload) {
    const token = await this.jwtService.signAsync(payload);

    return token;
  }
}
