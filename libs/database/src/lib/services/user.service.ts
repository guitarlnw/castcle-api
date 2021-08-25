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
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccountDocument } from '../schemas/account.schema';
import { CredentialDocument, CredentialModel } from '../schemas';
import { UserDocument, UserType, UserModel } from '../schemas/user.schema';
import { RelationshipDocument } from '../schemas/relationship.schema';
import { FollowResponse, PageDto, UpdateUserDto } from '../dtos/user.dto';
import { CastcleQueryOptions } from '../dtos';
import { createPagination } from '../utils/common';
import { DEFAULT_QUERY_OPTIONS, Pagination } from '../dtos/common.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Account') public _accountModel: Model<AccountDocument>,
    @InjectModel('Credential')
    public _credentialModel: CredentialModel,
    @InjectModel('User')
    public _userModel: UserModel,
    @InjectModel('Relationship')
    public _relationshipModel: Model<RelationshipDocument>
  ) {}

  getUserFromCredential = (credential: CredentialDocument) =>
    this._userModel
      .findOne({ ownerAccount: credential.account._id, type: UserType.People })
      .exec();

  getUserFromId = (id: string) => {
    try {
      if (mongoose.Types.ObjectId(id)) {
        return this._userModel.findById(id).exec();
      } else return null;
    } catch (error) {
      return null;
    }
  };

  updateUser = (user: UserDocument, updateUserDto: UpdateUserDto) => {
    if (!user.profile) user.profile = {};
    if (updateUserDto.overview) user.profile.overview = updateUserDto.overview;
    if (updateUserDto.dob) user.profile.birthdate = updateUserDto.dob;
    if (updateUserDto.links) {
      if (!user.profile.socials) user.profile.socials = {};
      const socialNetworks = ['facebook', 'medium', 'twitter', 'youtube'];
      socialNetworks.forEach((social) => {
        if (updateUserDto.links[social])
          user.profile.socials[social] = updateUserDto.links[social];
        if (updateUserDto.links.website)
          user.profile.websites = [
            {
              website: updateUserDto.links.website,
              detail: updateUserDto.links.website
            }
          ];
      });
    }
    if (updateUserDto.images) {
      if (!user.profile.images) user.profile.images = {};
      if (updateUserDto.images.avatar)
        user.profile.images.avatar = updateUserDto.images.avatar;
      if (updateUserDto.images.cover)
        user.profile.images.cover = updateUserDto.images.cover;
    }
    console.log('saving dto', updateUserDto);

    console.log('saving website', user.profile.websites);
    console.log('saving user', user);
    return user.save();
  };

  deleteUserFromId = (id: string) =>
    this._userModel.findByIdAndDelete(id).exec();

  createPageFromCredential = async (
    credential: CredentialDocument,
    pageDto: PageDto
  ) => {
    const user = await this.getUserFromCredential(credential);
    return this.createPageFromUser(user, pageDto);
  };

  createPageFromUser = (user: UserDocument, pageDto: PageDto) => {
    const newPage = new this._userModel({
      ownerAccount: user.ownerAccount,
      type: UserType.Page,
      displayId: pageDto.castcleId,
      displayName: pageDto.displayName,
      profile: {
        images: {
          avatar: pageDto.avatar,
          cover: pageDto.cover
        }
      }
    });
    return newPage.save();
  };

  /**
   * get all pages
   * @param {CastcleQueryOptions} queryOptions
   * @returns {Promise<{items:UserDocument[], pagination:Pagination}>}
   */
  getAllPages = async (queryOptions: CastcleQueryOptions) => {
    const pagination = createPagination(
      queryOptions,
      await this._userModel.count({ type: UserType.Page })
    );
    const itemsQuery = this._userModel
      .find({ type: UserType.Page })
      .skip(queryOptions.page - 1)
      .limit(queryOptions.limit);
    let items: UserDocument[];
    if (queryOptions.sortBy.type === 'desc')
      items = await itemsQuery.sort(`-${queryOptions.sortBy.field}`).exec();
    else items = await itemsQuery.sort(`${queryOptions.sortBy.field}`).exec();
    return { items, pagination };
  };
  /**
   *
   * @param {UserDocument} user
   * @param {UserDocument} followedUser
   * @returns {Promise<void>}
   */
  follow = async (user: UserDocument, followedUser: UserDocument) =>
    user.follow(followedUser);
  /**
   *
   * @param {UserDocument} user
   * @param {UserDocument} followedUser
   * @returns {Promise<void>}
   */
  unfollow = async (user: UserDocument, followedUser: UserDocument) =>
    user.unfollow(followedUser);

  /**
   *
   * @param user
   * @param queryOption
   * @returns
   */
  getFollower = async (
    user: UserDocument,
    queryOption: CastcleQueryOptions = DEFAULT_QUERY_OPTIONS
  ) => {
    console.log('-----getFollower----');

    const filter: { followedUser: any; isFollowPage?: boolean } = {
      followedUser: user._id
    };
    console.log('filter', filter);
    if (queryOption.type)
      filter.isFollowPage = queryOption.type === UserType.Page ? true : false;
    let query = this._relationshipModel
      .find(filter)
      .skip(queryOption.page - 1)
      .limit(queryOption.limit)
      .populate('user');
    if (queryOption.sortBy.type === 'desc')
      query = query.sort(`-${queryOption.sortBy.field}`);
    else query = query.sort(`${queryOption.sortBy.field}`);
    const totalFollower = await this._relationshipModel.count(filter).exec();
    const relationships = await query.exec();
    console.log('total', totalFollower);
    console.log(relationships);
    return {
      items: relationships.map((r) =>
        this._userModel.covertToUserResponse(r.user)
      ),
      pagination: createPagination(queryOption, totalFollower)
    };
  };

  /**
   *
   * @param user
   * @param queryOption
   * @returns
   */
  getFollowing = async (
    user: UserDocument,
    queryOption: CastcleQueryOptions = DEFAULT_QUERY_OPTIONS
  ) => {
    const filter: { user: any; isFollowPage?: boolean } = { user: user._id };
    if (queryOption.type)
      filter.isFollowPage = queryOption.type === UserType.Page ? true : false;
    let query = this._relationshipModel
      .find(filter)
      .skip(queryOption.page - 1)
      .limit(queryOption.limit);
    //      .populate('followedUser');
    if (queryOption.sortBy.type === 'desc')
      query = query.sort(`-${queryOption.sortBy.field}`);
    else query = query.sort(`${queryOption.sortBy.field}`);
    const totalFollowing = await this._relationshipModel.count(filter).exec();
    const relationships = await query.exec();
    return {
      items: relationships.map((r) =>
        this._userModel.covertToUserResponse(r.followedUser)
      ),
      pagination: createPagination(queryOption, totalFollowing)
    };
  };
}
