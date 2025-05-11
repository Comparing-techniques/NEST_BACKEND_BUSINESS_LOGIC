import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JointService } from './joint.service';
import { CreateJointDto } from './dto/create-joint.dto';
import { UpdateJointDto } from './dto/update-joint.dto';
import { AuthGuardGuard } from 'src/auth/auth-guard/auth-guard.guard';
import { UserGuardGuard } from 'src/auth/auth-guard/user-guard.guard';

@Controller('joint')
export class JointController {
  constructor(private readonly jointService: JointService) {}

  @Post()
  @UseGuards(AuthGuardGuard)
  async create(@Body() createJointDto: CreateJointDto) {
    return await this.jointService.create(createJointDto);
  }

  @Get()
  @UseGuards(UserGuardGuard)
  async findAll() {
    return await this.jointService.findAll();
  }

  @Get(':id')
  @UseGuards(UserGuardGuard)
  async findOne(@Param('id') id: string) {
    return await this.jointService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardGuard)
  async update(
    @Param('id') id: string,
    @Body() updateJointDto: UpdateJointDto,
  ) {
    return await this.jointService.update(+id, updateJointDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardGuard)
  async remove(@Param('id') id: string) {
    return await this.jointService.remove(+id);
  }
}
