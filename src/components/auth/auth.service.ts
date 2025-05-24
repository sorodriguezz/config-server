import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import type { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { envs } from '../../config/envs.config';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createUser({
      username: envs.BASIC_AUTH_USERNAME,
      password: envs.BASIC_AUTH_PASSWORD,
      name: 'Administrator',
    });
  }

  async createUser(createUserDto: {
    username: string;
    password: string;
    name: string;
  }): Promise<Omit<User, 'password'>> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
      name: createUserDto.name,
    });

    await this.usersRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { username, isActive: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
