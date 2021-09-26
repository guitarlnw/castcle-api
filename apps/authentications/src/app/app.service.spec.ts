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
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { GetUserDto } from './dto/get-user.dto';

const mockComparePass = compare as jest.Mock;
jest.mock('bcrypt', () => {
  return {
    compare: jest.fn()
  };
});

describe('AppService', () => {
  let service: AppService;

  const mockData: GetUserDto = {
    "_id": "614d74878b2169401188a3f2",
    "showAds": true,
    "verified": true,
    "role": "member",
    "preferredLanguage": [
      "th",
      "en"
    ],
    "avatar": "http://image.com",
    "email": "email@castcle.com",
    "displayName": "castcle-avenger",
    "castcleId": "castcle-avenger",
    "id": "d30ba6e3-10e5-44ee-aa7c-d37ffd6c69e9",
    "created": "2021-09-24T06:47:35.403Z",
    "updated": "2021-09-24T06:47:35.403Z"
  }

  const mockGetUserByEmailService = jest.fn()
  const mockUserService = {
    getUserByEmail: mockGetUserByEmailService
  }
  const mockSignJwtService = jest.fn()
  const mockJwtService = {
    sign: mockSignJwtService
  }

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('validateUser', () => {
    it('should return user info without password when password comparing is correct', async () => {
      mockGetUserByEmailService.mockImplementationOnce(() => ({
        password: 'xxx',
        id: 'qqq'
      }))
      mockComparePass.mockImplementationOnce(() => true)
      const result = await service.validateUser('castcle', 'qazxsw')
      expect(result).toEqual({ id: 'qqq' })
      expect(mockGetUserByEmailService).toHaveBeenCalledTimes(1)
      expect(mockGetUserByEmailService).toHaveBeenCalledWith('castcle')
      expect(mockComparePass).toHaveBeenCalledTimes(1)
      expect(mockComparePass).toHaveBeenCalledWith('qazxsw', 'xxx')
    });

    it('should return null when password is incorrect', async () => {
      mockGetUserByEmailService.mockImplementationOnce(() => ({
        password: 'xxx',
        id: 'qqq'
      }))
      mockComparePass.mockImplementationOnce(() => false)
      const result = await service.validateUser('castcle', 'qazxsw')
      expect(result).toEqual(null)
      expect(mockGetUserByEmailService).toHaveBeenCalledTimes(1)
      expect(mockGetUserByEmailService).toHaveBeenCalledWith('castcle')
      expect(mockComparePass).toHaveBeenCalledTimes(1)
      expect(mockComparePass).toHaveBeenCalledWith('qazxsw', 'xxx')
    });

    it('should return null when user is empty', async () => {
      mockGetUserByEmailService.mockImplementationOnce(() => null)
      mockComparePass.mockImplementationOnce(() => true)
      const result = await service.validateUser('castcle', 'qazxsw')
      expect(result).toEqual(null)
      expect(mockGetUserByEmailService).toHaveBeenCalledTimes(1)
      expect(mockGetUserByEmailService).toHaveBeenCalledWith('castcle')
      expect(mockComparePass).toHaveBeenCalledTimes(0)
    });
  });


  describe('login', () => {
    it('should return access token jwt', async () => {
      mockSignJwtService.mockImplementationOnce(() => 'xxx')
      const result = await service.login(mockData)
      expect(result).toEqual({ access_token: 'xxx' })
      expect(mockSignJwtService).toHaveBeenCalledTimes(1)
      expect(mockSignJwtService).toHaveBeenCalledWith(mockData)
    });
  });
});
