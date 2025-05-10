import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JointService } from './joint.service';
import { CreateJointDto } from './dto/create-joint.dto';
import { UpdateJointDto } from './dto/update-joint.dto';

@Controller('joint')
export class JointController {
  constructor(private readonly jointService: JointService) {}

  @Post()
  async create(@Body() createJointDto: CreateJointDto) {
    return await this.jointService.create(createJointDto);
  }

  @Get()
  async findAll() {
    return await this.jointService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.jointService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJointDto: UpdateJointDto,
  ) {
    return await this.jointService.update(+id, updateJointDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.jointService.remove(+id);
  }
}
