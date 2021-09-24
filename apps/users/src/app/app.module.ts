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

import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import * as path from 'path';
import { APP_FILTER } from '@nestjs/core';

import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSeeder } from './database/seeders/user.seeder';
import { User, UserSchema } from './schemas/user.schema';
import { HttpExceptionFilter } from './filters/http-exception.filter'

@Module({
  imports: [
    HealthModule,
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/assets/i18n/'),
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserSeeder,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private readonly userSeeder: UserSeeder) {
    this.userSeeder.seed()
      .then(() => { Logger.log("Seed success") })
      .catch(() => { Logger.log("Seed fail") })
  }
}
