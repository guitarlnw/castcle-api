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
import { I18nService } from 'nestjs-i18n';

import { HttpExceptionFilter } from './http-exception.filter';

describe('AppController', () => {
  let exFilter: HttpExceptionFilter;
  const mockResStatus = jest.fn()
  const mockResJson = jest.fn()
  const mockAcceptLanguage = jest.fn()
  const mockException: any = { getStatus: jest.fn() }
  const mockHost: any = {
    switchToHttp: () => ({
      getResponse: () => ({
        status: (statusCode) => {
          mockResStatus(statusCode)
          return { json: mockResJson }
        }
      }),
      getRequest: mockAcceptLanguage,
    })
  }
  const mockI18n = {
    translate: (key, { lang }) => {
      if (key === "response.404" && lang === "th") {
        return "ไม่พบข้อ"
      }
      if (key === "response.500" && lang === "en") {
        return "Internal Server Error"
      }
    }
  }

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: I18nService,
          useValue: mockI18n,
        },
      ],
    }).compile();
    exFilter = app.get<HttpExceptionFilter>(HttpExceptionFilter);
  });
  beforeEach(() => {
    jest.resetAllMocks()
  });

  describe('HttpExceptionFilter', () => {
    it('should return 500 and "Internal Server Error" when statusCode is 500 and "en" language', async () => {
      mockException.getStatus.mockImplementationOnce(() => 500)
      mockAcceptLanguage.mockImplementationOnce(() => ({
        headers: { 'accept-language': 'en' }
      }))
      await exFilter.catch(mockException, mockHost)
      expect(mockResStatus).toHaveBeenCalledTimes(1)
      expect(mockResStatus).toHaveBeenCalledWith(500)
      expect(mockResJson).toHaveBeenCalledTimes(1)
      expect(mockResJson).toHaveBeenCalledWith({
        error: { code: 500, message: 'Internal Server Error' }
      })
    });

    it('should return 404 and "ไม่พบข้อ" when statusCode is 404 and "th" language', async () => {
      mockException.getStatus.mockImplementationOnce(() => 404)
      mockAcceptLanguage.mockImplementationOnce(() => ({
        headers: { 'accept-language': 'th' }
      }))
      await exFilter.catch(mockException, mockHost)
      expect(mockResStatus).toHaveBeenCalledTimes(1)
      expect(mockResStatus).toHaveBeenCalledWith(404)
      expect(mockResJson).toHaveBeenCalledTimes(1)
      expect(mockResJson).toHaveBeenCalledWith({
        error: { code: 404, message: 'ไม่พบข้อ' }
      })
    });
  });
});
