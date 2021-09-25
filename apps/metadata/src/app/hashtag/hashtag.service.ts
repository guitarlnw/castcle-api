import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { HashtagDocument, Hashtag } from '../schemas/hashtag.schema';
import { getPagination, ResponsePaginate } from '../utils/pagination.utils';

@Injectable()
export class HashtagService {
  constructor(@InjectModel(Hashtag.name) private hashtagModel: Model<HashtagDocument>) { }

  async getPaginate(page: number, limit: number): Promise<ResponsePaginate> {
    return await getPagination(this.hashtagModel, page, limit)
  }
}
