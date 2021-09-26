import { Test, TestingModule } from '@nestjs/testing';
import { HashtagService } from './hashtag.service';
import { getModelToken } from '@nestjs/mongoose';
import { getPagination, ResponsePaginate } from '../utils/pagination.utils'

const mockModel = jest.fn()
const mockGetPagination = getPagination as jest.Mock;
jest.mock('../utils/pagination.utils', () => {
  return {
    getPagination: jest.fn()
  };
});

describe('HashtagService', () => {
  let service: HashtagService;

  beforeEach(async () => {
    jest.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashtagService,
        {
          provide: getModelToken('Hashtag'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<HashtagService>(HashtagService);
  });

  it('should return data follow ResponsePaginate when working of getPaginate is correct', async () => {
    const mockData = {
      payload: [],
      pagination: {
        self: 1,
        next: 2,
        limit: 10,
        total: 200,
      }
    }
    mockGetPagination.mockImplementationOnce((): ResponsePaginate => (mockData))
    const result = await service.getPaginate(1, 10)
    expect(result).toEqual(mockData)
    expect(mockGetPagination).toHaveBeenCalledTimes(1)
    expect(mockGetPagination).toHaveBeenCalledWith(mockModel, 1, 10)
  });
});
