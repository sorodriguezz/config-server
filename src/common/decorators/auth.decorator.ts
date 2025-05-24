import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function BasicAuth() {
  return applyDecorators(
    UseGuards(AuthGuard('basic')),
    ApiBasicAuth('basic'),
    ApiUnauthorizedResponse({ description: 'No autorizado' }),
  );
}
