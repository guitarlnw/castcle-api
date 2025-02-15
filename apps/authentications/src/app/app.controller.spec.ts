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

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController

  const mockLoginService = jest.fn()
  const mockService = {
    login: mockLoginService,
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

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('login', () => {
    it('should return payload and message when controller.login is called ', async () => {
      const mockReq = { user: { id: 'xxx' } }
      mockLoginService.mockImplementation(() => mockReq.user)
      const result = await appController.login(mockReq)
      expect(result).toEqual({ payload: mockReq.user, message: 'Logged in' })
      expect(mockLoginService).toHaveBeenCalledTimes(1)
      expect(mockLoginService).toHaveBeenCalledWith(mockReq.user)
    });
  });

  describe('auth', () => {
    it('should return message when controller.auth is called ', () => {
      const result = appController.auth()
      expect(result).toEqual({ message: 'Authorized' })
    });
  });
});
