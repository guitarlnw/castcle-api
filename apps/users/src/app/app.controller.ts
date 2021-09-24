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

import { Controller, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { GetUserDto } from './dto/get-user.dto';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

@Controller()
@UseInterceptors(TransformInterceptor, ErrorsInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/:email')
  async getUserByEmail(@Param("email") email: string) {
    const data = await this.appService.getUserByEmail(email)
    if (!data) {
      throw new NotFoundException()
    }
    const final: GetUserDto = {
      _id: data._id,
      showAds: data.showAds,
      verified: data.verified,
      role: data.role,
      password: data.password,
      preferredLanguage: data.preferredLanguage,
      avatar: data.avatar,
      email: data.email,
      displayName: data.displayName,
      castcleId: data.castcleId,
      id: data.id,
      created: data.created,
      updated: data.updated,
    }
    return { payload: final, message: "Success" }
  }
}
