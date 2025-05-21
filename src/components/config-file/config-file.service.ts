import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as properties from 'properties';

import type { IConfigFile } from './interfaces/config-file.interface';

@Injectable()
export class ConfigFileService {
  private readonly logger = new Logger(ConfigFileService.name);

  async readConfigFile(
    repositoryPath: string,
    fileName: string,
  ): Promise<IConfigFile> {
    const filePath = path.join(repositoryPath, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${fileName} not found`);
    }

    const extension = path.extname(fileName).toLowerCase();
    const content = fs.readFileSync(filePath, 'utf8');

    return {
      name: fileName,
      content: this.parseContent(content, extension),
      extension: extension.substring(1),
    };
  }

   private parseContent(content: string, extension: string): any {
    try {
      switch (extension.toLowerCase()) {
        case '.json':
          return JSON.parse(content);
        case '.yaml':
          return yaml.load(content);
        case '.yml':
          return yaml.load(content);
        case '.properties':
          return properties.parse(content, {
            path: false,
            variables: true,
            sections: true,
            namespace: true,
          });
        default:
          return content;
      }
    } catch (error: any) {
      this.logger.error(`Error parsing file: ${error.message}`);
      throw error;
    }
  }
}
