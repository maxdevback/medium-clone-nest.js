import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll() {
    const tags = await this.tagService.findAll();
    return tags.map((tag) => tag.name);
  }
}
