import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import { ProfileService } from 'src/profile/profile.service';
import { Follow } from 'src/profile/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Follow])],
  controllers: [ArticleController],
  providers: [ArticleService, UserService, ProfileService],
})
export class ArticleModule {}
