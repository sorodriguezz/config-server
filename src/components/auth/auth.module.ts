import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { BasicStrategy } from '../../common/strategies/basic.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
  ],
  providers: [AuthService, BasicStrategy],
  exports: [AuthService],
})
export class AuthModule {}
