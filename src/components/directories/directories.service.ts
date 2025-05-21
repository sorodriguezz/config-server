import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { envs } from '../../config/envs.config';
import { BASE_REPOS_PATH } from '../../config/constants.config';

@Injectable()
export class DirectoriesService {
  private readonly logger = new Logger(DirectoriesService.name);

  listDirectories(): { name: string; path: string; isDirectory: boolean }[] {
    try {
      if (!fs.existsSync(BASE_REPOS_PATH)) {
        this.logger.warn(`Path does not exist: ${BASE_REPOS_PATH}`);
        return [];
      }

      const items = fs.readdirSync(BASE_REPOS_PATH);

      const directories: any = items
        .filter((item) => {
          try {
            const fullPath = path.join(BASE_REPOS_PATH, item);
            return fs.statSync(fullPath).isDirectory();
          } catch (error) {
            return false;
          }
        })
        .map((dirName) => {
          const dirPath = path.join(BASE_REPOS_PATH, dirName);

          let files: any = [];
          try {
            files = fs
              .readdirSync(dirPath)
              .filter((file) => {
                try {
                  if (file.startsWith('.')) return false;
                  return fs.statSync(path.join(dirPath, file)).isFile();
                } catch (error) {
                  return false;
                }
              })
              .map((fileName) => {
                const filePath = path.join(dirPath, fileName);
                try {
                  return fileName;
                } catch (error: any) {
                  return {
                    name: fileName,
                    error: error.message,
                  };
                }
              });
          } catch (error: any) {
            this.logger.warn(
              `Error reading files in directory ${dirName}: ${error.message}`,
            );
          }

          return {
            name: dirName,
            files: files,
          };
        });
      this.logger.debug('Directories found');
      return directories;
    } catch (error: any) {
      this.logger.error(
        `Error listing directories: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
