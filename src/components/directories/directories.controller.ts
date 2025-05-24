import { Controller, Get, HttpCode, HttpStatus, Logger, Query } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('directories')
@ApiTags('Directories')
export class DirectoriesController {
  private readonly logger = new Logger(DirectoriesController.name);

  constructor(private readonly directoriesService: DirectoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sincronizar repositorios' })
  @ApiResponse({
    status: 200,
    description: 'Repositorios sincronizados exitosamente',
  })
  listDirectories() {
    const directories = this.directoriesService.listDirectories();
    return directories;
  }
}
