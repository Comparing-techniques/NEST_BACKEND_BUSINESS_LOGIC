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
import { RecordingInstitutionService } from './recording-institution.service';
import { CreateRecordingInstitutionDto } from './dto/create-recording-institution.dto';
import { UpdateRecordingInstitutionDto } from './dto/update-recording-institution.dto';
import { AuthGuardGuard } from 'src/auth/auth-guard/auth-guard.guard';
@UseGuards(AuthGuardGuard)
@Controller('recording-institution')
export class RecordingInstitutionController {
  constructor(
    private readonly recordingInstitutionService: RecordingInstitutionService,
  ) {}

  @Post()
  @UseGuards(AuthGuardGuard)
  async create(
    @Body() createRecordingInstitutionDto: CreateRecordingInstitutionDto,
  ) {
    return await this.recordingInstitutionService.create(
      createRecordingInstitutionDto,
    );
  }

  @Get()
  async findAll() {
    return await this.recordingInstitutionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.recordingInstitutionService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardGuard)
  async update(
    @Param('id') id: string,
    @Body() updateRecordingInstitutionDto: UpdateRecordingInstitutionDto,
  ) {
    return await this.recordingInstitutionService.update(
      +id,
      updateRecordingInstitutionDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuardGuard)
  async remove(@Param('id') id: string) {
    return await this.recordingInstitutionService.remove(+id);
  }
}
