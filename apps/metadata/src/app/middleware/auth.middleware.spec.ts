/*
 * Copyright (c) 2021, Castcle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 * 
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 3 only, as
 * published by the Free Software Foundation.
 * 
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
 * version 3 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 * 
 * You should have received a copy of the GNU General Public License version
 * 3 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 * 
 * Please contact Castcle, 22 Phet Kasem 47/2 Alley, Bang Khae, Bangkok, 
 * Thailand 10160, or visit www.castcle.com if you need additional information 
 * or have any questions.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, UnauthorizedException } from '@nestjs/common';

import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;

  const mockNext = jest.fn()
  const mockHttpGet = jest.fn()
  const mockHttpService = {
    get: () => ({
      toPromise: mockHttpGet
    })
  }

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();
    middleware = app.get<AuthMiddleware>(AuthMiddleware);
  });

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call next function when authorized', async () => {
    const mockReq: any = { headers: { authorization: 'xxx' } }
    mockHttpGet.mockImplementationOnce(() => ({ id: '' }))
    await middleware.use(mockReq, null, mockNext)
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should error UnauthorizedException when auth api unauthorized', async () => {
    try {
      const mockReq: any = { headers: { authorization: 'xxx' } }
      mockHttpGet.mockImplementationOnce(() => { throw new Error() })
      await middleware.use(mockReq, null, mockNext)
    } catch (err) {
      expect(err).toEqual(new UnauthorizedException())
    }
  });

  it('should error UnauthorizedException when accessToken is empty', async () => {
    try {
      const mockReq: any = { headers: { authorization: '' } }
      mockHttpGet.mockImplementationOnce(() => ({ id: '' }))
      await middleware.use(mockReq, null, mockNext)
    } catch (err) {
      expect(err).toEqual(new UnauthorizedException())
    }
  });
});
