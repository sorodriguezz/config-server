import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicAuth } from '../../common/decorators/auth.decorator';
import { DirectoriesService } from './directories.service';

@Controller('directories')
@ApiTags('Directories')
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) {}

  @Get()
  @BasicAuth()
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
