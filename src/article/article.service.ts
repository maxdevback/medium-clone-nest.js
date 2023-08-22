import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { UserService } from 'src/user/user.service';
import slugify from 'slugify';
import { User } from 'src/user/entities/user.entity';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}
  async create(user: User, createArticleDto: CreateArticleDto) {
    const newArticle = new Article();
    Object.assign(newArticle, createArticleDto);
    if (!createArticleDto.tagList) {
      newArticle.tagList = [];
    }
    newArticle.slug = this._generateSlag(createArticleDto.title);
    newArticle.author = user;
    return await this.articleRepo.save(newArticle);
  }
  async deleteBySlag(slug: string, userId: number) {
    const article = await this.articleRepo.findOne({
      where: { slug },
      relations: ['author'],
    });
    if (!article) throw new NotFoundException('Article with that id not exist');
    if (article.author.id !== userId)
      throw new ForbiddenException("You're not owner");
    return await this.articleRepo.remove(article);
  }
  async findAll(query: any, userId?: number) {
    const queryBuilder = this.articleRepo
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}`,
      });
    }

    if (query.author) {
      const author = await this.userService.findOne({
        where: { username: query.author },
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.favorited) {
      const author = await this.userService.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = author.favorites.map((el) => el.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (userId) {
      const currentUser = await this.userService.findOne({
        where: { id: userId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorited, articlesCount };
  }
  async getFeed(query: any, userId: number) {
    const follows = await this.profileService.get({
      where: { followerId: userId },
    });
    if (!follows[0]) return { articles: [], articlesCount: 0 };
    const followingUserIds = follows.map((follow) => follow.followingId);
    const queryBuilder = this.articleRepo
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }
  async addToFavorite(slug: string, userId: number) {
    const article = await this.articleRepo.findOne({ where: { slug } });
    if (!article)
      throw new NotFoundException('Article with that slag dose not found');
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) throw new NotFoundException('Something went wrong with auth');
    const articleInFavorite = user.favorites.filter(
      (item) => item.id === article.id,
    );
    if (articleInFavorite[0])
      throw new ConflictException(
        "You're already added this article to favorites",
      );
    user.favorites.push(article);
    article.favoritesCount++;
    await this.userService.save(user);
    await this.articleRepo.save(article);
    return article;
  }
  async deleteFromFavorites(slug: string, userId: number) {
    const article = await this.articleRepo.findOne({ where: { slug } });
    if (!article)
      throw new NotFoundException('Article with that slag dose not found');
    const user = await this.userService.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) throw new NotFoundException('Something went wrong with auth');
    const articlesLength = user.favorites.length;
    user.favorites = user.favorites.filter((item) => item.id !== article.id);
    if (articlesLength === user.favorites.length)
      throw new ConflictException("You're not added this article to favorites");
    if (article.favoritesCount > 0) article.favoritesCount--;
    await this.articleRepo.save(article);
    await this.userService.save(user);
    return article;
  }
  _generateSlag(title: string) {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
  async findBySlug(slug: string) {
    const article = await this.articleRepo.findOne({ where: { slug } });
    if (!article)
      throw new NotFoundException('Article with that slag dose not exist');
    return article;
  }

  async update(
    slug: string,
    userId: number,
    updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.articleRepo.findOne({ where: { slug } });
    if (!article) throw new NotFoundException('Article with that id not exist');
    if (article.author.id !== userId)
      throw new ForbiddenException("You're not owner");

    Object.assign(article, updateArticleDto);
    return await this.articleRepo.save(article);
  }
}
