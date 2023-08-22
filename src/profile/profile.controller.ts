import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @UserDecorator() user: User | undefined,
  ) {
    return await this.profileService.getProfile(username, user.id);
  }
  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async follow(
    @Param('username') username: string,
    @UserDecorator() user: User,
  ) {
    return await this.profileService.followUser(username, user.id);
  }

  @Delete(':username/unFollow')
  @UseGuards(AuthGuard)
  async unFollow(
    @Param('username') username: string,
    @UserDecorator() user: User,
  ) {
    return await this.profileService.unFollowUser(username, user.id);
  }
}
