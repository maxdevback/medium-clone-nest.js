import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { compare as comparePassword } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async register({ email, username, password }: RegisterUserDto) {
    const userWithThatEmail = await this.userRepo.findOne({
      where: { email },
    });
    if (userWithThatEmail)
      throw new ConflictException('User with that email already exist');
    const userWithThatUsername = await this.userRepo.findOne({
      where: { username },
    });
    if (userWithThatUsername)
      throw new ConflictException('User with that username already exist');
    const newUser = this.userRepo.create({ email, username, password });
    return await this.userRepo.save(newUser);
  }
  async login({ email, password }: LoginUserDto) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['email', 'password', 'id', 'username'],
    });
    if (!user) throw new NotFoundException('User with that email not found');
    if (await comparePassword(password, user.password)) return user;
    throw new ConflictException('Password is wrong');
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User with that id not found');
    Object.assign(user, updateUserDto);
    return await this.userRepo.save(user);
  }
  async findOne(options: FindOneOptions<User>) {
    return await this.userRepo.findOne(options);
  }
  async save(user: User) {
    return await this.userRepo.save(user);
  }
}
