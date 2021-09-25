import { Module, HttpModule } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  imports: [HttpModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }