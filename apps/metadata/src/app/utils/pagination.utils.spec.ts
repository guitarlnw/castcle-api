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

import { getPagination, ResponsePaginate } from './pagination.utils'

describe('Pagination Utils', () => {

  const mockExec = jest.fn()
  const mockLimit = jest.fn()
  const mockSkip = jest.fn()
  const mockFind = jest.fn()
  const mockCount = jest.fn()
  const mockModel = {
    find: () => {
      mockFind()
      return {
        skip: (offest) => {
          mockSkip(offest)
          return {
            limit: (limit) => {
              mockLimit(limit)
              return {
                exec: mockExec
              }
            },
          }
        },
      }
    },
    count: mockCount
  }

  beforeEach(async () => {
    jest.resetAllMocks()
  });

  it('should return pagination.previous equal undefined when page is 1', async () => {
    mockExec.mockImplementationOnce(() => [])
    mockCount.mockImplementationOnce(() => 200)
    const result: ResponsePaginate = await getPagination(mockModel, 1, 10)
    expect(mockExec).toHaveBeenCalledTimes(1)
    expect(mockFind).toHaveBeenCalledTimes(1)
    expect(mockLimit).toHaveBeenCalledWith(10)
    expect(mockSkip).toHaveBeenCalledWith(0)
    expect(result.pagination.previous).toBeUndefined()
  });

  it('should return pagination.previous equal 1 when page is 2', async () => {
    mockExec.mockImplementationOnce(() => [])
    mockCount.mockImplementationOnce(() => 200)
    const result: ResponsePaginate = await getPagination(mockModel, 2, 20)
    expect(mockExec).toHaveBeenCalledTimes(1)
    expect(mockFind).toHaveBeenCalledTimes(1)
    expect(mockLimit).toHaveBeenCalledWith(20)
    expect(mockSkip).toHaveBeenCalledWith(20)
    expect(result.pagination.previous).toBe(1)
  });

  it('should return pagination.next equal undefined when don`t have next page', async () => {
    mockExec.mockImplementationOnce(() => [])
    mockCount.mockImplementationOnce(() => 100)
    const result: ResponsePaginate = await getPagination(mockModel, 10, 10)
    expect(mockExec).toHaveBeenCalledTimes(1)
    expect(mockFind).toHaveBeenCalledTimes(1)
    expect(mockLimit).toHaveBeenCalledWith(10)
    expect(mockSkip).toHaveBeenCalledWith(90)
    expect(result.pagination.next).toBeUndefined()
  });

  it('should return pagination.next equal 3 when page is 2', async () => {
    mockExec.mockImplementationOnce(() => [])
    mockCount.mockImplementationOnce(() => 100)
    const result: ResponsePaginate = await getPagination(mockModel, 2, 10)
    expect(mockExec).toHaveBeenCalledTimes(1)
    expect(mockFind).toHaveBeenCalledTimes(1)
    expect(mockLimit).toHaveBeenCalledWith(10)
    expect(mockSkip).toHaveBeenCalledWith(10)
    expect(result.pagination.next).toBe(3)
  });

  it('should return ResponsePaginate when working is success', async () => {
    mockExec.mockImplementationOnce(() => [])
    mockCount.mockImplementationOnce(() => 100)
    const result: ResponsePaginate = await getPagination(mockModel, 2, 10)
    expect(mockExec).toHaveBeenCalledTimes(1)
    expect(mockFind).toHaveBeenCalledTimes(1)
    expect(mockLimit).toHaveBeenCalledWith(10)
    expect(mockSkip).toHaveBeenCalledWith(10)
    expect(result).toEqual({
      payload: [],
      pagination: {
        previous: 1,
        self: 2,
        next: 3,
        limit: 10,
        total: 100,
      }
    })
  });

  it('should return null when function error', async () => {
    mockExec.mockImplementationOnce(() => { throw new Error() })
    const result: ResponsePaginate = await getPagination(mockModel, 2, 10)
    expect(result).toBe(null)
  });
});
