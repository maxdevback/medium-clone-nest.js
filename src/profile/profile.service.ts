import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Follow) private readonly followRepo: Repository<Follow>,
    private readonly userService: UserService,
  ) {}
  async getProfile(authId: number, profileUsername: string) {
    const profile = await this.userService.findOne({
      where: { username: profileUsername },
    });
    if (!profile)
      throw new NotFoundException('User with that username not found');
    const follow = await this.followRepo.findOne({
      where: { followerId: authId, followingId: authId },
    });
    return { ...profile, following: !!follow };
  }
  async followUser(authId: number, profileUsername: string) {
    const profile = await this.userService.findOne({
      where: { username: profileUsername },
    });
    if (!profile)
      throw new NotFoundException('User with that username not found');
    if (profile.id === authId)
      throw new ConflictException('Follower and Following cant be equal');
    const follow = await this.followRepo.find({
      where: { followerId: authId, followingId: profile.id },
    });
    if (follow)
      throw new ConflictException("You're already following this profile");
    const newFollow = new Follow();
    newFollow.followerId = authId;
    newFollow.followingId = profile.id;
    return await this.followRepo.save(newFollow);
  }

  async unFollowUser(authId: number, profileUsername: string) {
    const profile = await this.userService.findOne({
      where: { username: profileUsername },
    });
    if (!profile)
      throw new NotFoundException('User with that username not found');
    if (profile.id === authId)
      throw new ConflictException('Follower and Following cant be equal');
    const follow = await this.followRepo.find({
      where: { followerId: authId, followingId: profile.id },
    });
    if (!follow)
      throw new ConflictException("You're not following this profile");
    return await this.followRepo.remove(follow);
  }
}
