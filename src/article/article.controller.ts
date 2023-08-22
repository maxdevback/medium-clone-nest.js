import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/user/entities/user.entity';
import { UserDecorator } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UserDecorator() user: User,
  ) {
    return await this.articleService.create(user, createArticleDto);
  }

  @Get()
  async findAll(@UserDecorator() user: User | undefined, @Query() query: any) {
    return await this.articleService.findAll(query, user.id);
  }

  @Get('/feed')
  @UseGuards(AuthGuard)
  async getFeed(@UserDecorator() user: User, @Query() query: any) {
    return await this.articleService.getFeed(query, user.id);
  }
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.articleService.findBySlug(slug);
  }
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addToFavorite(
    @UserDecorator() user: User,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.addToFavorite(slug, user.id);
  }
  @Delete(':slag/unfavorite')
  @UseGuards(AuthGuard)
  async deleteFromFavorite(
    @UserDecorator() user: User,
    @Param('slag') slag: string,
  ) {
    return await this.articleService.deleteFromFavorites(slag, user.id);
  }

  @Patch(':slug')
  @UseGuards(AuthGuard)
  async update(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @UserDecorator() user: User,
  ) {
    return await this.articleService.update(slug, user.id, updateArticleDto);
  }

  @Delete(':slag')
  @UseGuards(AuthGuard)
  deleteBySlug(@Param('slag') slug: string, @UserDecorator() user: User) {
    return this.articleService.deleteBySlag(slug, user.id);
  }
}
