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

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GetUserDto } from './dto/get-user.dto';

describe('AppController', () => {
  let appController: AppController;

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
  const mockService = {
    getUserByEmail: (email) => {
      if (email === "example@mail.com") {
        return mockData
      }
      return null
    }
  }

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockService,
        },
      ],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('getUserByEmail', () => {
    it('should return user data when email is correct', async () => {
      expect(await appController.getUserByEmail("example@mail.com"))
        .toEqual({ payload: mockData, message: 'Success' });
    });
    it('should return user data when email is incorrect', async () => {
      try {
        await appController.getUserByEmail("incorrect@mail.com")
      } catch (err) {
        expect(err).toEqual(new NotFoundException())
      }
    });
  });
});
