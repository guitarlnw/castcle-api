import { Test } from '@nestjs/testing';
import { CommonController } from './common.controller';

describe('CommonController', () => {
  let controller: CommonController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [CommonController],
    }).compile();

    controller = module.get(CommonController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
