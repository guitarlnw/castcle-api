import { Controller, Get, Query, ParseIntPipe, InternalServerErrorException } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { ResponsePaginate } from '../utils/pagination.utils';

@Controller('metadata/hashtags')
export class HashtagController {
  constructor(private hashtagService: HashtagService) { }

  @Get()
  async getPaginate(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number
  ) {
    try {
      const result: ResponsePaginate = await this.hashtagService.getPaginate(page, limit);
      return { ...result }
    } catch {
      throw new InternalServerErrorException()
    }
  }
}
