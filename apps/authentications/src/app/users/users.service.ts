import { Injectable, HttpService } from '@nestjs/common';
import { GetUserDto } from '../dto/get-user.dto'

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(private httpService: HttpService) { }

  async getUserByEmail(email: string): Promise<GetUserDto | null> {
    try {
      const result = await this.httpService.get(`${process.env.USER_URL}/users/${email}`).toPromise();
      return result.data.payload
    } catch {
      return null
    }
  }
}