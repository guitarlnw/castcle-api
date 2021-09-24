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

import { userPreSaveHook } from './user.schema';
import { v4 } from 'uuid';
import { hash } from 'bcrypt';

const mockUUIDv4 = v4 as jest.Mock;
const mockHash = hash as jest.Mock;
jest.mock('uuid', () => {
  return {
    v4: jest.fn()
  };
});
jest.mock('bcrypt', () => {
  return {
    hash: jest.fn()
  };
});

describe('userPreSaveHook', () => {

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('should execute next middleware, generate uuid and hash password when pre save function was called', async () => {
    const expectedData = { id: 'd30ba6e3-10e5-44ee-aa7c-d37ffd6c69e9', password: 'zxcvfdsaqwer' }
    const mNext = jest.fn();
    const mContext = {
      id: '',
      password: 'mock-pass'
    };
    mockUUIDv4.mockImplementationOnce(() => expectedData.id)
    mockHash.mockImplementationOnce(() => expectedData.password)
    await userPreSaveHook.call(mContext, mNext);
    expect(mContext).toEqual(expectedData);
    expect(mNext).toBeCalledTimes(1);
  });
});