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

import { ParseUUIDPipe } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt'

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class User {
  @Prop({ required: true, unique: true })
  id: ParseUUIDPipe;

  @Prop({ required: true })
  castcleId: string;

  @Prop({ required: true, trim: true })
  displayName: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop([String])
  preferredLanguage: string[];

  @Prop({
    type: String,
    enum: ['member', 'guest'],
    default: 'user'
  })
  role: string;

  @Prop({ default: true })
  verified: boolean;

  @Prop({ default: true })
  showAds: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', userPreSaveHook);

export async function userPreSaveHook(next) {
  this.id = uuidv4();
  this.password = await hash(this.password, 10);
  next();
}
