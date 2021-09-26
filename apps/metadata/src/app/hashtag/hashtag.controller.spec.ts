import { Test, TestingModule } from '@nestjs/testing';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { ResponsePaginate } from '../utils/pagination.utils'
import { InternalServerErrorException } from '@nestjs/common';

describe('HashtagController', () => {
  let controller: HashtagController;

  const mockGetData = jest.fn()
  const mockService = {
    getPaginate: mockGetData,
  }

  beforeEach(async () => {
    jest.resetAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HashtagController],
      providers: [
        {
          provide: HashtagService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<HashtagController>(HashtagController);
  });

  it('should return data follow ResponsePaginate type when working of controller is correct', async () => {
    mockGetData.mockImplementationOnce((page, limit): ResponsePaginate => ({
      payload: [],
      pagination: {
        self: page,
        next: page + 1,
        limit,
        total: 200,
      }
    }))
    const result = await controller.getPaginate(1, 10)

    expect(mockGetData).toHaveBeenCalledTimes(1)
    expect(mockGetData).toHaveBeenCalledWith(1, 10)
    expect(result).toEqual({
      payload: [],
      pagination: {
        self: 1,
        next: 2,
        limit: 10,
        total: 200,
      }
    });
  });

  it('should return error 500 when working of controller is incorrect', async () => {
    mockGetData.mockImplementationOnce(() => {
      throw new Error("Some thing went wrong!")
    })
    try {
      await controller.getPaginate(1, 10)
    } catch (err) {
      expect(mockGetData).toHaveBeenCalledTimes(1)
      expect(err).toEqual(new InternalServerErrorException())
    }
  });
});
