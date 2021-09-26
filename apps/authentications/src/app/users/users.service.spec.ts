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

import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockHttpGet = jest.fn()
  const mockHttpService = {
    get: () => ({
      toPromise: mockHttpGet
    })
  }

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = app.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUserByEmail', () => {
    it('should return user info when email is correct', async () => {
      mockHttpGet.mockImplementationOnce(() => ({
        data: { payload: { id: 'xxx' } }
      }))
      const result = await service.getUserByEmail('castcle@mail.com')
      expect(result).toEqual({ id: 'xxx' })
      expect(mockHttpGet).toHaveBeenCalledTimes(1)
    });

    it('should return null when email is incorrect', async () => {
      mockHttpGet.mockImplementationOnce(() => { throw new Error() })
      const result = await service.getUserByEmail('castcle@mail.com')
      expect(result).toEqual(null)
      expect(mockHttpGet).toHaveBeenCalledTimes(1)
    });
  });
});
