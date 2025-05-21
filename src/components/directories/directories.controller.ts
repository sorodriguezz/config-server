import { Controller, Get, Logger, Query } from '@nestjs/common';
import { DirectoriesService } from './directories.service';

@Controller('directories')
export class DirectoriesController {
  private readonly logger = new Logger(DirectoriesController.name);

  constructor(private readonly directoriesService: DirectoriesService) {}

  @Get()
  listDirectories() {
    const directories = this.directoriesService.listDirectories();
    return directories;
  }
}
