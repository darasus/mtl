import { ApiResponse } from '@mtl/api-types';
import { Route } from '@mtl/types';
import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get(Route.Tags)
  getTags(): Promise<ApiResponse[Route.Tags]> {
    return this.tagService.getAllTags();
  }
}
