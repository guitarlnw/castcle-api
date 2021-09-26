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

import { Logger, Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule, LangMiddleware } from '@castcle-api/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health/health.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSeeder } from './database/seeders/user.seeder';
import { User, UserSchema } from './schemas/user.schema';


@Module({
  imports: [
    CommonModule,
    TerminusModule,
    MongooseModule.forRoot(process.env.DB_CONNECTION),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [
    AppController,
    HealthController,
  ],
  providers: [
    AppService,
    UserSeeder,
  ],
})
export class AppModule {
  constructor(private readonly userSeeder: UserSeeder) {
    this.userSeeder.seed()
      .then(() => { Logger.log("Seed success") })
      .catch(() => { Logger.log("Seed fail") })
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LangMiddleware)
      .exclude({ path: '/health', method: RequestMethod.GET })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
