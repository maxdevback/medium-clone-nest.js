import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList: string[];
}
