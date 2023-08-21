import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ISession } from './types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Session() session: ISession,
  ) {
    const user = await this.userService.register(registerUserDto);
    return (session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Session() session: ISession,
  ) {
    const user = await this.userService.login(loginUserDto);
    return (session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  authData(@UserDecorator() user: User) {
    return user;
  }

  @Put()
  @UseGuards(AuthGuard)
  async update(
    @UserDecorator() user: User,
    @Body() updateUserDto: UpdateUserDto,
    @Session() session: ISession,
  ) {
    const updatedUser = await this.userService.update(+user.id, updateUserDto);
    return (session.user = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    });
  }
}
