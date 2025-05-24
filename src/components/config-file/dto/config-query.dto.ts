import { ApiProperty } from "@nestjs/swagger";

export class ConfigQueryDto {
  @ApiProperty({
    description: 'Nombre exacto del repositorio',
    example: 'my-repo',
  })
  repo!: string;

  @ApiProperty({
    description: 'Nombre de la aplicación',
    example: 'my-app',
  })
  application!: string;

  @ApiProperty({
    description: 'Perfil que se desea consultar',
    example: 'dev',
  })
  profile!: string;
}
