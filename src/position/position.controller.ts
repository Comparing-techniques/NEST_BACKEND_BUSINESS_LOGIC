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
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { AuthGuardGuard } from 'src/auth/auth-guard/auth-guard.guard';

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @UseGuards(AuthGuardGuard)
  async create(@Body() createPositionDto: CreatePositionDto) {
    return await this.positionService.create(createPositionDto);
  }

  @Get()
  async findAll() {
    return await this.positionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.positionService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return await this.positionService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardGuard)
  async remove(@Param('id') id: string) {
    return await this.positionService.remove(+id);
  }
}
