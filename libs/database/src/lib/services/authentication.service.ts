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
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccountDocument, Account } from '../schemas/account.schema';
import { Environment as env } from '@castcle-api/environments';
import * as mongoose from 'mongoose';
import { CreateCredentialDto, CreateAccountDto } from "../dtos/account.dto"
import { CredentialDocument } from "../schemas/credential.schema"

const generateToken = (header:{[key:string]:string}, payload:any, secret:string) => `encode:$${JSON.stringify(header)}.${JSON.stringify(payload)}.${secret}`

export interface AccountRequirements{
    header:{
        platform:string,
    },
    device:string,
    deviceUUID:string,
    languagesPreferences:string[]
}

export interface AccessTokenPayload{
    device:string,
    deviceUUID:string
    
}

@Injectable()
export class AuthenticationService {
    constructor(@InjectModel('Account') private accountModel:Model<AccountDocument>, @InjectModel('Credential') private credentialModel:Model<CredentialDocument> ){}

    getCredentialFromDeviceUUID = (deviceUUID:string) => this.credentialModel.findOne({deviceUUID:deviceUUID}).exec();

    async createAccount(accountRequirements:AccountRequirements){
        const now = new Date();
        const newAccount = new this.accountModel({
            isGuest:true,
            preferences:{
                languages:accountRequirements.languagesPreferences
            },
            createDate:now,
            updateDate:now
        } as CreateAccountDto)
        const accountDocument = await newAccount.save()
        const tokens = this._generateAccessToken(accountRequirements.header, {
            device:accountRequirements.device,
            deviceUUID:accountRequirements.deviceUUID
        })
        const credentialDocument = new this.credentialModel({
            account: mongoose.Types.ObjectId(accountDocument._id),
            accessToken: tokens.accessToken,
            accessTokenExpireDate: tokens.accessTokenExpireDate,
            refreshToken: tokens.refreshToken,
            refreshTokenExpireDate: tokens.refreshTokenExpireDate,
            createDate: now,
            updateDate: now,
            device: accountRequirements.device,
            platform: accountRequirements.header.platform,
            deviceUUID: accountRequirements.deviceUUID
        } as CreateCredentialDto)
        return { accountDocument, credentialDocument }
    }

    _generateAccessToken(header:{[key:string]:string}, payload:AccessTokenPayload){
        const now = new Date();
        const accessToken = generateToken(header, payload, env.jwt_access_secret);
        const accessTokenExpireDate =  new Date(now.getTime() + env.jwt_access_expires_in * 1000);
        const refreshToken = generateToken(header, payload, env.jwt_refresh_secret);
        const refreshTokenExpireDate = new Date(now.getTime() + env.jwt_refresh_expires_in);
        return { accessToken, accessTokenExpireDate, refreshToken, refreshTokenExpireDate}
    }

    verifyAccessToken(token:string, header:{[key:string]:string}, payload:any){

    }

    refreshAccessToken(refreshToken:string){

    }

    createAccountWithEmail( email:string, password:string, accessToken:string){

    }

    verifyAccountWithEmail( verifyToken:string){

    }

    loginWithEmail( email:string, password:string){

    }

    /*async create(createAccountDto:CreateAccountDto){
        const createdAccount = new this.accountModel(createAccountDto);
        const resultSavedCreatedAccount = await createdAccount.save();
        const createdCredential = new this.credentialModel({
            account: mongoose.Types.ObjectId(resultSavedCreatedAccount._id),
            accessToken: "guestAccessToken",
            refreshToken: "guestAccessToken",
            refreshTokenExpireDate: new Date(),
            accessTokenExpireDate: new Date(),
            device: "Ifong 112",
            platform: "guestA",
            deviceUUID: "UUUID",
            createDate:new Date(),
            updateDate:new Date()
        })
        await createdCredential.save()
        return {
            account:createdAccount,
            credential:createdCredential
        }
    }

    async update(){

    }

    async delete(){

    }

    async findById(id:any){
        return this.accountModel.findById(id)
    }

    async getTotalDocuments(){
        return  this.accountModel.countDocuments().exec()
    }*/
}