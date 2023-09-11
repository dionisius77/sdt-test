import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLogs, TimeZone, User } from '@app/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from '@app/helpers';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TimeZone, EventLogs]),
    MailModule,
    ScheduleModule.forRoot()
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
