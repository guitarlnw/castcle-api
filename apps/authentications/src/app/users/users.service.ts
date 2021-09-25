import { Injectable, HttpService } from '@nestjs/common';
import { GetUserDto } from '../dto/get-user.dto'

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(private httpService: HttpService) { }

  private readonly users = [
    {
      userId: 1,
      email: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'maria',
      password: 'guess',
    },
  ];

  async getUserByEmail(email: string): Promise<GetUserDto | null> {
    try {
      const result = await this.httpService.get(`${process.env.USER_URL}/users/${email}`).toPromise();
      return result.data.payload
    } catch (err) {
      return null
    }
  }
}